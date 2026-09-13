import { installFixtureApi } from './api-fixture.mjs'

/**
 * Demo take: the events list remembers its filters, per team (#325, ADR-0030 — reversing
 * ADR-0029 §8).
 *
 * The storyline is the reversal's own argument, in order: set a filter → leave the page and come
 * back → reload the whole app → clear it. The two middle beats are the point. Under §8 the filter
 * reset on both, and the reset was the thing members actually hit, because the way you leave the
 * list is usually a mis-tap on a card.
 *
 * Runs the real SPA against the fixture backend (see api-fixture.mjs) — no JDK/Postgres needed, and
 * the take is deterministic either way.
 *
 * Record against a **production build**, and build it same-origin. Two separate reasons:
 *   - `.env.production` bakes in `VITE_API_URL=https://api.teambalance.nl`; the fixture answers by
 *     pathname so it would still intercept, but building with `VITE_API_URL=` keeps the recording
 *     on one origin and off the real API entirely.
 *   - the dev server spends ~0.7s on a blank inter-document canvas during a hard reload while Vite
 *     re-serves unbundled ESM. This demo *is* a reload, so that gap would read as the state loss it
 *     exists to disprove.
 *
 *   cd app && VITE_API_URL= npm run build && npx vite preview --port 4173 &
 *   STEPS=../docs/demo/filter-preferences.steps.mjs BASE_URL=http://localhost:4173 \
 *     VIDEO_DIR=/tmp/tb-filters WIDTH=1024 HEIGHT=900 \
 *     node ../.claude/skills/demo-video/scripts/record-harness.mjs
 *   W=1024 H=900 ../.claude/skills/demo-video/scripts/to-mp4.sh ../teambalance-filters.mp4 /tmp/tb-filters/*.webm
 *
 * The mp4 itself is gitignored on purpose — see the "Demo recordings" note in .gitignore.
 */
export default async function script({ page, caption, section, sleep, click, scrollTo, moveTo, BASE }) {
  // The app's tab bar is fixed to the bottom, exactly where the harness parks its caption pill.
  // Pre-create the pill higher up (caption() only styles it when it has to create it), so the
  // narration never covers the list it is narrating. Re-created after the reload, which wipes it.
  const say = async (text, hold = 0) => {
    await page.evaluate(() => {
      if (document.getElementById('__demo_caption__')) return
      const pill = document.createElement('div')
      pill.id = '__demo_caption__'
      pill.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:120px', 'transform:translateX(-50%)',
        'z-index:2147483647', 'background:rgba(20,20,22,0.92)', 'color:#fff',
        'font:600 18px/1.4 -apple-system,Segoe UI,Roboto,sans-serif',
        'padding:12px 22px', 'border-radius:10px', 'max-width:82vw', 'text-align:center',
        'box-shadow:0 6px 24px rgba(0,0,0,0.35)', 'border-left:5px solid #249E6C',
        'pointer-events:none',
      ].join(';')
      document.body.appendChild(pill)
    })
    await caption(page, text)
    if (hold) await sleep(page, hold)
  }

  // `exact` is load-bearing: Playwright's accessible-name match is a case-insensitive substring, so
  // a bare { name: 'Filters' } also matches the "Clear filters" button the moment a filter is in
  // effect — i.e. everywhere after the third beat — and the take dies on a strict-mode violation.
  const filtersTrigger = page.getByRole('button', { name: 'Filters', exact: true })
  const clearFilters = page.getByRole('button', { name: 'Clear filters' })
  const trainingChip = page.getByRole('button', { name: 'Training', exact: true })
  // The second training, addressed by href so the click can never land on the hero (same title).
  const laterTraining = page.locator('a[href$="/events/evt-4"]')

  await installFixtureApi(page)

  await section('land', async () => {
    await page.goto(BASE) // the one hard navigation — entering the app
    await page.waitForLoadState('networkidle')
    await page.getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 900)
    await say("A volleyball team's events — a match, two trainings and a social", 2600)
  })

  await section('filter', async () => {
    await say('Every filter lives behind one control', 1000)
    await click(page, filtersTrigger)
    await sleep(page, 600)
    await say('Event type, your answer, turnout — and past events', 2600)
    await say('One tap isolates a chip. Trainings only.', 1200)
    await click(page, trainingChip)
    await sleep(page, 900)
    await say('The list behind the popover has already narrowed', 2000)
    await page.keyboard.press('Escape')
    await sleep(page, 800)
    // The hero swapped from the match to the next training: the headline consequence, so it gets
    // the longest hold in the take.
    await say('The match and the social are gone — two trainings left', 3400)
  })

  await section('affordance', async () => {
    await say('A filter you did not set this visit must never be invisible', 2400)
    await moveTo(page, clearFilters)
    await say('So the trigger carries a dot, and Clear filters sits beside it', 3000)
  })

  await section('leave-and-return', async () => {
    await say('Now the case that reversed the old rule', 1600)
    await say('Open an event — a mis-tap on a card is enough', 1100)
    await scrollTo(page, laterTraining)
    await click(page, laterTraining)
    await page.waitForLoadState('networkidle')
    await sleep(page, 700)
    await say('…and come straight back', 1000)
    await click(page, page.getByRole('link', { name: 'Back to events' }))
    await page.waitForLoadState('networkidle')
    await sleep(page, 1000)
    await say('Still filtered. This is exactly where it used to reset.', 3400)
  })

  await section('reload', async () => {
    await say('And it is not just held in memory', 1200)
    await say('Watch a full reload', 1600)
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByText('Tuesday Training').first().waitFor()
    await sleep(page, 1200)
    await say("Restored from this team's own saved preferences", 3400)
  })

  await section('clear', async () => {
    await say('One tap puts it all back', 1200)
    await click(page, clearFilters)
    await sleep(page, 1000)
    await say('Every type, every answer, every turnout band — the unfiltered default', 3400)
  })
}
