// Renders the landing page and privacy page in Dutch at / and English at /en/ (#464, decision 7, #152):
// one template per page, one string file per language. Output goes to www/dist/ (or $OUT_DIR),
// which the deploy uploads in full.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dist = process.env.OUT_DIR ?? join(here, 'dist')

// Files copied as they are: [source relative to repo root, destination relative to dist, required].
// Optional ones are skipped when absent (landing.js and landing-state.mjs arrive with the page body).
const STATIC_FILES = [
  ['www/style.css', 'style.css', true],
  ['www/landing.js', 'landing.js', false],
  ['www/landing-state.mjs', 'landing-state.mjs', false],
  ['design-tokens/tokens.css', 'design-tokens/tokens.css', true],
  ['www/og.png', 'og.png', true],
  ['app/public/favicon.ico', 'favicon.ico', true],
  ['app/public/tb-monogram.svg', 'tb-monogram.svg', true],
  ['app/public/apple-touch-icon-180x180.png', 'apple-touch-icon-180x180.png', true],
]

// Latin subset only; the families are app dependencies, so `npm ci` in app/ provides them.
const FONT_FILES = [
  ['dm-sans', 'dm-sans-latin-opsz-normal.woff2'],
  ['grandstander', 'grandstander-latin-wght-normal.woff2'],
]

const PAGES = [
  { template: 'template.html', lang: 'nl', out: 'index.html' },
  { template: 'template.html', lang: 'en', out: 'en/index.html' },
  { template: 'privacy.html', lang: 'nl', out: 'privacy/index.html' },
  { template: 'privacy.html', lang: 'en', out: 'en/privacy/index.html' },
]

const strings = Object.fromEntries(
  ['nl', 'en'].map((lang) => [lang, JSON.parse(readFileSync(join(here, 'strings', `${lang}.json`), 'utf8'))]),
)

const keys = (o) => Object.keys(o).sort().join(',')
if (keys(strings.nl) !== keys(strings.en)) throw new Error(`www/strings: nl and en differ in keys`)

const copy = (from, to) => {
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
}

for (const { template, lang, out } of PAGES) {
  const html = readFileSync(join(here, template), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in strings[lang])) throw new Error(`www/strings/${lang}.json has no "${key}"`)
    return strings[lang][key]
  })
  const file = join(dist, out)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  console.log(`wrote ${file}`)
}

for (const [from, to, required] of STATIC_FILES) {
  const src = join(root, from)
  if (existsSync(src)) copy(src, join(dist, to))
  else if (required) throw new Error(`${from} is missing`)
}

for (const [family, file] of FONT_FILES) {
  const src = join(root, 'app/node_modules/@fontsource-variable', family, 'files', file)
  if (!existsSync(src)) throw new Error(`${src} is missing: run npm ci in app/`)
  copy(src, join(dist, 'fonts', file))
}
