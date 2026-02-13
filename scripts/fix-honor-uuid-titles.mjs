/**
 * 修复 Sanity 中标题为 UUID 的资质文档，根据图片 alt 或规则设置正确标题和分类。
 * 运行：node --env-file=.env.local scripts/fix-honor-uuid-titles.mjs
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const envPath = path.join(rootDir, '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
    })
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !token) {
  console.error('缺少 NEXT_PUBLIC_SANITY_PROJECT_ID 或 SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function isUuid(s) {
  return s && UUID_REGEX.test(String(s).trim())
}

const PATCHES = [
  { pattern: /绿色低碳.*示范|demonstration|5ac830a7/i, title: '绿色低碳企业信用评价示范企业', titleEn: 'Green Low-Carbon Enterprise Credit Evaluation Model Enterprise', category: 'green', orientation: 'landscape' },
  { pattern: /绿色.*AAA|低碳.*AAA|credit.*aaa|9996e34e|e33edd11/i, title: '绿色低碳信用评价AAA级企业', titleEn: 'AAA Green Low-Carbon Enterprise Credit Rating', category: 'green', orientation: 'landscape' },
  { pattern: /上海名牌|shanghai.*famous/i, title: '上海名牌', titleEn: 'Shanghai Famous Brand', category: 'honor' },
  { pattern: /著名商标|well-known.*trademark/i, title: '新著名商标', titleEn: 'Well-Known Trademark', category: 'honor' },
  { pattern: /海关|customs/i, title: '海关信用认定书', titleEn: 'Customs Credit Certification', category: 'honor' },
]

async function main() {
  const honors = await client.fetch(
    `*[_type == "honor"]{
      _id,
      title,
      titleEn,
      category,
      "imageAlt": image.alt,
      "fileName": image.asset->originalFilename
    }`
  )
  let patched = 0
  for (const h of honors) {
    if (!isUuid(h.title) && !isUuid(h.titleEn)) continue
    const search = `${h.title} ${h.titleEn} ${h.imageAlt} ${h.fileName}`.toLowerCase()
    const match = PATCHES.find((p) => p.pattern.test(search))
    if (match) {
      const patch = { title: match.title, titleEn: match.titleEn, category: match.category }
      if (match.orientation) patch.orientation = match.orientation
      await client.patch(h._id).set(patch).commit()
      console.log('Patched', h._id, '->', match.title)
      patched++
    } else {
      console.log('Skip (no match):', h._id, 'alt:', h.imageAlt?.slice(0, 50))
    }
  }
  console.log('Done. Patched', patched, 'documents.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
