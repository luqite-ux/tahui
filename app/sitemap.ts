import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const LOCALES = ['en', 'zh', 'fr'] as const
const staticRoutes = [
  '',
  '/about',
  '/products',
  '/manufacturing',
  '/factory-tour',
  '/quality',
  '/contact',
  '/privacy',
  '/terms',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []
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
  }
  return entries
}
