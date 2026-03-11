/**
 * 将网站现有图片和初始数据导入 Sanity 后台（首页 Hero、产品分类、工厂步骤）。
 * 运行前确保 .env.local 中已配置 NEXT_PUBLIC_SANITY_PROJECT_ID、NEXT_PUBLIC_SANITY_DATASET、SANITY_API_WRITE_TOKEN。
 *
 * 运行：node --env-file=.env.local scripts/populate-sanity-initial.mjs
 * 若 Node 不支持 --env-file（< 20），可先执行 set NODE_OPTIONS= 再在 .env.local 同目录下运行，或使用 dotenv。
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

function randomKey() {
  return Math.random().toString(36).slice(2, 11)
}

/** 上传图片并返回 Sanity image 结构（用于 heroSlide.image 等） */
async function uploadImage(filename, alt = '') {
  const filePath = path.join(imagesDir, filename)
  if (!fs.existsSync(filePath)) {
    console.warn('跳过不存在的图片:', filename)
    return null
  }
  const stream = fs.createReadStream(filePath)
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filename),
    ...(alt && { alt }),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, ...(alt && { alt }) }
}

async function main() {
  console.log('开始上传图片并创建初始文档…\n')

  const uploaded = {}

  // 上传 Hero 轮播图（结构须为 heroSlide：含 image + alt，且每项有 _key）
  const heroFiles = [
    { file: 'hero-model.png', alt: 'Model wearing cream open-knit cardigan with gold buttons' },
    { file: 'hero-model-2.png', alt: 'Model wearing ivory ruffle-front V-neck knit sweater' },
    { file: 'hero-model-3.png', alt: 'Model wearing brown and pink ombre textured knit sweater' },
    { file: 'hero-model-4.png', alt: 'Model wearing blue lace-trimmed knit turtleneck' },
  ]
  console.log('上传 Hero 轮播图…')
  const heroSlides = []
  for (const { file, alt } of heroFiles) {
    const img = await uploadImage(file, alt)
    if (img) heroSlides.push({ _type: 'heroSlide', _key: randomKey(), image: img, alt })
  }
  uploaded.heroSlides = heroSlides

  // 上传品类图（用于产品分类）
  const categoryFiles = [
    { file: 'category-seamless.jpg', key: 'seamless' },
    { file: 'category-materials.jpg', key: 'materials' },
    { file: 'category-craftsmanship.jpg', key: 'craftsmanship' },
  ]
  console.log('上传品类图…')
  for (const { file, key } of categoryFiles) {
    const img = await uploadImage(file)
    if (img) uploaded[key] = img
  }

  // 创建首页设置（单例；stats 每项需带 _key 避免 Studio 报 Missing keys）
  if (uploaded.heroSlides?.length) {
    console.log('创建首页设置…')
    await client.createOrReplace({
      _id: 'homepage',
      _type: 'homepage',
      heroSlides: uploaded.heroSlides,
      stats: [
        { _key: randomKey(), value: '30+', label: 'Years Experience' },
        { _key: randomKey(), value: '500+', label: 'Styles per Year' },
        { _key: randomKey(), value: '30+', label: 'Export Countries' },
      ],
    })
  }

  // 创建/更新 3 个产品分类（按 id 查找已有则更新，否则用固定 _id 创建，避免重复）
  const categories = [
    { id: 'seamless', number: '01', title: 'Seamless', desc: 'Seamless knitwear', key: 'seamless' },
    { id: 'multi-material', number: '02', title: 'Multi-Material', desc: 'Multi-material knitwear', key: 'materials' },
    { id: 'craftsmanship', number: '03', title: 'Craftsmanship', desc: 'Craftsmanship knitwear', key: 'craftsmanship' },
  ]
  console.log('创建/更新产品分类…')
  const existing = await client.fetch(
    `*[_type == "productCategory" && id in $ids]{ _id, id }`,
    { ids: categories.map((c) => c.id) }
  )
  const byId = new Map(existing.map((d) => [d.id, d._id]))
  for (const cat of categories) {
    const image = uploaded[cat.key]
    const _id = byId.get(cat.id) || `productCategory-${cat.id}`
    await client.createOrReplace({
      _id,
      _type: 'productCategory',
      id: cat.id,
      number: cat.number,
      title: cat.title,
      description: cat.desc,
      image: image || undefined,
      items: [],
    })
  }

  // 创建工厂步骤文档（上传对应图片并创建 6 条）
  console.log('上传工厂步骤图片并创建文档…')
  const stepDefs = [
    { file: 'manufacturing.jpg', step: 'Step 1', title: 'Manufacturing', description: 'Manufacturing overview.' },
    { file: 'factory-linking.jpg', step: 'Step 2', title: 'Linking', description: 'Linking workshop.' },
    { file: 'factory-finishing.jpg', step: 'Step 3', title: 'Finishing', description: 'Finishing.' },
    { file: 'factory-sorting.jpg', step: 'Step 4', title: 'Sorting', description: 'Sorting.' },
    { file: 'factory-pressing.jpg', step: 'Step 5', title: 'Pressing', description: 'Pressing.' },
    { file: 'factory-packaging.jpg', step: 'Step 6', title: 'Packaging', description: 'Packaging.' },
  ]
  for (const def of stepDefs) {
    const img = await uploadImage(def.file, def.title)
    await client.create({
      _type: 'factoryStep',
      step: def.step,
      title: def.title,
      description: def.description,
      image: img || undefined,
    })
  }

  console.log('\n完成。请在 Studio 中刷新查看「首页」「产品分类」「工厂步骤」。')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
