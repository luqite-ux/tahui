export function resolveMasonrySpan(height: number, rowHeight: number, gap: number): number {
  if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(rowHeight) || rowHeight <= 0) return 1
  const safeGap = Number.isFinite(gap) && gap > 0 ? gap : 0
  return Math.max(1, Math.ceil((height + safeGap) / rowHeight))
}
