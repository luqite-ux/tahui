import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const productViews = [
  'app/[locale]/products/page.tsx',
  'app/[locale]/products/category/[categoryId]/page.tsx',
  'app/[locale]/products/[slug]/page.tsx',
]

test('product catalog and detail images preserve the complete product', async () => {
  for (const relative of productViews) {
    const source = await readFile(`${root}/${relative}`, 'utf8')
    assert.doesNotMatch(source, /className="[^"]*object-cover[^"]*"/, relative)
  }
})

test('product images use the full image stage without inset padding', async () => {
  for (const relative of productViews) {
    const source = await readFile(`${root}/${relative}`, 'utf8')
    const imageClasses = source.match(/className="[^"]*object-contain[^"]*"/g) ?? []

    assert.ok(imageClasses.length > 0, `${relative} should contain product images`)
    for (const className of imageClasses) {
      assert.doesNotMatch(className, /(?:^|\s)(?:sm:)?p-\d+/, `${relative}: ${className}`)
    }
  }
})
