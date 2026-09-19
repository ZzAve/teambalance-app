import { installFixtureApi } from './api-fixture.mjs'

/**
 * Demo take: the UX-review-B pass (#338, #339, #336, #341, #343) — the six-step type scale and
 * one 16px corner, sentence-case labels app-wide, readable gold ink, admin actions collapsed into
 * one overflow menu with red reserved for the confirm, and an honest money teaser with no invented
 * counter.
 *
 * The storyline follows the change in reading order: the events overview (scale, radius, sentence
 * case, the lineup panel's Positions label) → event detail (Roster / Your response / position group
 * headings, and Fleur's row to show the readable gold Maybe) → team settings (one quiet row per
 * member, ⋯ menus, red only inside the confirm) → the money teaser (one beat) → back to events.
 *
 * Runs the real SPA against the fixture backend (see api-fixture.mjs) — no JDK/Postgres needed.
 *
 * Record against a **production build**, built same-origin — see the "five things" note in
 * README.md (baked-in VITE_API_URL, the dev server's blank inter-document canvas on reload, the
 * service worker, fixture/contract drift, the caption pill above the bottom nav).
 *
 *   cd app && VITE_API_URL= npm run build && npx vite preview --port 4173 --strictPort &
 *   STEPS=../docs/demo/ux-review-b.steps.mjs BASE_URL=http://localhost:4173 \
 *     VIDEO_DIR=/tmp/tb-ux-b WIDTH=1024 HEIGHT=900 \
 *     node ../.claude/skills/demo-video/scripts/record-harness.mjs
 *   W=1024 H=900 ../.claude/skills/demo-video/scripts/to-mp4.sh ../teambalance-ux-review-b.mp4 /tmp/tb-ux-b/*.webm
 *
 * The mp4 itself is gitignored on purpose — see the "Demo recordings" note in .gitignore.
 */
