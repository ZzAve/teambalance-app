// Render the portrait intro and outro cards from a narration file's __introCard / __outroCard.
//   node .agents/skills/feature-promo-video/scripts/cards.mjs docs/demo/<feature>.narration.json <out-dir>
// Run from the repo root after `npm --prefix app ci`: fonts, the monogram, lucide icons and Playwright
// all come from app/. Writes <out-dir>/intro.png and <out-dir>/outro.png at 1170x2532.
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const APP = resolve('app')
const [narrationPath, outArg] = process.argv.slice(2)
const out = resolve(outArg)
const { __introCard: intro, __outroCard: outro } = JSON.parse(readFileSync(narrationPath, 'utf8'))
if (!intro || !outro) throw new Error(`${narrationPath} needs __introCard and __outroCard`)

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const fill = (template, fields) =>
  readFileSync(join(SKILL, 'cards', template), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, k) => fields[k] ?? '')

async function lucide(name) {
  const icon = `${APP}/node_modules/lucide-react/dist/esm/icons/${name}.mjs`
  const { __iconNode } = await import(pathToFileURL(icon).href)
  const shapes = __iconNode
    .map(([tag, { key, ...attrs }]) => `<${tag} ${Object.entries(attrs).map(([a, v]) => `${a}="${v}"`).join(' ')}/>`)
    .join('')
  return `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#225C9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${shapes}</svg>`
}

// A step chip is "Label" or { "label": "Label", "icon": "<lucide icon name>" }.
const chips = []
for (const step of outro.steps) {
  const { label, icon } = typeof step === 'string' ? { label: step } : step
  chips.push(`<span class="box">${icon ? `${await lucide(icon)} ` : ''}${escape(label)}</span>`)
}

mkdirSync(out, { recursive: true })
const text = (card) => Object.fromEntries(Object.entries(card).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, escape(v)]))
writeFileSync(join(out, 'intro.html'), fill('intro.html', text(intro)))
writeFileSync(join(out, 'outro.html'), fill('outro.html', { ...text(outro), steps: chips.join('<span class="arrow">↓</span>') }))
copyFileSync(join(SKILL, 'cards', 'portrait.css'), join(out, 'portrait.css'))
copyFileSync(`${APP}/public/tb-monogram.svg`, join(out, 'tb-monogram.svg'))
copyFileSync(`${APP}/node_modules/@fontsource-variable/grandstander/files/grandstander-latin-wght-normal.woff2`, join(out, 'grandstander-latin-wght-normal.woff2'))
copyFileSync(`${APP}/node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-opsz-normal.woff2`, join(out, 'dm-sans-latin-opsz-normal.woff2'))
writeFileSync(join(out, 'cards.json'), JSON.stringify({
  width: 1170, height: 2532, dir: out,
  cards: [{ html: 'intro.html', out: 'intro.png' }, { html: 'outro.html', out: 'outro.png' }],
}))

// demo-video's renderer resolves Playwright from its working directory.
execFileSync('node', [resolve('.agents/skills/demo-video/scripts/render-cards.mjs'), join(out, 'cards.json')], { cwd: APP, stdio: 'inherit' })
