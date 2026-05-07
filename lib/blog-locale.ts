import type { PortableTextBlock } from "sanity"

export type BlogPostWithLocale = {
  title: string
  titleZh?: string | null
  titleFr?: string | null
  excerpt?: string | null
  excerptZh?: string | null
  excerptFr?: string | null
  body?: PortableTextBlock[] | null
  bodyZh?: PortableTextBlock[] | null
  bodyFr?: PortableTextBlock[] | null
}

export function getBlogDisplayTitle(post: BlogPostWithLocale, locale: string): string {
  if (locale === "zh" && post.titleZh?.trim()) return post.titleZh.trim()
  if (locale === "fr" && post.titleFr?.trim()) return post.titleFr.trim()
  return post.title
}

export function getBlogDisplayExcerpt(post: BlogPostWithLocale, locale: string): string | null {
  if (locale === "zh" && post.excerptZh?.trim()) return post.excerptZh.trim()
  if (locale === "fr" && post.excerptFr?.trim()) return post.excerptFr.trim()
  return post.excerpt?.trim() ?? null
}

export function getBlogDisplayBody(post: BlogPostWithLocale, locale: string): PortableTextBlock[] | null {
  if (locale === "zh" && post.bodyZh?.length) return post.bodyZh
  if (locale === "fr" && post.bodyFr?.length) return post.bodyFr
  return post.body?.length ? post.body : null
}

