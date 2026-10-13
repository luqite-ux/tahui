import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

async function loadSubject() {
  const source = await readFile(`${root}/lib/product-image-layout.ts`, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const testModule = { exports: {} }
  vm.runInNewContext(`(function (exports, module) { ${output} })(testModule.exports, testModule)`, { testModule })
  return testModule.exports
}

test('uses real product image dimensions for the masonry stage', async () => {
  const { resolveProductImageAspectRatio } = await loadSubject()
  assert.equal(resolveProductImageAspectRatio(1200, 1800), '1200 / 1800')
  assert.equal(resolveProductImageAspectRatio(1600, 1200), '1600 / 1200')
})

test('falls back to a portrait stage when dimensions are missing or invalid', async () => {
  const { resolveProductImageAspectRatio } = await loadSubject()
  assert.equal(resolveProductImageAspectRatio(null, undefined), '3 / 4')
  assert.equal(resolveProductImageAspectRatio(0, 1200), '3 / 4')
  assert.equal(resolveProductImageAspectRatio(1200, -1), '3 / 4')
})

test('uses balanced product grids for sparse category sections', async () => {
  const { resolveProductGridClassName } = await loadSubject()
  assert.match(resolveProductGridClassName(3), /items-start/)
  assert.match(resolveProductGridClassName(1), /max-w-sm/)
  assert.match(resolveProductGridClassName(2), /lg:grid-cols-2/)
  assert.match(resolveProductGridClassName(4), /lg:grid-cols-2/)
  assert.match(resolveProductGridClassName(5), /lg:grid-cols-3/)
  assert.doesNotMatch(resolveProductGridClassName(4), /columns-/)
})

test('product cards do not stretch to the tallest card in their row', async () => {
  const productsPage = await readFile(`${root}/app/[locale]/products/page.tsx`, 'utf8')
  const categoryPage = await readFile(`${root}/app/[locale]/products/category/[categoryId]/page.tsx`, 'utf8')
  for (const source of [productsPage, categoryPage]) {
    assert.doesNotMatch(source, /href=\{detailHref\} className="block h-full"/)
    assert.doesNotMatch(source, /group\/card[^"\n]*\bh-full\b/)
  }
})
