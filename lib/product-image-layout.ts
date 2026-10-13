export function resolveProductImageAspectRatio(
  width: number | null | undefined,
  height: number | null | undefined,
): string {
  if (!Number.isFinite(width) || !Number.isFinite(height) || !width || !height || width <= 0 || height <= 0) {
    return "3 / 4"
  }
  return `${width} / ${height}`
}

export function resolveProductGridClassName(productCount: number): string {
  const base = "grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6"
  if (productCount <= 1) return `${base} mx-auto max-w-sm`
  if (productCount === 2 || productCount === 4) return `${base} mx-auto max-w-4xl lg:grid-cols-2`
  return `${base} lg:grid-cols-3`
}
