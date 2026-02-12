/**
 * 为首页文档 (homepage) 的 heroSlides、stats 数组项补全 _key，修复 Studio「Missing keys」报错。
 * 运行：node --env-file=.env.local scripts/add-missing-keys.mjs
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const envPath = path.join(rootDir, '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  })
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !token) {
  console.error('缺少 .env.local 中的 NEXT_PUBLIC_SANITY_PROJECT_ID 或 SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

function ensureKey(item) {
  if (item && typeof item === 'object' && !item._key) {
    return { ...item, _key: Math.random().toString(36).slice(2, 11) }
  }
  return item
}

async function main() {
  const docs = await client.fetch(`*[_type == "homepage"]{ _id, heroSlides, stats }`)
  if (!docs.length) {
    console.log('未找到 homepage 文档，无需处理。')
    return
  }
  for (const doc of docs) {
    const heroSlides = Array.isArray(doc.heroSlides) ? doc.heroSlides.map(ensureKey) : doc.heroSlides
    const stats = Array.isArray(doc.stats) ? doc.stats.map(ensureKey) : doc.stats
    const changed =
      (Array.isArray(doc.heroSlides) && doc.heroSlides.some((i) => !i._key)) ||
      (Array.isArray(doc.stats) && doc.stats.some((i) => !i._key))
    if (!changed) {
      console.log('文档', doc._id, '已有 _key，跳过。')
      continue
    }
    await client.patch(doc._id).set({ heroSlides, stats }).commit()
    console.log('已为文档', doc._id, '补全 heroSlides/stats 的 _key。')
  }
  console.log('完成。请刷新 Studio 首页设置。')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
