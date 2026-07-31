import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const project = 'hod5dd0a', dataset = 'production'
const query = `{
  "categories": *[_type == "productCategory"] | order(order asc){_id,id,number,order,title,titleZh,titleFr,description,"imageUrl":image.asset->url,items[]{name,description,"imageUrl":image.asset->url}},
  "products": *[_type == "product" && defined(slug.current)] | order(order asc){_id,name,nameZh,nameFr,"slug":slug.current,"categoryId":category->id,description,descriptionZh,descriptionFr,order,"images":images[]{alt,"url":asset->url}},
  "articles": *[_type == "blogPost" && defined(slug.current)]{_id,title,titleZh,titleFr,"slug":slug.current,excerpt,excerptZh,excerptFr,publishedAt,"coverImageUrl":coverImage.asset->url,body,bodyZh,bodyFr},
  "inquiries": *[_type == "inquiry"]{_id,_createdAt,name,email,company,phone,inquiryType,productType,quantity,message,status,receivedAt}
}`
const url = `https://${project}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`
const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
if (!response.ok) throw new Error(`Sanity HTTP ${response.status}`)
const payload = await response.json(), result = payload.result
const errors = [], warnings = []
const categoryIds = new Set(result.categories.map((x) => x.id))
for (const product of result.products) { if (!product.slug) errors.push(`missing product slug ${product._id}`); if (!categoryIds.has(product.categoryId)) warnings.push(`missing category ${product.slug}`) }
for (const article of result.articles) if (!article.slug) errors.push(`missing article slug ${article._id}`)
const assets = [...new Set([
  ...result.categories.flatMap((x) => [x.imageUrl, ...(x.items || []).map((i) => i.imageUrl)]),
  ...result.products.flatMap((x) => (x.images || []).map((i) => i.url)),
  ...result.articles.map((x) => x.coverImageUrl),
].filter(Boolean))]
const inventory = { exportedAt: new Date().toISOString(), source: { project, dataset }, counts: { categories: result.categories.length, products: result.products.length, articles: result.articles.length, inquiries: result.inquiries.length, assets: assets.length }, validationErrors: errors, validationWarnings: warnings, assets, ...result }
mkdirSync(path.resolve('migration'), { recursive: true })
writeFileSync(path.resolve('migration/tahui-source-inventory.json'), JSON.stringify(inventory, null, 2), 'utf8')
console.log(JSON.stringify(inventory.counts))
if (warnings.length) console.warn(warnings)
if (errors.length) { console.error(errors); process.exit(1) }
