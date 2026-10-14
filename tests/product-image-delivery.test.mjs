import test from 'node:test'
import assert from 'node:assert/strict'

test('product images are served through the responsive Next image pipeline', async () => {
  const { default: config } = await import('../next.config.mjs')

  assert.notEqual(config.images?.unoptimized, true)
  assert.ok(
    config.images?.remotePatterns?.some(
      (pattern) => pattern.protocol === 'https' && pattern.hostname === '**.r2.dev'
    ),
    'Cloudflare R2 product images must be allowed for responsive optimization'
  )
})
