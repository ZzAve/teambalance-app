import { installFixtureApi } from './api-fixture.mjs'

/**
 * Demo take: the events page uses the width from `lg` up — a left rail, not wider cards
 * (#352, ADR-0033).
 *
 * The storyline is the decision's own argument, and it only works in one direction: start at phone
 * width, then **widen the window**. Narrowing would leave a growing grey margin that reads as the
 * page being cut off; widening shrinks it away and ends full-bleed, so the rail arrives as a reveal
 * rather than as damage. The beat that matters is the 1024px crossing — held long enough to see
 * that the controls moved and the card did not resize.
 *
 * The viewport is resized live inside one take. The harness fixes the video canvas at WIDTH×HEIGHT
 * and Playwright left-anchors a smaller viewport inside it, which is exactly what dragging a
 * window's right edge looks like — so one segment covers both widths, with no concat.
 *
 * Runs the real SPA against the fixture backend (see api-fixture.mjs) — no JDK/Postgres needed.
 * The fixture is a good fit here without being touched: the unanswered match is the hero and the
 * two unanswered events give the bulk-attend bar two buttons, so the rail has all three of its
 * tenants (header, hero, bar) on screen at once.
 *
 * Record against a **production build**, built same-origin — both reasons are in docs/demo/README.md
 * (`.env.production` would point the take at the real API; the dev server's hard-reload blank
 * canvas reads as a bug). This take never reloads, but the first reason still applies.
 *
 *   cd app && VITE_API_URL= npm run build && npx vite preview --port 4173 &
 *   STEPS=../docs/demo/events-rail.steps.mjs BASE_URL=http://localhost:4173 \
 *     VIDEO_DIR=/tmp/tb-rail WIDTH=1440 HEIGHT=900 \
 *     node ../.claude/skills/demo-video/scripts/record-harness.mjs
 *   W=1440 H=900 ../.claude/skills/demo-video/scripts/to-mp4.sh ../teambalance-events-rail.mp4 /tmp/tb-rail/*.webm
 *
 * The mp4 itself is gitignored on purpose — see the "Demo recordings" note in .gitignore.
 */
const PHONE = 430
const LG = 1024
const LAPTOP = 1440

export default async function script({ page, caption, section, sleep, click, scrollTo, pan, BASE }) {
  // The app's tab bar is fixed to the bottom, exactly where the harness parks its caption pill.
  // Pre-create the pill higher up (caption() only styles it when it has to create it) so the
  // narration never covers the list it is narrating.
  const say = async (text, hold = 0) => {
    await page.evaluate(() => {
      if (document.getElementById('__demo_caption__')) return
      const pill = document.createElement('div')
      pill.id = '__demo_caption__'
      pill.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:120px', 'transform:translateX(-50%)',
        'z-index:2147483647', 'background:rgba(20,20,22,0.92)', 'color:#fff',
        'font:600 17px/1.4 -apple-system,Segoe UI,Roboto,sans-serif',
        'padding:11px 20px', 'border-radius:10px', 'max-width:86vw', 'text-align:center',
        'box-shadow:0 6px 24px rgba(0,0,0,0.35)', 'border-left:5px solid #249E6C',
        'pointer-events:none',
      ].join(';')
      document.body.appendChild(pill)
    })
    await caption(page, text)
    if (hold) await sleep(page, hold)
  }

  // Drag the window's right edge, rather than jump: one setViewportSize per frame reads as a
  // resize, a single jump reads as a cut. The step is deliberately coarse near the ends and the
  // caller stops either side of `lg`, so the breakpoint itself gets a beat of its own.
  const dragTo = async (target, { step = 34, gap = 16 } = {}) => {
    let w = page.viewportSize().width
    const dir = Math.sign(target - w)
    while (dir > 0 ? w < target : w > target) {
      w = dir > 0 ? Math.min(target, w + step) : Math.max(target, w - step)
      await page.setViewportSize({ width: w, height: 900 })
      await sleep(page, gap)
    }
  }

  // `exact` is load-bearing: Playwright's accessible-name match is a case-insensitive substring, so
  // a bare { name: 'Filters' } would also match "Clear filters" the moment a filter is in effect.
  const filtersTrigger = page.getByRole('button', { name: 'Filters', exact: true })
  const hero = page.getByRole('region', { name: 'Next up' })

  await installFixtureApi(page)

  await section('phone', async () => {
    await page.setViewportSize({ width: PHONE, height: 900 })
    await page.goto(BASE) // the one hard navigation — entering the app
    await page.waitForLoadState('networkidle')
    await page.getByText('League Match vs Smash United').first().waitFor()
    await page.mouse.move(PHONE / 2, 500)
    await sleep(page, 900)
    await say('The events page on a phone', 2400)
    await say('Next up, then the bulk-attend bar, then the cards', 2800)
  })

  await section('widen-to-lg', async () => {
    await say('Now open it on a laptop…', 1800)
    // Stop just short of the breakpoint, so the snap is its own frame and not lost mid-drag.
    await dragTo(LG - 40)
    await sleep(page, 900)
    await say('Everything is still one centred column', 2600)
  })

  await section('the-snap', async () => {
    // The beat the whole change is about. Cross `lg`, then hold with the result on screen.
    await dragTo(LG + 40, { step: 16, gap: 26 })
    await sleep(page, 400)
    await say('At 1024px it splits in two', 3200)
    await dragTo(LAPTOP)
    await sleep(page, 1200)
    await say('The header, Next up and the bulk bar move into a rail', 3400)
    await say('The cards keep the width they already had — 640px', 3400)
  })

  await section('filters', async () => {
    await say('Filters and view options open from the rail', 1800)
    await click(page, filtersTrigger)
    await sleep(page, 3000)
    await page.keyboard.press('Escape')
    await sleep(page, 900)
  })

  await section('open-lineups', async () => {
    // Three cards in one 900px-tall window do not overflow, so a scroll beat here would be four
    // seconds of nothing. `Keep panels open` (ADR-0030 §6) expands every card's lineup and takes
    // the page to ~1750px — a real feature doing real work, rather than a fixture grown for the
    // camera. Without it the sticky rail below has nothing to be sticky against.
    await say('Open every lineup, so there is something to scroll', 1600)
    await click(page, page.getByRole('button', { name: 'View options' }))
    await sleep(page, 700)
    await click(page, page.getByRole('switch', { name: 'Keep panels open' }))
    await page.keyboard.press('Escape')
    await sleep(page, 1400)
  })

  await section('sticky', async () => {
    await say('Now scroll: the rail stays, only the list moves', 1800)
    await pan(page, 700, { ticks: 20, gap: 44 })
    await sleep(page, 2800)
    await pan(page, -700, { ticks: 18, gap: 40 })
    await sleep(page, 1400)
  })

  await section('close', async () => {
    await scrollTo(page, hero, { block: 'center' })
    // Park the pointer in the rail's empty space before the last hold. Left where the previous
    // click put it, it sits on the hero — whose stretched link then holds a hover underline
    // through the one frame people actually freeze on.
    await page.mouse.move(380, 660)
    await sleep(page, 600)
    await say('Same page, same cards — the width pays for the rail', 3600)
  })
}
