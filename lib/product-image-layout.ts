export function resolveProductImageAspectRatio(
  width: number | null | undefined,
  height: number | null | undefined,
): string {
  if (!Number.isFinite(width) || !Number.isFinite(height) || !width || !height || width <= 0 || height <= 0) {
    return "3 / 4"
  }
  return `${width} / ${height}`
}
