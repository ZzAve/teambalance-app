import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const out = mkdtempSync(join(tmpdir(), 'www-dist-'))
const build = spawnSync('node', [join(here, 'build.mjs')], { env: { ...process.env, OUT_DIR: out }, encoding: 'utf8' })
const read = (f) => readFileSync(join(out, f), 'utf8')

test('build succeeds', () => assert.equal(build.status, 0, build.stderr))

test('landing and privacy render in both languages with no placeholder left', () => {
  for (const f of ['index.html', 'en/index.html', 'privacy/index.html', 'en/privacy/index.html']) {
    assert.ok(!read(f).includes('{{'), `${f} still has a {{placeholder}}`)
  }
  assert.match(read('index.html'), /<html lang="nl">/)
  assert.match(read('en/privacy/index.html'), /<html lang="en">/)
})

test('dist is self-contained: static files, fonts and icons are copied', () => {
  for (const f of ['style.css', 'design-tokens/tokens.css', 'og.png', 'favicon.ico', 'tb-monogram.svg', 'apple-touch-icon-180x180.png']) {
    assert.ok(existsSync(join(out, f)), `missing ${f}`)
  }
  assert.deepEqual(readdirSync(join(out, 'fonts')).sort(), [
    'dm-sans-latin-opsz-normal.woff2',
    'grandstander-latin-wght-normal.woff2',
  ])
})

test('no third-party font host in the output', () => {
  for (const f of ['index.html', 'en/index.html', 'privacy/index.html', 'style.css']) {
    assert.doesNotMatch(read(f), /fonts\.(googleapis|gstatic)\.com/, f)
  }
})

test('head metadata is present on the landing pages', () => {
  for (const f of ['index.html', 'en/index.html']) {
    const html = read(f)
    for (const m of ['name="description"', 'property="og:image"', 'name="twitter:card"', 'rel="canonical"', 'rel="icon"', 'rel="apple-touch-icon"', 'rel="preload"']) {
      assert.ok(html.includes(m), `${f} lacks ${m}`)
    }
  }
})
