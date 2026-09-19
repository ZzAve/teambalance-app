/**
 * Demo take: BEFORE / AFTER side-by-side for the UX-review pass (#338, #339, #336, #341, #343) —
 * the six-step type scale and one 16px corner, sentence-case labels app-wide, readable gold ink,
 * admin actions collapsed into one overflow menu with red reserved for the confirm, and an honest
 * money teaser. This is the two-version companion to ux-review-b.steps.mjs (the single-version take
 * of the same changes) — same storyline, same hard-won locators, but every beat performs the
 * identical interaction in a Before pane (origin/main) and an After pane (this branch) at once.
 *
 * Mechanics: the two builds are served on separate static origins (see the header comment at the
 * bottom for exact ports) and composited by a tiny static wrapper page (a scratch file, not
 * committed — see the recording command below) that embeds each build in its own same-height
 * <iframe name="before"|"after">, sized from its own `?path=` query param. This script drives BOTH
 * iframes from the ONE top page/context: `installFixtureApi(page)` is called once, on the top page — Playwright's
 * `page.addInitScript` and `page.route` apply to every frame attached to that page (iframes
 * included), so one fixture install serves both builds' /api/* calls and blocks both service
 * workers. `page.frame({ name })` hands back each iframe's Frame object; a Frame's own
 * `.getByRole()`/`.locator()` return ordinary Locators whose `.boundingBox()` already resolves to
 * TOP-PAGE viewport coordinates, so the shared `click`/`scrollTo`/`moveTo` helpers (which drive
 * `page.mouse` in top-page space) work on iframe content completely unmodified — confirmed by an
 * earlier probe script; see the README's own gotchas list for the shared api-fixture footguns.
 *
 * Text content is IDENTICAL between the two builds for every heading this take narrates ("Your
 * response", "Roster", "Change Fleur Smit's answer", "Team settings", …) — the UX-review PR changes
 * CSS classes (uppercase tracking vs a plain SectionLabel component, twelve one-off sizes vs the six-
 * step scale), never the accessible name. So every locator below is shared verbatim across both
 * frames EXCEPT the admin-action controls in Team settings, which really did change shape (six
 * always-visible buttons/inputs on main vs one ⋯ overflow menu on this branch) — those get separate
 * before/after locators, confirmed by reading the pre-#341 components in the origin/main worktree.
 *
 * Record against TWO production builds, same-origin, on fixed ports — see the "five things" note in
 * README.md for why (baked-in VITE_API_URL, the dev server's blank inter-document canvas, the
 * service worker, fixture/contract drift, the caption pill above the bottom nav — all apply here
 * exactly as in the single-version take).
 *
 *   # Before = origin/main, built in a worktree with node_modules symlinked + the generated API
 *   # client copied over (both gitignored):
 *   git worktree add <scratch>/before origin/main
 *   ln -s <repo>/app/node_modules <scratch>/before/app/node_modules
 *   cp -r <repo>/app/src/shared/api/generated <scratch>/before/app/src/shared/api/generated
 *   (cd <scratch>/before/app && VITE_API_URL= npx vite build && npx vite preview --port 4173 --strictPort &)
 *
 *   # After = this branch:
 *   (cd app && VITE_API_URL= npm run build && npx vite preview --port 4174 --strictPort &)
 *
 *   # The side-by-side wrapper (a scratch index.html with two <iframe>s), its own tiny static origin:
 *   (cd <path-to-wrapper-dir> && python3 -m http.server 4175 &)
 *
 *   cd app && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
 *     STEPS=../docs/demo/ux-review-before-after.steps.mjs BASE_URL=http://localhost:4175 \
 *     VIDEO_DIR=<scratch>/tb-ba WIDTH=1280 HEIGHT=900 \
 *     node ../.claude/skills/demo-video/scripts/record-harness.mjs
 *   W=1280 H=900 ../.claude/skills/demo-video/scripts/to-mp4.sh \
 *     ../teambalance-ux-review-before-after.mp4 <scratch>/tb-ba/*.webm
 *
 * The mp4 itself is gitignored on purpose — see the "Demo recordings" note in .gitignore.
 */
import { installFixtureApi } from './api-fixture.mjs'

