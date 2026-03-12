/**
 * 产品多语言展示：按 locale 取 name/description，无则回退到英文
 */
export type ProductWithLocale = {
  name: string
  nameZh?: string | null
  nameFr?: string | null
  description?: string | null
  descriptionZh?: string | null
  descriptionFr?: string | null
}

export function getProductDisplayName(
  product: ProductWithLocale,
  locale: string
): string {
  if (locale === "zh" && product.nameZh?.trim()) return product.nameZh.trim()
  if (locale === "fr" && product.nameFr?.trim()) return product.nameFr.trim()
  return product.name
}

export function getProductDisplayDescription(
  product: ProductWithLocale,
  locale: string
): string | null {
  if (locale === "zh" && product.descriptionZh?.trim())
    return product.descriptionZh.trim()
  if (locale === "fr" && product.descriptionFr?.trim())
    return product.descriptionFr.trim()
  return product.description?.trim() ?? null
}
