import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('every non-Chinese footer locale uses the selected company name', () => {
  for (const locale of ['en', 'fr']) {
    const source = readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8')
    assert.match(source, /Shanghai Tahui Knitting Factory/)
  }
})
