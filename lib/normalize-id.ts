export function normalizeId(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[%]/g, "") // avoid passing encoded fragments like %20
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

