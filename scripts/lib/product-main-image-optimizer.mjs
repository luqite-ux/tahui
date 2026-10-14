import sharp from 'sharp'

export const PRODUCT_MAIN_MAX_EDGE = 1600
export const PRODUCT_MAIN_WEBP_QUALITY = 88

export async function optimizeProductMainImage(input) {
  const body = await sharp(input, { failOn: 'error' })
    .rotate()
    .resize({
      width: PRODUCT_MAIN_MAX_EDGE,
      height: PRODUCT_MAIN_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: PRODUCT_MAIN_WEBP_QUALITY, smartSubsample: true, effort: 5 })
    .toBuffer()
  const metadata = await sharp(body).metadata()
  if (!metadata.width || !metadata.height) throw new Error('Optimized product image has no dimensions')
  return { body, width: metadata.width, height: metadata.height }
}
