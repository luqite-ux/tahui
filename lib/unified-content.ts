import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseClient, getTenantId } from "@/lib/supabase"

export type ContentImage = {
  asset?: { _ref?: string }
  alt?: string | null
  url?: string | null
}

export type UnifiedCategory = {
  _id: string
  id: string
  number?: string | null
  order?: number | null
  title: string
  titleZh?: string | null
  titleFr?: string | null
  description?: string | null
  image?: ContentImage | null
}

export type UnifiedProduct = {
  _id: string
  name: string
  nameZh?: string | null
  nameFr?: string | null
  slug?: string | null
  description?: string | null
  descriptionZh?: string | null
  descriptionFr?: string | null
  categoryId?: string | null
  categoryTitle?: string | null
  categoryTitleZh?: string | null
  categoryTitleFr?: string | null
  images?: ContentImage[]
  updatedAt?: string | null
}

export type UnifiedArticle = {
  _id: string
  slug: string
  title: string
  titleZh?: string | null
  titleFr?: string | null
  excerpt?: string | null
  excerptZh?: string | null
  excerptFr?: string | null
  publishedAt?: string | null
  coverImage?: ContentImage | null
  body?: unknown[] | null
  bodyZh?: unknown[] | null
  bodyFr?: unknown[] | null
  contentHtml?: string | null
  contentHtmlZh?: string | null
  contentHtmlFr?: string | null
  updatedAt?: string | null
}

type I18n = Record<string, string> | null

function configured(): { client: SupabaseClient; tenantId: string } | null {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  return client && tenantId ? { client, tenantId } : null
}

function localized(value: unknown, locale: string): string | null {
  if (!value || typeof value !== "object") return null
  const text = (value as I18n)?.[locale]
  return typeof text === "string" && text.trim() ? text : null
}

function image(url: unknown, alt?: string | null): ContentImage | null {
  return typeof url === "string" && url.startsWith("https://") ? { url, alt } : null
}

export function contentImageUrl(value: unknown): string | null {
  if (!value || typeof value !== "object") return null
  const url = (value as ContentImage).url
  return typeof url === "string" && url.startsWith("https://") ? url : null
}

export async function getUnifiedCategories(): Promise<UnifiedCategory[] | null> {
  const config = configured()
  if (!config) return null
  const { data, error } = await config.client
    .from("product_categories")
    .select("id,slug,name,name_i18n,description,icon,sort_order")
    .eq("tenant_id", config.tenantId)
    .eq("is_active", true)
    .order("sort_order")
  if (error) return null
  return (data ?? []).map((row, index) => ({
    _id: row.id,
    id: row.slug,
    number: String(index + 1).padStart(2, "0"),
    order: row.sort_order,
    title: localized(row.name_i18n, "en") ?? row.name,
    titleZh: localized(row.name_i18n, "zh"),
    titleFr: localized(row.name_i18n, "fr"),
    description: row.description,
    image: image(row.icon),
  }))
}

export async function getUnifiedProducts(): Promise<UnifiedProduct[] | null> {
  const config = configured()
  if (!config) return null
  const { data, error } = await config.client
    .from("products")
    .select("id,slug,name,name_i18n,description,description_i18n,category_slug,image_url,extra_data,sort_order,updated_at")
    .eq("tenant_id", config.tenantId)
    .eq("is_active", true)
    .order("sort_order")
  if (error) return null
  const categories = await getUnifiedCategories()
  const bySlug = new Map((categories ?? []).map((category) => [category.id, category]))
  return (data ?? []).map((row) => {
    const extra = row.extra_data && typeof row.extra_data === "object" ? row.extra_data as Record<string, unknown> : {}
    const urls = Array.isArray(extra.images) ? extra.images : [row.image_url]
    const alts = Array.isArray(extra.alts) ? extra.alts : []
    const category = row.category_slug ? bySlug.get(row.category_slug) : undefined
    return {
      _id: row.id,
      slug: row.slug,
      name: localized(row.name_i18n, "en") ?? row.name,
      nameZh: localized(row.name_i18n, "zh"),
      nameFr: localized(row.name_i18n, "fr"),
      description: localized(row.description_i18n, "en") ?? row.description,
      descriptionZh: localized(row.description_i18n, "zh"),
      descriptionFr: localized(row.description_i18n, "fr"),
      categoryId: row.category_slug,
      categoryTitle: category?.title,
      categoryTitleZh: category?.titleZh,
      categoryTitleFr: category?.titleFr,
      images: urls.map((url, index) => image(url, typeof alts[index] === "string" ? alts[index] : row.name)).filter(Boolean) as ContentImage[],
      updatedAt: row.updated_at,
    }
  })
}

export async function getUnifiedProduct(slugOrId: string): Promise<UnifiedProduct | null | undefined> {
  const products = await getUnifiedProducts()
  if (products === null) return undefined
  return products.find((product) => product.slug === slugOrId || product._id === slugOrId) ?? null
}

export async function getUnifiedArticles(): Promise<UnifiedArticle[] | null> {
  const config = configured()
  if (!config) return null
  const { data, error } = await config.client
    .from("articles")
    .select("id,slug,title,title_i18n,excerpt,excerpt_i18n,content,content_i18n,featured_image,published_at,updated_at")
    .eq("tenant_id", config.tenantId)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
  if (error) return null
  return (data ?? []).map((row) => ({
    _id: row.id,
    slug: row.slug,
    title: localized(row.title_i18n, "en") ?? row.title,
    titleZh: localized(row.title_i18n, "zh"),
    titleFr: localized(row.title_i18n, "fr"),
    excerpt: localized(row.excerpt_i18n, "en") ?? row.excerpt,
    excerptZh: localized(row.excerpt_i18n, "zh"),
    excerptFr: localized(row.excerpt_i18n, "fr"),
    publishedAt: row.published_at,
    coverImage: image(row.featured_image, row.title),
    contentHtml: localized(row.content_i18n, "en") ?? row.content,
    contentHtmlZh: localized(row.content_i18n, "zh"),
    contentHtmlFr: localized(row.content_i18n, "fr"),
    updatedAt: row.updated_at,
  }))
}

export async function getUnifiedArticle(slug: string): Promise<UnifiedArticle | null | undefined> {
  const articles = await getUnifiedArticles()
  if (articles === null) return undefined
  return articles.find((article) => article.slug === slug) ?? null
}
