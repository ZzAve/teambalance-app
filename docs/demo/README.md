# Demo recordings

Scripted screencasts of the real SPA, driven by the `demo-video` skill (`.agents/skills/demo-video/`). New takes start from `.agents/skills/demo-video/scripts/steps.template.mjs` and use `api-fixture.mjs` for API interception.

## The five things that will cost you an hour

Learned the hard way while recording #325. None of them announce themselves.

1. **Build the SPA same-origin.** `.env.production` sets `VITE_API_URL=https://api.teambalance.nl`,
   so a stock `npm run build` points the recording at the real API. Build with `VITE_API_URL=` set
   in the shell (it beats the `.env` file) to keep the take on one origin and safely off production.

2. **Record a production build, never the dev server** — `cd app && VITE_API_URL= npm run build &&
   npx vite preview --port 4173`. A hard reload on the dev server shows ~0.7s of blank
   inter-document canvas while Vite re-serves unbundled ESM. On video that is indistinguishable
   from a state-loss bug, which is fatal for any demo whose point is that a reload changes nothing.

3. **Block the service worker.** The PWA's worker takes control on the *second* navigation, and
   Playwright's route interception cannot reach a page a worker controls — so the first load works
   and the reload comes up dead on the cold-start splash. `api-fixture.mjs` blocks registration from
   an init script, which is why the fixture is the thing to reuse rather than rolling your own
   `page.route`. Serving an empty `sw.js` does **not** work: that script still registers and
   activates, which is exactly why only the second navigation breaks.

4. **Keep the fixture in step with the Wirespec contract, and suspect it first.** Drift fails as a
   *hang*, not an error — the root guard reads `user.teams.length` and `authMeQueryOptions` rejects
   a body whose `teams` is not an array, so a stale payload parks the whole app on
   `ColdStartSplash` with a clean console. If a take hangs on the splash, diff one mocked payload
   against `app/src/shared/api/generated/model/` before debugging anything else.

5. **Spread the fixture's events across Roster states.** The Turnout chip group renders only when
   the list spans two or more bands (ADR-0029 §5), so a fixture where every event lands in one band
   shows the filter popover with a group missing and quietly misrepresents the control.

## Smaller things worth knowing

- **The caption pill must sit above the bottom nav.** The tab bar is fixed to the bottom, exactly
  where the skill's harness parks its caption. Both steps modules pre-create the pill at
  `bottom:120px` (the harness only styles it when it has to create it).
- **`exact: true` on short accessible names.** `getByRole('button', { name: 'Filters' })` also
  matches **Clear filters** — and only once a filter is active, so a probe of the landing page
  passes and the real take dies mid-way on a strict-mode violation.
- **The fixture's identity**: Julia Vermeer, `ADMIN`, team *Heren 3* (`heren-3`) — so persisted
  preferences land under `tb.pref.heren-3.*`.
- **Chromium**: the recording box may need `npx playwright install chromium-headless-shell`
  alongside the usual `chromium`.
- **Never address a disclosure by index.** Two event cards carry the same `Show lineup` name, and
  opening one flips *its* name to `Hide lineup` — which silently renumbers the rest, so a `.nth(1)`
  that resolved before the first beat times out after it. Scope to the card instead: `.card-enter`
  is EventCard's own root class, and the title link (`a[href$="/events/evt-2"]`) says which one.
- **Scroll first, then caption.** A caption that names a card must not land while the previous card
  is still the one on screen: `scrollTo` → short `sleep` → `say` → click.
- **The fixture's team is six people**, so anything with a larger threshold — the member list's
  15-cap and its see-all link (ADR-0030 §7) — cannot be filmed against it without growing `ROSTER`,
  which would change the Team page in every other take.
