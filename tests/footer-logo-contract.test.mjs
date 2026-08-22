import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const source = readFileSync(new URL('../components/footer.tsx', import.meta.url), 'utf8')
test('blocked-name footer keeps its logo contained, responsive, and linked home', () => { assert.match(source, /<Link[\s\S]{0,650}<(?:Image|img)/); assert.match(source, /object-contain/); assert.match(source, /max-w-full/); assert.match(source, /aria-label=["'][^"']*home[^"']*["']/i) })
