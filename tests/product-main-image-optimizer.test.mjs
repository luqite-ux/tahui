import test from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { optimizeProductMainImage } from '../scripts/lib/product-main-image-optimizer.mjs'

test('optimizer preserves the full frame while producing a web-sized WebP', async () => {
  const source = await sharp({
    create: { width: 4000, height: 6000, channels: 3, background: '#f7f4ee' },
  })
    .composite([
      {
        input: Buffer.from('<svg width="4000" height="6000"><rect x="0" y="0" width="4000" height="6000" fill="none" stroke="#102848" stroke-width="40"/></svg>'),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer()

  const result = await optimizeProductMainImage(source)
  const metadata = await sharp(result.body).metadata()

  assert.equal(metadata.format, 'webp')
  assert.equal(metadata.width, 1067)
  assert.equal(metadata.height, 1600)
  assert.equal(result.width, 1067)
  assert.equal(result.height, 1600)
  assert.ok(result.body.length < source.length)
})
