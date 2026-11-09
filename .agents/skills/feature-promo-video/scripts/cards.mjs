// Render the portrait intro and outro cards from a narration file's __introCard / __outroCard.
//   node .agents/skills/feature-promo-video/scripts/cards.mjs docs/demo/<feature>.narration.json <out-dir>
// Needs `npm --prefix app ci`: fonts, the monogram, lucide icons and Playwright all come from app/.
// Writes <out-dir>/intro.png and <out-dir>/outro.png at 1170x2532, plus phone.png and phone-android.png (a
// phone around the take, transparent where the recording shows through) and phone.json (where the take goes) for assemble.py.
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = resolve(SKILL, '../../..')
const APP = join(REPO, 'app')
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

// The phone: the 390x844 take scaled into a screen between a status bar and a home strip, in a bezel.
const W = 1170, H = 2532, sw = 960, status = 120, home = 84, bezel = 34, r = 130
const h = Math.round((H * sw) / W / 2) * 2
const sh = status + h + home
const sx = (W - sw) / 2, sy = Math.round((H - sh) / 2)
const phone = {
  width: W, height: H, sx, sy, sw, sh, r, cx: W / 2, status, home, homeY: sy + status + h,
  bx: sx - bezel, by: sy - bezel, bw: sw + 2 * bezel, bh: sh + 2 * bezel, br: r + bezel,
  btnL: sx - bezel - 9, btnR: sx + sw + bezel - 1,
  homeBarX: W / 2 - 170, homeBarY: sy + status + h + home / 2 - 6, islandX: W / 2 - 150, islandY: sy + 26,
  timeX: sx + 170, textY: sy + 86, iconsX: sx + sw - 232, iconsY: sy + 52,
  // Android: smaller corner radii, a punch-hole camera, the time at the left.
  ra: 100, bra: 100 + bezel, camY: sy + 60, timeXa: sx + 60,
}

mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'phone.html'), fill('phone.html', phone))
writeFileSync(join(out, 'phone-android.html'), fill('phone-android.html', phone))
writeFileSync(join(out, 'phone.json'), JSON.stringify({ x: sx, y: sy + status, w: sw, h }))
const text = (card) => Object.fromEntries(Object.entries(card).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, escape(v)]))
writeFileSync(join(out, 'intro.html'), fill('intro.html', text(intro)))
writeFileSync(join(out, 'outro.html'), fill('outro.html', { ...text(outro), steps: chips.join('<span class="arrow">↓</span>') }))
copyFileSync(join(SKILL, 'cards', 'portrait.css'), join(out, 'portrait.css'))
copyFileSync(`${APP}/public/tb-monogram.svg`, join(out, 'tb-monogram.svg'))
copyFileSync(`${APP}/node_modules/@fontsource-variable/grandstander/files/grandstander-latin-wght-normal.woff2`, join(out, 'grandstander-latin-wght-normal.woff2'))
copyFileSync(`${APP}/node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-opsz-normal.woff2`, join(out, 'dm-sans-latin-opsz-normal.woff2'))
// The cards' text for assemble.py's review transcript.
writeFileSync(join(out, 'cards-text.json'), JSON.stringify({
  intro: [`${intro.headline} ${intro.accent}`, intro.sub, intro.pill].filter(Boolean),
  outro: ['Try it today.', outro.steps.map((s) => (typeof s === 'string' ? s : s.label)).join(' → '), outro.sub, 'teambalance.nl'].filter(Boolean),
}, null, 1))
writeFileSync(join(out, 'cards.json'), JSON.stringify({
  width: 1170, height: 2532, dir: out,
  cards: [{ html: 'intro.html', out: 'intro.png' }, { html: 'outro.html', out: 'outro.png' }, { html: 'phone.html', out: 'phone.png', transparent: true },
    { html: 'phone-android.html', out: 'phone-android.png', transparent: true }],
}))

// demo-video's renderer resolves Playwright from its working directory.
execFileSync('node', [join(REPO, '.agents/skills/demo-video/scripts/render-cards.mjs'), join(out, 'cards.json')], { cwd: APP, stdio: 'inherit' })
