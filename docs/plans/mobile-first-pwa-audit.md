# UI/UX Audit — Mobile-First & PWA Readiness

> **Status:** Audit only (no implementation yet). Produced with the `impeccable`
> methodology (craft, token discipline, anti-slop, native patterns) and the
> `build-for-good-ux` skill (the four states, feedback, familiar patterns).
> **Scope of review:** `app/` frontend — navigation, layout, states, tokens, PWA layer.
> **Direction requested:** more mobile-first, installable as a PWA, native navigation
> patterns, consistent layouting.

## Recorded decisions

- **Dark mode: wire it up.** Add real dark tokens + `theme-color` so system-dark users
  get a proper dark PWA (currently dead code — see F11). To be done in the
  implementation phase, not this audit.

## Priority legend

| Tier | Meaning |
|------|---------|
| **P0** | Blocks the stated goal (mobile-first / installable PWA) or silently loses user work |
| **P1** | Breaks a native expectation or a build-for-good-ux rule; visible friction |
| **P2** | Consistency / craft; low risk, compounding value |

---

## P0 — Blocks the goal

### F1. Navigation is split-brained and half-dead
**Where:** `app/src/shared/ui/BottomNav.tsx`, `app/src/routes/__root.tsx` (header)
**Lens:** Jakob's Law (build-for-good-ux) · native patterns (impeccable)

Native mobile apps have **one** primary navigation surface. TeamBalance has two, and
neither is whole:

- `BottomNav` declares 3 tabs, but **2 of 3 are `disabled` and all 3 use `to: '/'`**.
  "Money Pool" and "Team" are decorative dead ends; only "Events" navigates.
- The **real destinations** (Profile, Members, Settings, Log out) live in the header as
  `text-xs` links — tiny, clustered, out of the thumb zone.

A tab bar that looks native but doesn't navigate breaks the user's model the first time
they tap a dead tab.

**Fix direction:** Make the bottom tab bar the single primary nav. Route every tab to a
real screen; where a screen doesn't exist yet, render a proper empty state ("Coming soon"
with context) instead of a disabled dead-link. Move admin/profile actions off the header
into the Profile tab or an overflow menu.

### F2. No PWA scaffolding at all — not installable, no offline
**Where:** `app/` (no `public/`, no manifest, no service worker), `app/index.html`
**Lens:** the requested goal

- No `manifest.webmanifest`, no service worker, **no icons anywhere** (`app/public/`
  does not exist). The app cannot be installed and has zero offline capability.
- `index.html` has no `theme-color`, no `apple-touch-icon`, no `apple-mobile-web-app-*` /
  `mobile-web-app-capable` meta. Installed, it would render with browser/white chrome.

**Fix direction:** Add `vite-plugin-pwa` (manifest + Workbox service worker), a full icon
set including a **maskable** icon, `theme-color` (light + dark), and the Apple meta tags.

### F3. No safe-area handling — bottom nav collides with the iOS home indicator
**Where:** `app/index.html` (viewport), `BottomNav.tsx` (`fixed bottom-0`), `global.css`
**Lens:** native patterns

- Viewport lacks `viewport-fit=cover`; there is **no `env(safe-area-inset-*)` anywhere**
  (grepped — zero hits).
- The `fixed bottom-0` tab bar will sit **under the home indicator** in standalone mode.
- Layout uses `min-h-screen` / `100vh`, not `100dvh` — mobile browser chrome clips content.

**Fix direction:** `viewport-fit=cover`; pad the tab bar with
`env(safe-area-inset-bottom)`; migrate `100vh` → `100dvh` for full-height regions.

### F4. Silent failure on the core interaction (attendance toggle)
**Where:** `app/src/shared/api/attendances.ts` (`useSetAttendance`)
**Lens:** build-for-good-ux — "never silently fail"; optimistic UI for toggles

`useSetAttendance` has **no `onError` and no optimistic update**. On a failed tap the UI
just re-enables with no feedback — the most-used action in the app can fail invisibly.
The skill names toggles as *the* canonical optimistic-UI case.

**Fix direction:** Optimistic cache update on mutate; rollback + error toast on failure.
Replace the broad `invalidateQueries` flash with a targeted optimistic write.

---

## P1 — Breaks a native/UX expectation