export default async function script({ page, caption, section, sleep, click, scrollTo, BASE }) {
  // Same idea as ux-review-b.steps.mjs's pill, parked above the bottom nav. Here it also sits above
  // BOTH panes' bottom tab bars at once (the panes share the one 900px-tall viewport), and is
  // created once at the top level — this take never does a second top-level navigation (every
  // further "page change" happens as an SPA nav *inside* an iframe, which does not touch the top
  // document), so the pill is never wiped and never needs re-creating.
  const say = async (text, hold = 0) => {
    await page.evaluate(() => {
      if (document.getElementById('__demo_caption__')) return
      const pill = document.createElement('div')
      pill.id = '__demo_caption__'
      pill.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:120px', 'transform:translateX(-50%)',
        'z-index:2147483647', 'background:rgba(20,20,22,0.92)', 'color:#fff',
        'font:600 17px/1.4 -apple-system,Segoe UI,Roboto,sans-serif',
        'padding:11px 20px', 'border-radius:10px', 'max-width:88vw', 'text-align:center',
        'box-shadow:0 6px 24px rgba(0,0,0,0.35)', 'border-left:5px solid #249E6C',
        'pointer-events:none',
      ].join(';')
      document.body.appendChild(pill)
    })
    await caption(page, text)
    if (hold) await sleep(page, hold)
  }

  const beforeFrame = () => page.frame({ name: 'before' })
  const afterFrame = () => page.frame({ name: 'after' })

  // Run the same action against both panes, Before then After, sequentially — the click/scroll
  // helpers drive one shared `page.mouse`, so true parallelism would fight itself over the pointer.
  const both = async (fn) => {
    await fn(beforeFrame(), 'before')
    await fn(afterFrame(), 'after')
  }

  // Every control scoped to its own card, exactly as the single-version take warns (README): two
  // cards share the `Show lineup` name, and opening one flips its own name to `Hide lineup`, which
  // silently renumbers a `.nth()` addressed the rest. `.card-enter` is EventCard's own root class in
  // BOTH builds (confirmed unchanged in the origin/main worktree).
  const trainingCard = (frame) =>
    frame.locator('.card-enter').filter({ has: frame.locator('a[href$="/events/evt-2"]') })
  const trainingLineup = (frame) => trainingCard(frame).getByRole('button', { name: /Show lineup/ })
  const trainingTitle = (frame) => trainingCard(frame).locator('a[href$="/events/evt-2"]')

  await installFixtureApi(page)

  // ---- 1. Events overview: scale, radius, sentence case, the lineup panel -------------------------
  await section('overview-land', async () => {
    await page.goto(`${BASE}/?path=/t/heren-3`) // the one hard navigation — the wrapper's own load
    await beforeFrame().getByText('League Match vs Smash United').first().waitFor()
    await afterFrame().getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 900)
    await say('Before (main) on the left, after (this PR) on the right', 2400)
  })

  await section('overview-scale', async () => {
    await say('One type scale, six steps, instead of fifty-eight one-off sizes', 2400)
    await say('And one soft corner — 16px — on the hero and every card', 2400)
  })

  await section('overview-case', async () => {
    await say('The type badge and "Next up" — sentence case now, not tracked caps', 2300)
  })

  await section('overview-lineup', async () => {
    await both(async (frame) => scrollTo(page, trainingTitle(frame)))
    await sleep(page, 400)
    await say('Open a card’s lineup —', 1100)
    await both(async (frame) => click(page, trainingLineup(frame)))
    await sleep(page, 800)
    await say('"Positions", the same sentence case, and the slot pips beneath it', 3000)
  })

  // ---- 2. Event detail: Roster / Your response / position groups, and the readable Maybe ---------
  await section('detail-open', async () => {
    await say('Into the event itself', 1000)
    await both(async (frame) => click(page, trainingTitle(frame)))
    await beforeFrame().getByText('Your response').first().waitFor()
    await afterFrame().getByText('Your response').first().waitFor()
    await sleep(page, 600)
    await say('"Roster", "Your response", every heading — sentence case', 2400)
  })

  await section('detail-groups', async () => {
    await both(async (frame) => scrollTo(page, frame.getByText('Fleur Smit').first()))
    await sleep(page, 500)
    await say('Down the list, the position groups read the same quiet way', 2000)
  })

  await section('detail-maybe', async () => {
    const fleurToggle = (frame) => frame.getByRole('button', { name: /Change Fleur Smit's answer/ })
    await say('Open a row —', 900)
    await both(async (frame) => click(page, fleurToggle(frame)))
    await sleep(page, 700)
    await say('Maybe used to sit gold-on-white. Now it has ink you can read.', 3400)
  })

  // ---- 3. Team settings: one quiet row, actions in one menu, red only inside the confirm ----------
  await section('settings-nav', async () => {
    await say('Over to Team settings', 1200)
    // exact:true — the wordmark link in the header is named "TeamBalance", a substring match on
    // "Team" alone hits it too (strict-mode violation) — same trap as the single-version take.
    await both(async (frame) => click(page, frame.getByRole('link', { name: 'Team', exact: true })))
    await beforeFrame().getByRole('link', { name: 'Team settings' }).waitFor()
    await afterFrame().getByRole('link', { name: 'Team settings' }).waitFor()
    await sleep(page, 400)
    await both(async (frame) => click(page, frame.getByRole('link', { name: 'Team settings' })))
    await beforeFrame().getByRole('heading', { name: 'Members' }).waitFor()
    await afterFrame().getByRole('heading', { name: 'Members' }).waitFor()
    await sleep(page, 700)
    await say('On main: six rows, each wrapping 3–4 lines, red Remove on every one', 2600)
    await say('On this branch: one quiet line per member, nothing shouting at rest', 2600)
  })

  await section('settings-member-menu', async () => {
    // Before never got a menu — the actions are just always-visible buttons on the row, and the
    // display-name field is an open input rather than a click-to-edit. Scope to Julia's own row via
    // the input's aria-label (`Display name for ${member.displayName}`, confirmed in the origin/main
    // worktree) so the highlight lands on the right member, not just "the first Remove button".
    const juliaRowBefore = () =>
      beforeFrame().locator('li').filter({ has: beforeFrame().getByLabel('Display name for Julia Vermeer') })
    const juliaMenuAfter = () => afterFrame().getByLabel('Actions for Julia Vermeer')

    await scrollTo(page, juliaRowBefore())
    await scrollTo(page, juliaMenuAfter())
    await sleep(page, 500)
    await say('Julia’s row — main already shows every action, all the time', 2400)
    await say('This branch moves them into one overflow menu', 1400)
    await click(page, juliaMenuAfter())
    await sleep(page, 600)
    await say('Rename, make member — plain. Remove is the only red in the list.', 2800)
    await page.keyboard.press('Escape')
    await sleep(page, 400)
  })

  await section('settings-archive', async () => {
    await say('Event types get the same treatment', 1400)
    // aria-label `Archive ${type.name}` on main (a standing destructive button); the ⋯ menu on this
    // branch (`Actions for ${type.name}`, confirmed in ManageEventTypesView.tsx).
    const archiveButtonBefore = () => beforeFrame().getByLabel('Archive Training', { exact: true })
    const trainingTypeMenuAfter = () => afterFrame().getByLabel('Actions for Training', { exact: true })

    await scrollTo(page, archiveButtonBefore())
    await scrollTo(page, trainingTypeMenuAfter())
    await sleep(page, 500)
    await say('Main: a standing red Archive button on every type', 2200)
    await click(page, trainingTypeMenuAfter())
    await sleep(page, 600)
    await say('Here: Archive… is reversible, so it stays plain — never the red treatment', 3000)
    await page.keyboard.press('Escape')
    await sleep(page, 400)
  })

  await section('settings-revoke', async () => {
    // The trigger shares the exact label "Revoke link" on BOTH builds — only the After build wraps
    // it in a confirm dialog (`confirmRevokeOpen` state, added by this PR). Never click the Before
    // one: on main it revokes immediately, no confirm, and this fixture's link is shared demo state.
    const revokeTrigger = (frame) => frame.getByRole('button', { name: 'Revoke link', exact: true })
    await both(async (frame) => scrollTo(page, revokeTrigger(frame)))
    await sleep(page, 500)
    await say('Same idea on the admin handover link', 1400)
    await say('On main, clicking Revoke fires immediately — no confirm', 2600)
    await click(page, revokeTrigger(afterFrame()))
    await sleep(page, 700)
    const revokeDialog = afterFrame().getByRole('dialog').filter({ hasText: 'Revoke the invite link?' })
    await revokeDialog.waitFor()
    await say('Here, it confirms first — before it does something you can’t undo', 3000)
    await click(page, revokeDialog.getByRole('button', { name: 'Cancel' }))
    await sleep(page, 500)
  })

  // ---- 4. Back to events -------------------------------------------------------------------------
  await section('finish', async () => {
    await both(async (frame) => click(page, frame.getByRole('link', { name: 'Events' })))
    await beforeFrame().getByText('League Match vs Smash United').first().waitFor()
    await afterFrame().getByText('League Match vs Smash United').first().waitFor()
    await sleep(page, 1000)
    await say('Same app on both sides. Just easier on the eyes.', 2400)
  })
}
