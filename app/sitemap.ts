import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

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
  return staticRoutes.map((path) => ({
    url: path ? `${SITE_URL}${path}` : SITE_URL,
    lastModified,
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
}
