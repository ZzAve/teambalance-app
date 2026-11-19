#!/usr/bin/env node
// One-off: renders www/og.png (1200x630) with Playwright from app/node_modules. Run by hand and
// commit the PNG, like app/scripts/capture-pwa-screenshots.mjs:
//   (cd app && npm ci) && node www/make-og.mjs
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const { chromium } = createRequire(join(here, '../app/package.json'))('@playwright/test')
const font = (family, file) =>
  `data:font/woff2;base64,${readFileSync(join(here, '../app/node_modules/@fontsource-variable', family, 'files', file)).toString('base64')}`

const html = `<style>
@font-face { font-family: G; font-weight: 100 900; src: url(${font('grandstander', 'grandstander-latin-wght-normal.woff2')}) }
@font-face { font-family: D; font-weight: 100 1000; src: url(${font('dm-sans', 'dm-sans-latin-opsz-normal.woff2')}) }
* { margin: 0; box-sizing: border-box }
body { width: 1200px; height: 630px; background: #12294a; color: #fff; padding: 72px 88px; display: flex; flex-direction: column; justify-content: space-between }
.wordmark { font: 700 44px G; } .wordmark span { color: #2db87e }
h1 { font: 700 84px/1.08 G; white-space: nowrap }
p { font: 400 36px D; color: #a9beda }
</style>
<div class="wordmark">Team<span>Balance</span></div>
<div><h1>Keep the chat.<br>Skip the scroll-back.</h1></div>
<p>Attendance and the team pot, next to your group chat.</p>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: join(here, 'og.png') })
await browser.close()
console.log('wrote www/og.png')
