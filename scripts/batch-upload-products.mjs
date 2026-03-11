/**
 * 批量上传产品到 Sanity。
 * 从 JSON 文件读取产品列表，上传图片（可选），创建 product 文档。
 *
 * 运行前确保 .env.local 中已配置：
 *   NEXT_PUBLIC_SANITY_PROJECT_ID、NEXT_PUBLIC_SANITY_DATASET、SANITY_API_WRITE_TOKEN
 *
 * 用法：
 *   node --env-file=.env.local scripts/batch-upload-products.mjs [JSON文件路径]
 * 默认读取 scripts/products-to-import.json
 *
 * JSON 格式见 scripts/products-to-import.json 示例。
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const imagesDir = path.join(rootDir, 'public', 'images')

// 加载 .env.local
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

/** 从 name 生成 URL 友好的 slug */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'product'
}

/** 上传图片文件，返回 Sanity image 结构 */
async function uploadImage(filePathOrFilename, alt = '') {
  let filePath = path.isAbsolute(filePathOrFilename) ? filePathOrFilename : path.join(imagesDir, filePathOrFilename)
  if (!path.isAbsolute(filePathOrFilename) && !fs.existsSync(filePath)) {
    filePath = path.join(rootDir, filePathOrFilename)
  }
  if (!fs.existsSync(filePath)) {
    console.warn('跳过不存在的图片:', filePathOrFilename)
    return null
  }
  const stream = fs.createReadStream(filePath)
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filePath),
    ...(alt && { alt }),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, ...(alt && { alt }) }
}

async function main() {
  const jsonPath = process.argv[2] || path.join(__dirname, 'products-to-import.json')
  if (!fs.existsSync(jsonPath)) {
    console.error('文件不存在:', jsonPath)
    console.error('用法: node --env-file=.env.local scripts/batch-upload-products.mjs [JSON文件路径]')
    process.exit(1)
  }

  const raw = fs.readFileSync(jsonPath, 'utf8')
  let list
  try {
    list = JSON.parse(raw)
  } catch (e) {
    console.error('JSON 解析失败:', e.message)
    process.exit(1)
  }
  if (!Array.isArray(list)) {
    console.error('JSON 根节点必须是数组，每项为一条产品')
    process.exit(1)
  }

  // 解析所有用到的 category id，查 Sanity 得到 _id
  const categoryIds = [...new Set(list.map((p) => p.category).filter(Boolean))]
  const categoryDocs = await client.fetch(
    `*[_type == "productCategory" && id in $ids]{ _id, id }`,
    { ids: categoryIds }
  )
  const categoryRefMap = new Map(categoryDocs.map((d) => [d.id, d._id]))

  console.log('开始批量创建产品，共', list.length, '条\n')

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const name = item.name || item.title
    if (!name) {
      console.warn(`[${i + 1}] 跳过：缺少 name/title`)
      continue
    }

    const slugCurrent = item.slug || slugify(name)
    const categoryId = item.category
    const categoryRef = categoryId ? categoryRefMap.get(categoryId) : null
    if (categoryId && !categoryRef) {
      console.warn(`[${i + 1}] "${name}" 的分类 "${categoryId}" 在 Sanity 中未找到，将不关联分类`)
    }

    let images = []
    const imageFiles = item.images || (item.image ? [item.image] : [])
    for (const img of imageFiles) {
      const filename = typeof img === 'string' ? img : img.file || img.path
      const alt = typeof img === 'string' ? '' : (img.alt || '')
      const uploaded = await uploadImage(filename, alt)
      if (uploaded) images.push(uploaded)
    }

    const doc = {
      _type: 'product',
      name,
      slug: { _type: 'slug', current: slugCurrent },
      ...(categoryRef && { category: { _type: 'reference', _ref: categoryRef } }),
      ...(item.description != null && { description: String(item.description) }),
      ...(images.length > 0 && { images }),
      ...(item.order != null && { order: Number(item.order) }),
    }

    await client.create(doc)
    console.log(`[${i + 1}/${list.length}] 已创建: ${name}`)
  }

  console.log('\n批量上传完成。请在 Sanity Studio 中刷新查看「产品」。')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
