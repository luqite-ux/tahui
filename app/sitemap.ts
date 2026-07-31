import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { getUnifiedArticles, getUnifiedCategories, getUnifiedProducts } from '@/lib/unified-content'

export const revalidate = 60

const LOCALES = ['en', 'zh', 'fr'] as const
const staticRoutes = [
  '',
  '/about',
  '/products',
  '/blog',
  '/manufacturing',
  '/factory-tour',
  '/quality',
  '/contact',
  '/privacy',
  '/terms',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []
  const [products, categories, articles] = await Promise.all([
    getUnifiedProducts(),
    getUnifiedCategories(),
    getUnifiedArticles(),
  ])
  for (const locale of LOCALES) {
    const prefix = locale === 'en' ? '' : `/${locale}`
    for (const path of staticRoutes) {
      const fullPath = path ? `${prefix}${path}` : prefix || ''
      entries.push({
        url: fullPath ? `${SITE_URL}${fullPath}` : SITE_URL,
        lastModified,
        changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
        priority: path === '' ? 1 : 0.8,
      })
    }
    for (const category of categories ?? []) {
      entries.push({
        url: `${SITE_URL}${prefix}/products/category/${category.id}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
    for (const product of products ?? []) {
      if (!product.slug) continue
      entries.push({
        url: `${SITE_URL}${prefix}/products/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
    for (const article of articles ?? []) {
      entries.push({
        url: `${SITE_URL}${prefix}/blog/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : article.publishedAt ? new Date(article.publishedAt) : lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }
  return entries
}
