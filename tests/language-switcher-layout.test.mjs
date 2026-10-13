import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

test('desktop language switcher never shrinks or wraps locale labels', async () => {
  const source = await readFile(`${root}/components/language-switcher.tsx`, 'utf8')
  assert.match(source, /shrink-0/)
  assert.match(source, /whitespace-nowrap/)
  assert.match(source, /min-w-10/)
})

test('French desktop navigation preserves room for the language switcher', async () => {
  const source = await readFile(`${root}/components/header.tsx`, 'utf8')
  assert.match(source, /lg:gap-x-4 xl:gap-x-8/)
  assert.match(source, /hidden whitespace-nowrap[^\n]+xl:inline-flex/)
})
