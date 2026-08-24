# App Caching — Blank Screens & Stale Deploys Fix Plan

**Goal:** Eliminate two user-reported symptoms on `app.teambalance.nl`:
1. **Blank screen**, often right after a deploy.
2. **"Changes didn't come through"** — a deploy appears not to take effect until much later.

Both trace to the interaction between content-hashed immutable assets that are **deleted on
every deploy**, lazy-loaded route chunks with **no load-failure recovery**, and a **Workbox
service worker** that serves the precached old shell cache-first. This plan removes each root
cause at the lowest layer that fixes it.

**Status:** Draft — not yet implemented. No code changed.

**Branch:** `claude/app-caching-blank-screen-dh3i9m`

---

## Diagnosis (evidence-based)

All asset `Cache-Control` is set at upload time in the deploy step; there is **no** nginx/netlify/
vercel/`_headers` config and the Spring API serves no static assets. Files served from Scaleway
Object Storage behind Scaleway Edge Services (CDN).

### Symptom A — Blank screen after deploy

Three things combine, with no safety net:

1. **Route chunks are lazy-loaded.** `app/vite.config.ts:14` — `autoCodeSplitting: true`. Each
   TanStack route is a hashed chunk fetched via dynamic `import()` on navigation.
2. **Old hashed chunks are deleted immediately on deploy.** `.github/workflows/ci.yml:306-307` —
   the assets sync uses `--delete`, so the previous deploy's `assets/*-<hash>.js` vanish the
   instant the new deploy lands.
3. **No recovery for a failed dynamic import.** Grep of `app/src` finds no `vite:preloadError`,
   `ChunkLoadError`, or router `defaultErrorComponent` handling (`app/src/app/index.tsx` sets only
   `defaultPendingComponent`). A client still running the *old* shell (a long-open tab, the
   installed PWA, or the SW serving the old precached `index.html`) navigates to a not-yet-loaded
   route → requests a chunk hash that was just `--delete`d → **404 → import rejects → blank**.

`cleanupOutdatedCaches: true` (`app/src/app/pwa/manifest.ts:62`) widens the window: once the new
SW activates it evicts the old chunks from Cache Storage too, so even the offline fallback can't
serve them.

### Symptom B — Stale content / "didn't come through"

The Workbox precache defeats the `no-cache` header on `index.html`:

- `globPatterns: ['**/*.{js,css,html,...}']` (`manifest.ts:51`) precaches `index.html`, and
  Workbox serves precached URLs **cache-first**. `navigateFallback: '/index.html'` (`manifest.ts:53`)
  means installed clients get the **old shell from the SW cache**, never hitting the origin — so
  `index.html`'s `no-cache` (`ci.yml:308-309`) is bypassed for exactly the returning users who
  matter most.
- `registerType: 'autoUpdate'` (`vite.config.ts:24`) installs the new SW in the background but the
  running tab keeps the old shell; new content only appears on the **next** navigation. For an
  installed PWA that's rarely fully closed, "next" can be a long time → looks like the deploy never
  landed.

### Secondary — landing page (`teambalance.nl`) stale CSS

`www/index.html` is `no-cache` (`ci.yml:328`) but the **unhashed** files it references —
`www/style.css` and `design-tokens/tokens.css` — are uploaded with **no `--cache-control`**
(`ci.yml:330-331`), so they inherit the bucket/CDN default TTL. After a landing deploy the HTML
updates while its CSS can be served stale → a half-updated landing page. (The SPA's own
`tokens.css`/`style.css` are bundled+hashed by Vite and unaffected.)

### Tertiary — edge purge is fire-and-forget

`ci.yml:333-336` issues `scw edge-services purge-request ... all=true` for both pipelines and never
verifies it. A skipped/failed purge, or the edge honoring its own TTL over `no-cache` briefly, is a
third path to serving a stale `index.html` that points at pruned chunks.

---

## Fixes

Ordered by impact. Phases 1–2 kill the blank screen; Phase 3 kills the stale-content lag; Phases
4–5 close the landing-page and edge gaps. Phases are independent and shippable separately.

### Phase 1 — Recover from failed chunk loads (kills the blank screen for clients already loaded)

**Change (`app/`):** Add a global, one-shot reload guard for dynamic-import failures.

- Listen for Vite's `vite:preloadError` event on `window` (dispatched by Vite's built-in preload
  helper when a lazy chunk fails), and also catch router load errors.
- On failure, if we have **not** already reloaded for this reason in the current session, set a
  `sessionStorage` sentinel and `location.reload()` — the reload fetches the fresh (`no-cache`)
  `index.html`, which references chunk hashes that *do* exist. If the sentinel is already set (the
  fresh shell *also* failed → a real outage, not a stale-chunk race), **don't** loop: clear the
  sentinel and render a small "couldn't load — retry" fallback instead.
- Add a `defaultErrorComponent` to the router (`app/src/app/index.tsx`) so a route that still throws
  renders that fallback rather than nothing.

**Why this layer:** it's the missing safety net; it makes the deploy race self-healing regardless of
how the stale shell was obtained (SW, tab, or edge).

**Tests (lowest layer that proves it):**
- **Vitest unit** for the pure decision function `shouldReloadForChunkError(sentinelPresent): 'reload' | 'fallback'` — reload when no sentinel, fallback when set. This is the irreducible logic; the `window` event + `location.reload` wiring is thin.
- **Storybook story** for the fallback error component (data/error states) with an `fn()` spy on its retry callback asserted via `toHaveBeenCalled` in `play` (per the PR gate for interactive components).
- **No new e2e**: this introduces no new auth/tenant/integration seam (per the gate, e2e is justified only then). State that in the PR.

