/**
 * 将首页 heroSlides 里旧格式（_type: "image"）转为 schema 要求的 heroSlide（含 image + alt）。
 * 直接修补已有文档，不重新上传图片。同时更新 published 与 draft。
 * 运行：node --env-file=.env.local scripts/fix-hero-slides-schema.mjs
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

function randomKey() {
  return Math.random().toString(36).slice(2, 11)
}

/** 将一项转为 heroSlide 结构：{ _type: 'heroSlide', _key, image: { _type, asset, alt }, alt } */
function toHeroSlide(item) {
  if (!item) return null
  if (item._type === 'heroSlide' && item.image) return item
  if (item._type === 'image' && item.asset) {
    return {
      _type: 'heroSlide',
      _key: item._key || randomKey(),
      image: {
        _type: 'image',
        asset: item.asset,
        ...(item.alt && { alt: item.alt }),
      },
      alt: item.alt || '',
    }
  }
  return null
}

/** 为 stats 项补全 _key，避免 Studio 报 Missing keys */
function ensureStatsKeys(stats) {
  if (!Array.isArray(stats) || stats.length === 0) return stats
  const needs = stats.some((i) => i && !i._key)
  if (!needs) return stats
  return stats.map((i) => (i && !i._key ? { ...i, _key: randomKey() } : i))
}

async function main() {
  console.log('正在获取首页文档（含 draft）…\n')
  const docs = await client.fetch(
    `*[_type == "homepage"]{ _id, heroSlides, stats }`
  )
  if (!docs?.length) {
    console.log('未找到 homepage 文档。')
    return
  }
  for (const doc of docs) {
    let heroSlides = doc.heroSlides
    let stats = doc.stats
    const rawSlides = Array.isArray(heroSlides) ? heroSlides : []
    const needsSlideFix = rawSlides.some((i) => i && i._type === 'image')
    if (needsSlideFix) {
      heroSlides = rawSlides.map(toHeroSlide).filter(Boolean)
    }
    stats = ensureStatsKeys(Array.isArray(stats) ? stats : [])
    const needsStatsFix = stats !== doc.stats
    if (needsSlideFix || needsStatsFix) {
      const set = {}
      if (needsSlideFix) set.heroSlides = heroSlides
      if (needsStatsFix) set.stats = stats
      await client.patch(doc._id).set(set).commit()
      console.log('已修复文档', doc._id, needsSlideFix ? `heroSlides(${heroSlides.length})` : '', needsStatsFix ? 'stats(_key)' : '')
    } else {
      console.log('文档', doc._id, '无需修改。')
    }
  }
  console.log('\n完成。请在 Studio 中刷新「首页设置」。')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
