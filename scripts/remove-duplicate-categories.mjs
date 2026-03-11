/**
 * 删除产品分类中按 id 重复的文档，每个 id 只保留一条（保留最先创建的）。
 * 运行：node --env-file=.env.local scripts/remove-duplicate-categories.mjs
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

async function main() {
  const docs = await client.fetch(
    `*[_type == "productCategory"] | order(_createdAt asc) { _id, id, title }`
  )
  if (!docs?.length) {
    console.log('没有产品分类文档。')
    return
  }
  const seen = new Set()
  const toDelete = []
  for (const doc of docs) {
    const key = doc.id || doc._id
    if (seen.has(key)) {
      toDelete.push(doc)
    } else {
      seen.add(key)
    }
  }
  if (toDelete.length === 0) {
    console.log('没有重复的分类，无需删除。')
    return
  }
  for (const doc of toDelete) {
    try {
      await client.delete(doc._id)
      console.log('已删除重复分类:', doc._id, doc.title || doc.id)
    } catch (e) {
      if (e.message?.includes('references')) {
        console.warn('跳过（有引用）:', doc._id, doc.title || doc.id)
      } else throw e
    }
  }
  console.log('\n完成。请刷新 Studio 产品分类列表。')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
