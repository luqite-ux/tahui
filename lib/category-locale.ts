export type CategoryWithLocale = {
  title: string
  titleZh?: string | null
  titleFr?: string | null
}

export function getCategoryDisplayTitle(category: CategoryWithLocale, locale: string): string {
  if (locale === "zh" && category.titleZh?.trim()) return category.titleZh.trim()
  if (locale === "fr" && category.titleFr?.trim()) return category.titleFr.trim()
  return category.title
}

