// Screenshots the events overview at 390×844 under the demo fixture, once per prototype variant,
// and prints where the hero ends and the next card / bulk bar begins.
//
//   node shoot-hero.mjs <app-dir> <out-dir> [base-url] [variants...]
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const [appDir, outDir, baseUrl = 'http://localhost:4173', ...variantArgs] = process.argv.slice(2)
const variants = variantArgs.length ? variantArgs : ['current', 'A', 'B']
const require = createRequire(resolve(appDir, 'package.json'))
const { chromium } = require('playwright')
const { installFixtureApi } = await import(resolve(appDir, '../docs/demo/api-fixture.mjs'))

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
try {
  for (const variant of variants) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'light',
    })
    const page = await context.newPage()
    await installFixtureApi(page)
    page.on('pageerror', (e) => console.error(`[${variant}] pageerror`, e.message))
    await page.goto(`${baseUrl}/t/heren-3?variant=${variant}`)
    await page.getByText('Next up').waitFor({ timeout: 15_000 })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(400)
    const geometry = await page.evaluate(() => {
      const box = (el) => (el ? Math.round(el.getBoundingClientRect().bottom) : null)
      const top = (el) => (el ? Math.round(el.getBoundingClientRect().top) : null)
      const hero = document.querySelector('section[aria-label="Next up"]')
      const bulk = [...document.querySelectorAll('button')].find((b) => /^Attend \d/.test(b.textContent ?? ''))
      const card = document.querySelector('.card-enter')
      return { heroBottom: box(hero), bulkTop: top(bulk), firstCardTop: top(card), viewport: window.innerHeight }
    })
    console.log(variant, JSON.stringify(geometry))
    await page.screenshot({ path: resolve(outDir, `hero-${variant}.png`) })
    await page.screenshot({ path: resolve(outDir, `hero-${variant}-full.png`), fullPage: true })
    await context.close()
  }
} finally {
  await browser.close()
}