export default async function script({ page, caption, section, sleep, click, scrollTo, BASE }) {
  // The app's tab bar is fixed to the bottom, exactly where the harness parks its caption pill.
  // Pre-create the pill higher up (caption() only styles it when it has to create it), so the
  // narration never covers the thing it is narrating. Re-created after any full navigation, which
  // wipes it — this take stays entirely in-app after the first entry, so that is once.
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

  // Every control scoped to its own card/row rather than addressed by index (README warning): two
  // cards can carry the same `Show lineup` name, and opening one flips its own name to `Hide
  // lineup`, silently renumbering the rest.
  const trainingCard = page.locator('.card-enter').filter({ has: page.locator('a[href$="/events/evt-2"]') })
  const trainingLineup = trainingCard.getByRole('button', { name: /Show lineup/ })
  const trainingTitle = trainingCard.locator('a[href$="/events/evt-2"]')

  await installFixtureApi(page)

  // ---- 1. Events overview: scale, radius, sentence case, the lineup panel -------------------------
  await section('overview-land', async () => {
    await page.goto(BASE) // the one hard navigation — entering the app
    await page.waitForLoadState('networkidle')
    await page.getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 900)
    await say('A pass on how everything is drawn — not what it does', 2200)
  })

  await section('overview-scale', async () => {
    await say('One type scale, six steps, instead of fifty-eight one-off sizes', 2300)
    await say('And one soft corner — 16px — on the hero and every card', 2300)
  })

  await section('overview-case', async () => {
    await say('The type badge and "Next up" — sentence case now, not tracked caps', 2200)
  })

  await section('overview-lineup', async () => {
    await scrollTo(page, trainingTitle)
    await sleep(page, 500)
    await say('Open a card’s lineup —', 1200)
    await click(page, trainingLineup)
    await sleep(page, 900)
    await say('"Positions", the same sentence case, and the slot pips beneath it', 3000)
  })

  // ---- 2. Event detail: Roster / Your response / position groups, and the readable Maybe ---------
  await section('detail-open', async () => {
    await say('Into the event itself', 1000)
    await click(page, trainingTitle)
    await page.waitForLoadState('networkidle')
    await page.getByText('Your response').first().waitFor()
    await sleep(page, 700)
    await say('"Roster", "Your response", every heading — sentence case', 2400)
  })

  await section('detail-groups', async () => {
    await scrollTo(page, page.getByText('Fleur Smit').first())
    await sleep(page, 600)
    await say('Down the list, the position groups read the same quiet way', 2000)
  })

  await section('detail-maybe', async () => {
    const fleurToggle = page.getByRole('button', { name: /Change Fleur Smit's answer/ })
    await say('Open a row —', 900)
    await click(page, fleurToggle)
    await sleep(page, 700)
    await say('Maybe used to sit gold-on-white. Now it has ink you can read.', 3400)
  })

  // ---- 3. Team settings: one quiet row, actions in one menu, red only inside the confirm ----------
  await section('settings-nav', async () => {
    await say('Over to Team settings', 1200)
    // exact:true — the wordmark link in the header is named "TeamBalance", a substring match on
    // "Team" alone hits it too (strict-mode violation).
    await click(page, page.getByRole('link', { name: 'Team', exact: true }))
    await page.waitForLoadState('networkidle')
    await sleep(page, 500)
    await click(page, page.getByRole('link', { name: 'Team settings' }))
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'Members' }).waitFor()
    await sleep(page, 700)
    await say('One quiet line per member — name, position, nothing shouting', 2400)
  })

  await section('settings-member-menu', async () => {
    const juliaMenu = page.getByLabel('Actions for Julia Vermeer')
    await scrollTo(page, juliaMenu)
    await sleep(page, 500)
    await say('Every action moved into one overflow menu', 1400)
    await click(page, juliaMenu)
    await sleep(page, 600)
    await say('Rename, make member — plain. Remove is the only red in the list.', 2600)
    await click(page, page.getByRole('menuitem', { name: 'Remove…' }))
    await sleep(page, 700)
    const removeDialog = page.getByRole('dialog').filter({ hasText: 'Remove member' })
    await removeDialog.waitFor()
    await say('And red only shows up once you actually mean it — the confirm', 2600)
    await click(page, removeDialog.getByRole('button', { name: 'Cancel' }))
    await sleep(page, 500)
  })

  await section('settings-archive', async () => {
    await say('Event types get the same treatment', 1400)
    const trainingTypeMenu = page.getByLabel('Actions for Training', { exact: true })
    await scrollTo(page, trainingTypeMenu)
    await sleep(page, 500)
    await click(page, trainingTypeMenu)
    await sleep(page, 600)
    await say('Archive is reversible, so it stays plain — never the red treatment', 3000)
    await page.keyboard.press('Escape')
    await sleep(page, 400)
  })

  await section('settings-revoke', async () => {
    // The trigger and the confirm dialog's destructive button share the exact label ("Revoke
    // link") — the dialog is scoped explicitly so the click always lands on the one meant.
    const revokeTrigger = page.getByRole('button', { name: 'Revoke link', exact: true })
    await scrollTo(page, revokeTrigger)
    await sleep(page, 500)
    await say('Same idea on the admin handover link', 1400)
    await click(page, revokeTrigger)
    await sleep(page, 700)
    const revokeDialog = page.getByRole('dialog').filter({ hasText: 'Revoke the invite link?' })
    await revokeDialog.waitFor()
    await say('Revoking now confirms too, before it does something you can’t undo', 3000)
    await click(page, revokeDialog.getByRole('button', { name: 'Cancel' }))
    await sleep(page, 500)
  })

  // ---- 4. Money tab: the honest teaser, no invented counter -----------------------------------
  await section('money', async () => {
    await say('One more: the Money tab', 1000)
    await click(page, page.getByRole('link', { name: 'Money' }))
    await page.waitForLoadState('networkidle')
    await page.getByText('A shared team pot is on its way').first().waitFor()
    await sleep(page, 900)
    await say('An honest teaser — no invented "N people want this" counter', 3200)
  })

  // ---- 5. Back to events -------------------------------------------------------------------------
  await section('finish', async () => {
    await click(page, page.getByRole('link', { name: 'Events' }))
    await page.waitForLoadState('networkidle')
    await page.getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 1000)
    await say('Same app. Just easier on the eyes.', 2300)
  })
}
