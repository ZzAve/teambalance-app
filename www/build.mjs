// Renders the landing page in Dutch at / and English at /en/ (#464, decision 7):
// one template, one string file per language. Output goes to www/dist/, which the deploy uploads.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const template = readFileSync(join(here, 'template.html'), 'utf8')
const pages = { nl: 'index.html', en: 'en/index.html' }
const strings = Object.fromEntries(
  Object.keys(pages).map((lang) => [lang, JSON.parse(readFileSync(join(here, 'strings', `${lang}.json`), 'utf8'))]),
)

const keys = (o) => Object.keys(o).sort().join(',')
if (keys(strings.nl) !== keys(strings.en)) throw new Error(`www/strings: nl and en differ in keys`)

for (const [lang, file] of Object.entries(pages)) {
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in strings[lang])) throw new Error(`www/strings/${lang}.json has no "${key}"`)
    return strings[lang][key]
  })
  const out = join(here, 'dist', file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  console.log(`wrote ${out}`)
}
