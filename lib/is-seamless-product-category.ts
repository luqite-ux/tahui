/**
 * 判断是否为「无缝」大类：用于 Hero 文案与「一体成型」等仅适用于无缝的卖点。
 * Sanity id 可能不是严格的 seamless，故同时看标题（中/英/法）。
 */
export type SeamlessCategoryMeta = {
  title: string
  titleZh?: string | null
  titleFr?: string | null
}

function normalizeId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function isSeamlessProductCategory(categoryId: string, meta: SeamlessCategoryMeta): boolean {
  const nid = normalizeId(categoryId)
  if (nid === "seamless" || nid.startsWith("seamless")) return true

  const parts = [meta.titleZh, meta.title, meta.titleFr].filter(Boolean) as string[]
  const blob = parts.join(" ")
  if (!blob.trim()) return false

  if (/\bseamless\b/i.test(blob)) return true
  if (/无缝/.test(blob)) return true
  if (/sans\s+couture/i.test(blob) || /maille\s+sans\s+couture/i.test(blob)) return true
  return false
}