### F5. Event detail shows the wrong cause on a fetch error
**Where:** `app/src/routes/events/$eventId.tsx`
**Lens:** build-for-good-ux — error states (what / why / next)

`if (!event) return <p>Event not found.</p>` with **no error branch** — a network/500
renders "Event not found" (wrong "why", no recovery action, no back link). Loading is a
bare `<p>Loading...</p>`.

**Fix direction:** Distinguish error from empty; error state with a retry + back action;
skeleton for loading.

### F6. Loaders are bare text, not skeletons
**Where:** `EventListView.tsx`, `events/$eventId.tsx`
**Lens:** build-for-good-ux — loader selection (skeletons for full sections)

Full-section loads show `"Loading..."`. Skeleton screens are the prescribed loader for
pages/large sections; they also prevent layout shift on arrival.

### F7. Touch targets below 44px
**Where:** header links (`text-xs`, `__root.tsx`), segmented toggle (`py-1`, `index.tsx`),
filter pills (`py-1 text-xs`), back button (`h-8 w-8` = 32px, `$eventId.tsx`)
**Lens:** native patterns / accessibility

Multiple interactive targets fall under the 44×44px minimum, clustered enough to mis-tap.

### F8. View-transition direction is a fragile heuristic
**Where:** `__root.tsx` (`useViewTransitions`)
**Lens:** impeccable — consistent motion

Back/forward is inferred from `prevPath.length > nextPath.length`, so lateral moves
(`/team/settings` → `/profile`) animate "backward." Inconsistent motion reads as jank.

**Fix direction:** Derive direction from router history index / a nav-intent signal, not
string length.

---

## P2 — Consistency & craft

### F9. Semantic color drift — two reds for one meaning
**Where:** `events/$eventId.tsx` uses `bg-red-500` / `text-red-500` (Tailwind default)
while `tokens.css` defines `--color-red` / `text-red` used elsewhere.
**Lens:** impeccable — token discipline

### F10. Bespoke palette hardcoded in a component
**Where:** `events/$eventId.tsx` — a 6-color avatar array (`#7B5EA7`, `#E87C3E`, …) not in
`tokens.css`.
**Lens:** impeccable — "don't hand-type values; use tokens"

### F11. Dark mode is dead code
**Where:** `global.css` (`@custom-variant dark`, `.dark` referenced) — but no dark tokens.
**Lens:** impeccable / native expectation → **decision: wire it up** (see top).

System-dark users get a light app; there's no `theme-color` to match. On mobile this reads
as unfinished.

### F12. No shared page-header pattern; magic-number coupling
**Where:** `events/$eventId.tsx` sticky sub-header at `top-[57px]` — coupled to the app
header's height; each page reinvents its title treatment.
**Lens:** consistent layouting

**Fix direction:** One `PageHeader` component; derive sticky offset from a header-height
token/variable, not a literal.

### F13. Fonts render-blocking from Google Fonts CDN
**Where:** `app/index.html`
**Lens:** PWA offline + performance + privacy

Two families load from `fonts.googleapis.com` — render-blocking, unavailable offline
(breaks the PWA promise), and a third-party request. Self-host for an installable app.

### F14. Header hardcodes the team name ("Heren 3")
**Where:** `__root.tsx`
**Lens:** correctness / consistency — should come from team context, not a literal.

---

## What's already good (preserve)

- **Container/View split** (`EventListView`) — states testable in isolation.
- **Bottom-sheet primitive** with grab handle (`sheet.tsx`) — idiomatic mobile.
- **Cold-start splash + backend warm-ping** (`index.html`, `ColdStartSplash`) — thoughtful.
- **View Transitions foundation** and the **segmented Upcoming/Past control**.
- Login and the events-list error/empty states are solid reference implementations.

The bones are right; the issues are in wiring, tokens, and the missing PWA layer.

---

## Suggested implementation sequencing (for later)

1. **Nav + PWA shell** — real bottom-tab navigation (F1); installability (F2); safe-area +
   `dvh` (F3); self-host fonts (F13).
2. **State gaps** — optimistic + error attendance (F4); detail error/skeleton (F5, F6).
3. **Dark mode** — dark tokens + `theme-color` (F11, decided).
4. **Consistency** — `PageHeader` (F12); fold reds + avatar palette into tokens (F9, F10);
   touch-target sweep (F7); motion-direction fix (F8); team name from context (F14).
