import { installFixtureApi } from './api-fixture.mjs'

/**
 * Demo take: a quick look around TeamBalance, then light → dark → back to system (F11, #159).
 *
 * Runs the real SPA against a fixture backend (see api-fixture.mjs) — useful when a real API +
 * Postgres isn't available, and it keeps the take deterministic either way.
 *
 * Record against a production build, not the dev server: a hard reload on the dev server shows
 * ~0.7s of the browser's blank inter-document canvas while Vite re-serves unbundled ESM modules,
 * which on video is indistinguishable from the theme flash this demo exists to disprove. The built
 * shell has no such gap.
 *
 *   cd app && npm run build && npx vite preview --port 4173 &
 *   STEPS=../docs/demo/dark-mode.steps.mjs BASE_URL=http://localhost:4173 \
 *     VIDEO_DIR=/tmp/tb-demo WIDTH=1024 HEIGHT=900 \
 *     node ../.claude/skills/demo-video/scripts/record-harness.mjs
 *   W=1024 H=900 ../.claude/skills/demo-video/scripts/to-mp4.sh ../teambalance-demo.mp4 /tmp/tb-demo/*.webm
 *
 * The mp4 itself is gitignored on purpose — see the "Demo recordings" note in .gitignore.
 */
export default async function script({ page, caption, section, sleep, click, BASE }) {
  // The app's tab bar is fixed to the bottom, exactly where the harness parks its caption pill.
  // Pre-create the pill higher up (caption() only styles it when it has to create it), so the
  // narration never covers the nav we're demonstrating.
  const say = async (text, hold = 0) => {
    await page.evaluate(() => {
      const el = document.getElementById('__demo_caption__')
      if (el) return
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

  const tab = (name) => page.locator('nav').getByRole('link', { name, exact: true })
  const themeOption = (name) => page.locator('label').filter({ hasText: new RegExp(`^${name}$`) })

  await installFixtureApi(page)

  await section('events', async () => {
    await page.goto(BASE) // the one hard navigation — entering the app
    await page.waitForLoadState('networkidle')
    await page.getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 900)
    await say("TeamBalance — a volleyball team's events at a glance", 2400)
  })

  await section('rsvp', async () => {
    await say('The next event leads, with the RSVP built in', 1800)
    await say('One tap to answer — no navigation', 900)
    await click(page, page.getByRole('button', { name: /I'm in/ }))
    await sleep(page, 700)
    await say('The headcount and your status update on the spot', 2600)
  })

  await section('detail', async () => {
    // Caption the cause *before* the click: a stale caption riding along into the next screen reads
    // as a mislabelled slide.
    await say('Open one for the full picture', 900)
    await click(page, page.getByText('Season Drinks').first())
    await page.waitForLoadState('networkidle')
    await sleep(page, 500)
    await say('Every event opens to who is in, who is out', 2600)
  })

  await section('team', async () => {
    await say('The team tab holds the roster', 800)
    await click(page, tab('Team'))
    await sleep(page, 700)
    await say('Shared — every member can see it, not just admins', 2400)
  })

  await section('to-dark', async () => {
    await say('Now for the new bit — Profile', 800)
    await click(page, tab('Profile'))
    await sleep(page, 700)
    await say('Appearance is a personal setting, so it lives here', 2000)
    await say('System is the default. Pick Dark to override it.', 1200)
    await click(page, themeOption('Dark'))
    await sleep(page, 900)
    await say('One class on the root — every colour token re-points', 3200)
  })

  await section('dark-tour', async () => {
    await say('Back to the events…', 800)
    await click(page, tab('Events'))
    await sleep(page, 800)
    await say('The whole app follows. Same brand, adapted, not inverted.', 3400)
    await say('And the same is true inside an event', 800)
    await click(page, page.getByText('Season Drinks').first())
    await page.waitForLoadState('networkidle')
    await sleep(page, 600)
    await say('Attendance keeps its meaning: green in, gold maybe, red out', 3400)
  })

  await section('reload', async () => {
    await say('One last thing', 700)
    await click(page, tab('Profile'))
    await sleep(page, 700)
    await say('The choice is stored — watch a full reload', 1800)
    await page.reload({ waitUntil: 'networkidle' })
    await sleep(page, 1200)
    await say('No flash: the theme is applied before the first frame', 3200)
  })

  await section('back-to-system', async () => {
    await say('Or hand it back to the OS. System is the default.', 1400)
    await click(page, themeOption('System'))
    await sleep(page, 1000)
    await say('System · Light · Dark — a personal setting, per device', 3000)
  })
}
