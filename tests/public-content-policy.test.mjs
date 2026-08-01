import test from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const publicRoots = ['app', 'components', 'lib', 'messages']
const prohibited = /质保|保修|质量保证|\bwarrant(?:y|ies)\b|\bguarantee(?:d|s)?\b/iu

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collect(path))
    else if (['.js', '.jsx', '.json', '.ts', '.tsx'].includes(extname(entry.name))) files.push(path)
  }
  return files
}

test('public runtime content contains no warranty or guarantee commitments', async () => {
  const hits = []
  for (const relative of publicRoots) {
    for (const file of await collect(join(root, relative))) {
      const content = await readFile(file, 'utf8')
      if (prohibited.test(content)) hits.push(file)
    }
  }
  assert.deepEqual(hits, [])
})
