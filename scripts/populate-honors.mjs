/**
 * 将 public/Honors and Qualifications 下的资质与荣誉图片/PDF 上传到 Sanity 并创建文档。
 * 运行前确保 .env.local 已配置 NEXT_PUBLIC_SANITY_PROJECT_ID、NEXT_PUBLIC_SANITY_DATASET、SANITY_API_WRITE_TOKEN。
 *
 * 运行：node --env-file=.env.local scripts/populate-honors.mjs
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const honorsDir = path.join(rootDir, 'public', 'Honors and Qualifications')

// 加载 .env.local
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

/** 文件名到荣誉信息的映射（中文文件名可能因编码显示异常，此处用已知模式匹配） */
const HONOR_MAPPINGS = [
  // ISO 与体系认证
  { pattern: /质量管理体系|质量体系/i, title: 'Quality Management System', titleZh: '质量管理体系', category: 'iso', order: 10 },
  { pattern: /环境管理体系/i, title: 'Environmental Management System (ISO 14001)', titleZh: '环境管理体系', category: 'iso', order: 20 },
  { pattern: /职业健康安全体系/i, title: 'Occupational Health & Safety (ISO 45001)', titleZh: '职业健康安全体系', category: 'iso', order: 30 },
  // BSCI
  { pattern: /BSCI.*Photo_report|TAHUI-2025BSCI-Photo/i, title: 'BSCI 2025 Photo Report', titleZh: 'BSCI 2025 现场报告', category: 'bsci', order: 40 },
  { pattern: /BSCI\s*2025\.pdf|TAHUI-BSCI/i, title: 'BSCI 2025 Certificate', titleZh: 'BSCI 2025 认证', category: 'bsci', order: 41 },
  // 荣誉资质
  { pattern: /高新技术企业|高新企业认定/i, title: 'High-Tech Enterprise Certification', titleZh: '高新技术企业认定', category: 'honor', order: 50 },
  { pattern: /上海加星|加星/i, title: 'Shanghai Star Enterprise', titleZh: '上海加星企业', category: 'honor', order: 51 },
  // 专利证书
  { pattern: /专利证书合集/i, title: 'Patent Certificates Collection', titleZh: '专利证书合集', category: 'patent', order: 60 },
  { pattern: /专利证书(\d)/i, title: 'Patent Certificate', titleZh: '专利证书', category: 'patent', order: 70 },
  // 绿色低碳（横版）
  { pattern: /5ac830a7/i, title: 'Green Low-Carbon Enterprise Credit Evaluation Model Enterprise', titleZh: '绿色低碳企业信用评价示范企业', category: 'green', order: 75, orientation: 'landscape' },
  { pattern: /9996e34e|e33edd11/i, title: 'AAA Green Low-Carbon Enterprise Credit Rating', titleZh: '绿色低碳信用评价AAA级企业', category: 'green', order: 76, orientation: 'landscape' },
]

function findMapping(filename) {
  for (const m of HONOR_MAPPINGS) {
    if (m.pattern.test(filename)) {
      const numMatch = filename.match(/专利证书(\d)/i)
      const title = numMatch ? `Patent Certificate ${numMatch[1]}` : m.title
      const titleZh = numMatch ? `专利证书 ${numMatch[1]}` : m.titleZh
      return { ...m, title, titleZh, order: numMatch ? m.order + parseInt(numMatch[1], 10) : m.order }
    }
  }
  return null
}

async function uploadFile(filePath, mimeType) {
  const stream = fs.createReadStream(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const assetType = ext === '.pdf' ? 'file' : 'image'
  const asset = await client.assets.upload(assetType, stream, {
    filename: path.basename(filePath),
    contentType: mimeType || (ext === '.pdf' ? 'application/pdf' : undefined),
  })
  return asset
}

async function main() {
  if (!fs.existsSync(honorsDir)) {
    console.error('目录不存在:', honorsDir)
    process.exit(1)
  }

  console.log('开始上传资质与荣誉…\n')
  const entries = fs.readdirSync(honorsDir, { withFileTypes: true })
  const topLevelFiles = entries
    .filter((e) => e.isFile() && /\.(jpg|jpeg|png|pdf)$/i.test(e.name))
    .map((e) => ({ name: e.name, fullPath: path.join(honorsDir, e.name) }))
  const subdirs = entries.filter((e) => e.isDirectory())

  const files = [...topLevelFiles]
  for (const dir of subdirs) {
    const subPath = path.join(honorsDir, dir.name)
    try {
      const subEntries = fs.readdirSync(subPath, { withFileTypes: true })
      for (const e of subEntries) {
        if (e.isFile() && /\.(jpg|jpeg|png|pdf)$/i.test(e.name)) {
          files.push({ name: e.name, fullPath: path.join(subPath, e.name) })
        }
      }
    } catch (err) {
      console.warn('跳过子目录', dir.name, ':', err.message)
    }
  }

  let created = 0
  for (const f of files) {
    const filePath = f.fullPath
    const mapping = findMapping(f.name)
    const title = mapping?.title ?? f.name.replace(/\.[^.]+$/, '')
    const titleZh = mapping?.titleZh ?? title
    const category = mapping?.category ?? 'other'
    const order = mapping?.order ?? 999

    const ext = path.extname(filePath).toLowerCase()
    const isPdf = ext === '.pdf'

    try {
      const asset = await uploadFile(filePath, isPdf ? 'application/pdf' : undefined)
      console.log('已上传:', f.name)

      const doc = {
        _type: 'honor',
        title: titleZh,
        titleEn: title,
        category,
        order,
        ...(mapping?.orientation && { orientation: mapping.orientation }),
      }

      if (isPdf) {
        doc.pdfFile = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
        // PDF 无预览图时，可选上传同目录下的同名图片（如 BSCI 有 pdf 也有 photo_report）
        // 此处简化：仅创建 PDF 文档
      } else {
        doc.image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: title }
      }

      await client.create(doc)
      created++
      console.log('  创建文档:', titleZh)
    } catch (err) {
      console.warn('跳过', f.name, ':', err.message)
    }
  }

  console.log('\n完成。共创建', created, '条资质与荣誉。请在 Studio 中刷新查看，并可在 /quality 页面浏览。')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
