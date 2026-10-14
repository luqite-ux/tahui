import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

test('product gallery thumbnails switch the selected main image and the main image opens a dialog', async () => {
  const source = await readFile(`${root}/components/product-gallery.tsx`, 'utf8')

  assert.match(source, /useState\(0\)/)
  assert.match(source, /onClick=\{\(\) => setSelectedIndex\(index\)\}/)
  assert.match(source, /aria-pressed=\{selectedIndex === index\}/)
  assert.match(source, /<DialogTrigger asChild>/)
  assert.match(source, /className="object-contain"/)
})
