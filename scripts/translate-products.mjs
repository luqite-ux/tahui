/**
 * 批量将产品名称与描述自动翻译为中文、法文并写回 Sanity。
 *
 * Vercel 部署时（推荐）：只请求你的站点，不直连 Sanity，避免本机网络超时。
 *   1. 在 Vercel 配置好 MYMEMORY_EMAIL、SANITY_API_WRITE_TOKEN、TRANSLATE_API_SECRET 等
 *   2. 本地执行：SITE_URL=https://你的域名 npm run translate-products
 *
 * 本地开发：npm run dev 后执行 npm run translate-products（需本机能连 Sanity）
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// 加载 .env.local
const envPath = path.join(rootDir, '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  })
}

const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
const secret = process.env.TRANSLATE_API_SECRET
const useSiteApi = Boolean(siteUrl && siteUrl !== 'http://localhost:3000')

async function fetchJsonWithRetry(url, init, { retries = 5, timeoutMs = 120000 } = {}) {
  let lastErr
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
      const text = await res.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { _raw: text }
      }
      return { ok: res.ok, status: res.status, data }
    } catch (e) {
      lastErr = e
      const waitMs = Math.min(15000, 1000 * Math.pow(2, attempt - 1))
      console.warn(`请求失败（第 ${attempt}/${retries} 次），${waitMs}ms 后重试：`, url)
      await new Promise((r) => setTimeout(r, waitMs))
    }
  }
  throw lastErr
}

async function main() {
  let ids = []
  const headers = { 'Content-Type': 'application/json' }
  if (secret) headers['Authorization'] = `Bearer ${secret}`
  const base = siteUrl.replace(/\/$/, '')

  if (useSiteApi) {
    console.log('从站点拉取产品 ID：', base + '/api/product-ids')
    const { ok, status, data } = await fetchJsonWithRetry(base + '/api/product-ids', { headers }, { timeoutMs: 60000 })
    if (!ok) {
      console.error('拉取产品 ID 失败:', status, data)
      process.exit(1)
    }
    ids = data.ids || []
  } else {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    if (!projectId) {
      console.error('本地模式需配置 NEXT_PUBLIC_SANITY_PROJECT_ID，或使用 SITE_URL=线上域名 走站点 API')
      process.exit(1)
    }
    const query = encodeURIComponent('*[_type == "product"]._id')
    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`
    const res = await fetch(url)
    if (!res.ok) {
      console.error('拉取产品 ID 失败:', res.status, await res.text())
      process.exit(1)
    }
    const { result } = await res.json()
    ids = result.map((o) => o._id).filter(Boolean)
  }

  if (ids.length === 0) {
    console.log('当前没有产品文档，无需翻译。')
    return
  }

  // 批量分段，避免一次请求超时（尤其是 MyMemory / DeepL 翻译较慢时）
  const chunkSize = Number(process.env.TRANSLATE_BATCH_SIZE || 10)
  const chunks = []
  for (let i = 0; i < ids.length; i += chunkSize) chunks.push(ids.slice(i, i + chunkSize))

  let ok = 0
  const fail = []
  console.log(`将分 ${chunks.length} 批请求翻译（每批 ${chunkSize}）：${base}/api/translate-product`)

  for (let i = 0; i < chunks.length; i++) {
    const batch = chunks[i]
    console.log(`批次 ${i + 1}/${chunks.length}：${batch.length} 个产品`)
    let out
    try {
      out = await fetchJsonWithRetry(
        base + '/api/translate-product',
        { method: 'POST', headers, body: JSON.stringify({ ids: batch }) },
        { retries: 4, timeoutMs: 180000 }
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error('API 请求失败:', msg)
      batch.forEach((id) => fail.push({ id, error: msg }))
      continue
    }
    const data = out.data || {}
    if (!out.ok) {
      console.error('API 错误:', out.status, data)
      batch.forEach((id) => fail.push({ id, error: `API ${out.status}` }))
      continue
    }
    const results = data.results || []
    ok += results.filter((r) => r.ok).length
    results.filter((r) => !r.ok).forEach((r) => fail.push(r))
  }

  console.log(`完成：成功 ${ok}，失败 ${fail.length}`)
  if (fail.length) fail.slice(0, 50).forEach((r) => console.log('  -', r.id, r.error))
}

main()
