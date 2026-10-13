import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const TENANT_ID = '650973a7-73d8-4105-bc0c-93ff9029676a'
const argv = new Set(process.argv.slice(2))
const apply = argv.has('--apply')
const temp = process.env.TEMP
const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`)
const publicBase = (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
if (!publicBase) throw new Error('Missing R2_PUBLIC_URL or R2_PUBLIC_URL_PREFIX')

const mappings = []
for (let worker = 0; worker < 3; worker += 1) {
  mappings.push(...JSON.parse(await readFile(path.join(temp, `tahui-main-warm-white-map-${worker}.json`), 'utf8')))
}
const bySource = new Map(mappings.map((row) => [row.source_url, row]))
if (bySource.size !== 229) throw new Error(`Expected 229 unique processed images, found ${bySource.size}`)

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: products, error } = await supabase.from('products').select('id,slug,image_url,extra_data,is_active').eq('tenant_id', TENANT_ID).eq('is_active', true).order('slug')
if (error) throw error
if (products.length !== 238) throw new Error(`Expected 238 active products, found ${products.length}`)
for (const product of products) if (!bySource.has(product.image_url)) throw new Error(`No processed image for ${product.slug}: ${product.image_url}`)

const readPngSize = (buffer) => {
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error('Processed image is not PNG')
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}
const assets = []
for (const [sourceUrl, row] of bySource) {
  const body = await readFile(row.output_path)
  const digest = createHash('sha256').update(body).digest('hex')
  const key = `products/${TENANT_ID}/catalog-main-warm-white/${digest.slice(0, 24)}.png`
  assets.push({ sourceUrl, outputPath: row.output_path, body, digest, key, newUrl: `${publicBase}/${key}`, ...readPngSize(body) })
}
const assetBySource = new Map(assets.map((asset) => [asset.sourceUrl, asset]))
const changes = products.map((product) => {
  const asset = assetBySource.get(product.image_url)
  const oldExtra = product.extra_data && typeof product.extra_data === 'object' ? product.extra_data : {}
  const oldImages = Array.isArray(oldExtra.images) ? oldExtra.images : []
  const images = oldImages.length ? [asset.newUrl, ...oldImages.slice(1)] : [asset.newUrl]
  return {
    id: product.id,
    slug: product.slug,
    old_image_url: product.image_url,
    new_image_url: asset.newUrl,
    width: asset.width,
    height: asset.height,
    old_extra_data: oldExtra,
    new_extra_data: { ...oldExtra, images, main_image_width: asset.width, main_image_height: asset.height, main_image_background: '#F7F4EE', main_image_processed_at: new Date().toISOString() },
  }
})

await mkdir('deliverables', { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const evidencePath = path.resolve('deliverables', `warm-white-main-images-${stamp}.json`)
await writeFile(evidencePath, JSON.stringify({ tenant_id: TENANT_ID, mode: apply ? 'apply' : 'dry-run', product_count: products.length, unique_asset_count: assets.length, changes }, null, 2))
console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', products: products.length, uniqueAssets: assets.length, evidencePath }))
if (!apply) process.exit(0)

const r2 = new S3Client({ region: 'auto', endpoint: process.env.R2_S3_ENDPOINT, requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED', credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } })
let uploaded = 0
for (const asset of assets) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: asset.key }))
  } catch {
    await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: asset.key, Body: asset.body, ContentType: 'image/png', CacheControl: 'public, max-age=31536000, immutable' }))
    uploaded += 1
  }
  const response = await fetch(asset.newUrl, { method: 'HEAD' })
  if (!response.ok) throw new Error(`Public verification failed ${response.status}: ${asset.newUrl}`)
}

let updated = 0
for (const change of changes) {
  const { data, error: updateError } = await supabase.from('products').update({ image_url: change.new_image_url, extra_data: change.new_extra_data }).eq('tenant_id', TENANT_ID).eq('id', change.id).eq('image_url', change.old_image_url).select('id')
  if (updateError) throw updateError
  if (data.length !== 1) throw new Error(`Optimistic update failed for ${change.slug}`)
  updated += 1
}

const { data: verified, error: verifyError } = await supabase.from('products').select('id,slug,image_url,extra_data').eq('tenant_id', TENANT_ID).eq('is_active', true)
if (verifyError) throw verifyError
const prefix = `${publicBase}/products/${TENANT_ID}/catalog-main-warm-white/`
const invalid = verified.filter((product) => !product.image_url.startsWith(prefix) || product.extra_data?.images?.[0] !== product.image_url || !(product.extra_data?.main_image_width > 0) || !(product.extra_data?.main_image_height > 0))
if (verified.length !== 238 || invalid.length) throw new Error(`Verification failed: rows=${verified.length}, invalid=${invalid.length}`)
const uniqueUrls = new Set(verified.map((product) => product.image_url)).size
if (uniqueUrls !== 229) throw new Error(`Expected 229 unique URLs after update, found ${uniqueUrls}`)
console.log(JSON.stringify({ uploaded, updated, verified: verified.length, uniqueUrls, invalid: invalid.length }))
