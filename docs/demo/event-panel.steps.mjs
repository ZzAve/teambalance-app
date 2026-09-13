import { installFixtureApi } from './api-fixture.mjs'

/**
 * Demo take: the event card's panel offers roster pips or the member list (#326, ADR-0030 §5–§8).
 *
 * The storyline follows the decisions in order: open a card's lineup → switch the panel to the
 * team → show that the choice is global, not per card → show that a social finally has something to
 * expand to (#324 cause 3) → turn `Keep open` on and reload. The last beat is the point of the
 * payload change: every card can start expanded because the list already carries every answer, so
 * none of this costs a request per visible card.
 *
 * Runs the real SPA against the fixture backend (see api-fixture.mjs) — no JDK/Postgres needed.
 *
 * Record against a **production build**, built same-origin — see the long note in
 * filter-preferences.steps.mjs for the two separate reasons (the baked-in VITE_API_URL, and the dev
 * server's blank inter-document canvas on reload, which this take would read as state loss).
 *
 *   cd app && VITE_API_URL= npm run build && npx vite preview --port 4173 &
 *   STEPS=../docs/demo/event-panel.steps.mjs BASE_URL=http://localhost:4173 \
 *     VIDEO_DIR=/tmp/tb-panel WIDTH=1024 HEIGHT=900 \
 *     node ../.claude/skills/demo-video/scripts/record-harness.mjs
 *   W=1024 H=900 ../.claude/skills/demo-video/scripts/to-mp4.sh ../teambalance-event-panel.mp4 /tmp/tb-panel/*.webm
 *
 * The mp4 itself is gitignored on purpose — see the "Demo recordings" note in .gitignore.
 */
export default async function script({ page, caption, section, sleep, click, scrollTo, BASE }) {
  // The app's tab bar is fixed to the bottom, exactly where the harness parks its caption pill.
  // Pre-create the pill higher up (caption() only styles it when it has to create it), so the
  // narration never covers the panel it is narrating. Re-created after the reload, which wipes it.
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

  // The list holds three cards: the near training (a tracked lineup — the one the panel is
  // demonstrated on), the social, and a second training whose headcount is full. The match is the
  // hero, which draws no panel of its own.
  //
  // Every control is scoped to its own card rather than addressed by index. Two cards carry the same
  // `Show lineup` name, and — the part that actually bites — opening one flips its name to `Hide
  // lineup`, which silently renumbers the rest: `.nth(1)` resolved before the first beat and timed
  // out after it. `.card-enter` is EventCard's own root class, and the title link identifies which.
  const card = (id) => page.locator('.card-enter').filter({ has: page.locator(`a[href$="/events/${id}"]`) })
  const nearLineup = card('evt-2').getByRole('button', { name: /Show lineup/ })
  const fullLineup = card('evt-4').getByRole('button', { name: /Show lineup/ })
  const socialTrigger = card('evt-3').getByRole('button', { name: /Show who's coming/ })
  const peopleView = card('evt-2').getByRole('button', { name: 'People' })
  const keepOpen = card('evt-2').getByRole('button', { name: 'Keep open' })
  const nearTraining = page.locator('a[href$="/events/evt-2"]')

  await installFixtureApi(page)

  await section('land', async () => {
    await page.goto(BASE) // the one hard navigation — entering the app
    await page.waitForLoadState('networkidle')
    await page.getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 900)
    await say('What you answered — and whether the event is OK', 2800)
  })

  await section('pips', async () => {
    await say('The verdict on the right opens the lineup', 1400)
    await click(page, nearLineup)
    await sleep(page, 900)
    await say('Position by position — one pip per slot the team asked for', 3000)
  })

  await section('switch', async () => {
    await say('Same panel, a second view — and the member picks', 1800)
    await click(page, peopleView)
    await sleep(page, 1000)
    await say('The team itself, grouped the same way', 2600)
    await scrollTo(page, page.getByText('Noor Bakker').first())
    await sleep(page, 600)
    await say('Everyone appears, including whoever has not answered yet', 3000)
    await say('Read-only here: your own answer is the pill on the left', 3000)
  })

  // Scroll *before* narrating in both of these: the caption names a card, so it must not land while
  // the previous card is still the one on screen.
  await section('global', async () => {
    await scrollTo(page, fullLineup)
    await sleep(page, 600)
    await say('The choice is one preference, not a per-card toggle', 2000)
    await click(page, fullLineup)
    await sleep(page, 1000)
    await say('Another card — already on the same view', 3000)
  })

  await section('social', async () => {
    await scrollTo(page, socialTrigger)
    await sleep(page, 600)
    await say('And the social — which had nothing to expand to', 2200)
    await click(page, socialTrigger)
    await sleep(page, 1000)
    await say('Reaching for it used to navigate. Now it opens.', 3400)
  })

  await section('keep-open', async () => {
    await scrollTo(page, nearTraining)
    await sleep(page, 600)
    await say('One more preference: keep every panel open', 1800)
    await click(page, keepOpen)
    await sleep(page, 1200)
    await say('Free, because the list already carries every answer', 3000)
    await say('No extra request per card — that is what paid for this', 2800)
  })

  await section('reload', async () => {
    await say('Both choices are remembered. Watch a full reload.', 2000)
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByText('Tuesday Training').first().waitFor()
    await sleep(page, 1400)
    await say('Open, on the member view, exactly as it was left', 3400)
  })
}
