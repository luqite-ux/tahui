import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { optimizeProductMainImage } from './lib/product-main-image-optimizer.mjs'

const TENANT_ID = '650973a7-73d8-4105-bc0c-93ff9029676a'
const apply = process.argv.includes('--apply')
const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`)
const publicBase = (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
if (!publicBase) throw new Error('Missing R2_PUBLIC_URL or R2_PUBLIC_URL_PREFIX')

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length)
  let nextIndex = 0
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await worker(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
  return results
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: products, error } = await supabase
  .from('products')
  .select('id,slug,image_url,extra_data,is_active')
  .eq('tenant_id', TENANT_ID)
  .eq('is_active', true)
  .order('slug')
if (error) throw error
if (products.length !== 238) throw new Error(`Expected 238 active products, found ${products.length}`)
if (products.some((product) => !/^https:\/\//.test(product.image_url || ''))) throw new Error('Every active product must have an absolute HTTPS main image')

const uniqueSources = [...new Set(products.map((product) => product.image_url))]
const assets = await mapLimit(uniqueSources, 4, async (sourceUrl, index) => {
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`Download failed ${response.status}: ${sourceUrl}`)
  const sourceBody = Buffer.from(await response.arrayBuffer())
  const optimized = await optimizeProductMainImage(sourceBody)
  const digest = createHash('sha256').update(optimized.body).digest('hex')
  const key = `products/${TENANT_ID}/catalog-main-web-v1/${digest.slice(0, 24)}.webp`
  process.stderr.write(`optimized ${index + 1}/${uniqueSources.length}\r`)
  return {
    sourceUrl,
    sourceBytes: sourceBody.length,
    outputBytes: optimized.body.length,
    body: optimized.body,
    width: optimized.width,
    height: optimized.height,
    key,
    newUrl: `${publicBase}/${key}`,
  }
})
process.stderr.write('\n')

const assetBySource = new Map(assets.map((asset) => [asset.sourceUrl, asset]))
const optimizedAt = new Date().toISOString()
const changes = products.map((product) => {
  const asset = assetBySource.get(product.image_url)
  const oldExtra = product.extra_data && typeof product.extra_data === 'object' ? product.extra_data : {}
  const oldImages = Array.isArray(oldExtra.images) ? oldExtra.images : []
  return {
    id: product.id,
    slug: product.slug,
    old_image_url: product.image_url,
    new_image_url: asset.newUrl,
    old_extra_data: oldExtra,
    new_extra_data: {
      ...oldExtra,
      images: oldImages.length ? [asset.newUrl, ...oldImages.slice(1)] : [asset.newUrl],
      main_image_width: asset.width,
      main_image_height: asset.height,
      main_image_background: '#F7F4EE',
      main_image_web_optimized_at: optimizedAt,
    },
  }
})

await mkdir('deliverables', { recursive: true })
const stamp = optimizedAt.replace(/[:.]/g, '-')
const evidencePath = path.resolve('deliverables', `web-optimized-main-images-${stamp}.json`)
await writeFile(evidencePath, JSON.stringify({
  tenant_id: TENANT_ID,
  mode: apply ? 'apply' : 'dry-run',
  product_count: products.length,
  unique_asset_count: assets.length,
  source_bytes: assets.reduce((sum, asset) => sum + asset.sourceBytes, 0),
  output_bytes: assets.reduce((sum, asset) => sum + asset.outputBytes, 0),
  assets: assets.map((asset) => ({
    sourceUrl: asset.sourceUrl,
    sourceBytes: asset.sourceBytes,
    outputBytes: asset.outputBytes,
    width: asset.width,
    height: asset.height,
    key: asset.key,
    newUrl: asset.newUrl,
  })),
  changes,
}, null, 2))
console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', products: products.length, uniqueAssets: assets.length, evidencePath }))
if (!apply) process.exit(0)

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_S3_ENDPOINT,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
let uploaded = 0
for (const asset of assets) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: asset.key }))
  } catch {
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: asset.key,
      Body: asset.body,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }))
    uploaded += 1
  }
}

let updated = 0
for (const change of changes) {
  const { data, error: updateError } = await supabase
    .from('products')
    .update({ image_url: change.new_image_url, extra_data: change.new_extra_data })
    .eq('tenant_id', TENANT_ID)
    .eq('id', change.id)
    .eq('image_url', change.old_image_url)
    .select('id')
  if (updateError) throw updateError
  if (data.length !== 1) throw new Error(`Optimistic update failed for ${change.slug}`)
  updated += 1
}

const { data: verified, error: verifyError } = await supabase
  .from('products')
  .select('id,slug,image_url,extra_data')
  .eq('tenant_id', TENANT_ID)
  .eq('is_active', true)
if (verifyError) throw verifyError
const prefix = `${publicBase}/products/${TENANT_ID}/catalog-main-web-v1/`
const invalid = verified.filter((product) =>
  !product.image_url.startsWith(prefix)
  || product.extra_data?.images?.[0] !== product.image_url
  || !(product.extra_data?.main_image_width > 0)
  || !(product.extra_data?.main_image_height > 0)
)
if (verified.length !== 238 || invalid.length) throw new Error(`Verification failed: rows=${verified.length}, invalid=${invalid.length}`)
console.log(JSON.stringify({ uploaded, updated, verified: verified.length, uniqueUrls: new Set(verified.map((product) => product.image_url)).size, invalid: invalid.length }))