### Phase 2 — Keep old chunks alive briefly (removes the cause, not just the symptom)

**Change (`.github/workflows/ci.yml` + bucket policy):** Stop deleting hashed assets on the same tick
they stop being referenced.

- Drop `--delete` from the `assets/` sync (`ci.yml:307`). Hashed + `immutable`, so re-uploading
  unchanged hashes is a harmless no-op and stale hashes never collide.
- Reclaim space with a **bucket lifecycle rule** on `assets/` (e.g. expire objects N days after last
  modification — 30 days is generous vs. how long a client stays on an old shell). Configure via
  Scaleway; document the rule in `docs/ops/deploy.md` since bucket config isn't in-repo.
- Keep upload order as-is (assets **before** `index.html`, `ci.yml:306` then `:308`) so `index.html`
  never references a not-yet-uploaded hash.

**Why:** with old chunks retained, a client on the previous shell can still fetch its chunks during
the overlap window; Phase 1 catches anything past the retention horizon. Together they make the race
unobservable.

**Tests:** infra change — no app test layer applies. Verify by inspecting the deploy step and the
lifecycle rule; note the manual verification (deploy twice, confirm prior-deploy `assets/*` still
GET-able) in the PR.

### Phase 3 — Deterministic SW updates (kills the "didn't come through" lag)

**Change (`app/`):** Replace silent `autoUpdate` with an explicit update-and-reload.

- Switch `registerType` to `'prompt'` and register via `virtual:pwa-register/react`
  (`useRegisterSW`) instead of `injectRegister: 'auto'` (`vite.config.ts:23-31`). On `needRefresh`,
  show a lightweight "New version available — Reload" toast wired to `updateSW(true)`.
- Reconsider `clientsClaim: true` (`manifest.ts:63`): with a prompt-driven reload the new SW takes
  control on the user's reload, so immediate claim is no longer needed and its mid-session swap
  risk goes away. Keep `cleanupOutdatedCaches: true`.
- Net effect: the user gets a clear, one-click path to the new version; no silent mid-session flip,
  no indefinite "still on old shell."

**Trade-off / decision:** this is a small UX addition (a toast) vs. the current zero-UI autoupdate.
Chosen because the silent path is precisely what makes deploys feel like they "didn't land." If we'd
rather keep zero-UI, the fallback is `autoUpdate` **plus** a `controllerchange` listener that reloads
once — but that reintroduces an automatic mid-session reload, which is worse UX than a prompt.
**Recommend the prompt.** Flagging for confirmation before implementing.

**Tests:**
- **Storybook story** for the update-available toast: idle vs. update-available states; `fn()` spy on
  the reload callback asserted with `toHaveBeenCalled` in `play`.
- **Vitest unit** for any pure "should prompt" logic if extracted.
- The `useRegisterSW` wiring is a network/SW seam with no story or real-backend path — thin container,
  covered by manual verification (deploy, confirm toast, click, confirm fresh shell). Not a new
  sanctioned MSW test (doesn't meet the fourth-exception bar in CLAUDE.md).

### Phase 4 — Landing page CSS: stop it going stale

**Change (`.github/workflows/ci.yml`):** Give the unhashed landing assets an explicit header that
matches how they're referenced.

- Add `--cache-control no-cache` to the `www/style.css` and `design-tokens/tokens.css` uploads
  (`ci.yml:330-331`), matching `www/index.html`. Simplest correct fix for unhashed, root-referenced
  CSS. (A longer-lived alternative would be to hash+fingerprint them, but the landing page is tiny
  and rarely changes — `no-cache` is proportionate.)

**Tests:** infra — verify header via `curl -I` post-deploy; note in PR.

### Phase 5 (optional) — Make the edge purge verifiable

**Change (`.github/workflows/ci.yml`):** Ensure a failed purge fails the job.

- Confirm the purge step runs under `set -e` (the sync step at `:304` does; the purge step at
  `:333-336` should too) and, if the API supports it, poll/verify the purge completed before the job
  goes green. Low priority given Phases 1–2 already make a stale edge shell self-healing.

---

## Rollout & verification

- Ship **Phase 1 first** on its own — it's pure app code, low risk, and immediately stops the blank
  screen from being user-visible even before the deploy pipeline changes land.
- Then **Phase 2** (pipeline + bucket rule), then **Phase 3** (SW UX), then **4/5**.
- Manual verification per change (per CLAUDE.md feedback-loops): deploy to a `deploy*` branch, then
  from a client on the *previous* build (a) navigate to an unvisited route → no blank; (b) confirm
  the update toast appears and reload yields fresh content; (c) `curl -I` the landing CSS for
  `no-cache`.

## Considered and rejected

- **Adopting the `pwa-today/basic-service-worker` hand-rolled worker.** Its offline POST/PUT/DELETE
  replay queue is unsafe for a multi-tenant cookie-authed backend (the very reason `manifest.ts:56-60`
  marks `/api` `NetworkOnly`), and its manual `SW_VERSION` bumping is more error-prone than the
  hashed precache manifest Workbox already generates. Its one good idea — gating client claim on tab
  count — is subsumed by Phase 3's prompt-driven update. Not adopted.
- **Dropping the service worker entirely.** Would fix stale content but lose the installable
  offline shell (F2, #159). Not warranted; the update flow is the real gap, not the SW itself.
