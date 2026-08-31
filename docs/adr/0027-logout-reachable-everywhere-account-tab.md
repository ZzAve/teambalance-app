# ADR-0027: Log out reachable from every state — a team-independent Account tab + local session-clear

- Status: Accepted
- Date: 2026-08-30
- Relates to: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (magic-link auth + logout),
  [ADR-0019](0019-self-service-team-onboarding.md) (the teamless onboarding hub, kept unchanged),
  [ADR-0023](0023-active-team-explicit-tenant-resolution.md) (Active Team is a session property, not a URL fact),
  [ADR-0024](0024-platform-admin-act-as.md) (act-as: an Active Team that is not a membership),
  [ADR-0026](0026-member-team-profile-owned-by-the-tenant.md) (name + position are tenant-scoped member data)
- Design reference: interactive concept prototype (gap map, adaptive Account tab, Teams sub-page,
  escape hatch) — <https://claude.ai/code/artifact/cf79c4de-6dde-4cc5-bd88-41b8978e475f> (access-gated)

## Context

Log out lives in exactly one place. `useLogout()` (`shared/api/auth.ts`) is consumed by a single
`LogoutButton` on the Profile page, `routes/t/$slug/profile`. That page is reachable only through the
BottomNav **Profile** tab, and the tab only resolves to it when the URL already carries a team slug:
`BottomNav` builds its destinations from `teamRoutes(teamSlugFromPath(pathname))`, and
`teamRoutes(null)` collapses **every** tab — Profile included — to `/`, the dispatcher
(`shared/lib/team-routes.ts`). So logout is reachable only from a fully-onboarded `/t/:slug/…` screen.

That leaves ten signed-in states with **no way to log out**:

- **Teamless, in-shell** — `/onboarding`, `/onboarding/join`, `/create-team`, `/select-team`,
  `/admin/teams`, `/admin/creation-codes`. The root gate (`routes/__root.tsx` `beforeLoad`) actively
  parks teamless users here, and every BottomNav tab points at `/`, which loops straight back.
- **Per-team onboarding** — `/t/:slug/get-started`. The `/t/$slug` guard bounces any non-onboarded
  member back to get-started for every path *except* get-started itself, so tapping Profile returns
  here. The user is fully trapped.
- **Out-of-shell** — the router's `defaultErrorComponent` (Retry only), the pending
  `WakingSplash`, and the verify→invite-accept-failure state (authenticated but stranded on
  `/auth/verify`). These render *instead of* `RootLayout`, so there is no header and no BottomNav at
  all. There is also **no** `defaultNotFoundComponent`.

The through-line: logout is bound to a **route that only exists inside a team**, but the states that
strand a user are exactly the ones *before* they have an active, onboarded team — or *outside* the
shell entirely.

This is a phone-first PWA whose single primary navigation is the BottomNav (the header carries only
identity). The fix should lean on that bar, not add a second navigation surface.

## Decision

### Principle: logout is a property of having a session, not of standing on a page

If `/auth/me` resolves to a user, a logout control is reachable — through the always-present Profile
tab when the shell renders, and through a local escape hatch when it can't. One rule, no exceptions.

### 1. The Profile tab becomes a team-independent `/account` route

The merged surface moves off `/t/$slug/profile` to a top-level **`/account`**, and the BottomNav
Profile tab points at that constant unconditionally — never again through `teamRoutes(...)`. Because
`/account` is not team-scoped, it resolves on every in-shell screen regardless of slug, and one move
closes **both** structural gaps:

- **Teamless.** `/account` is added to the root gate's `isTeamlessRoute` allow-list, so a teamless
  caller reaches it instead of being redirected to `/onboarding`.
- **Get-started.** `/account` sits *outside* the `/t/$slug` route tree, so the per-team onboarding
  guard — which only bounces paths under `/t/:slug` — never touches it. The trap is gone by
  construction, not by a new exception.

The team-scoped `/t/$slug/profile` becomes a redirect to `/account`, so existing links and bookmarks
keep working while `/account` is the single source of truth.

**Why a team-independent route rather than a header account menu.** A header menu would also cover
the in-shell routes, but it adds a second navigation surface to a bar-first app and still leaves the
out-of-shell states (§3) uncovered. Routing the existing tab correctly is less UI, not more.

### 2. The Account tab is one adaptive settings list; sections appear by context

Rendered as a settings-style list (not cards): the common case is a single team, and a list stays
tidy at three rows and scales cleanly to seven. What shows is a pure function of the authenticated
user:

| Section | Shown when | Why |
|---|---|---|
| Email | always | Identity of the session itself. |
| Appearance | always | A personal, device-level preference (the existing `ThemeToggle`). |
| **Teams** | always | A single entry naming the Active Team; opens the Teams view (§4). |
| Log out | always | The whole point. |
| Display name | Active Team present | Member data is tenant-scoped (ADR-0026): different per team. |
| Position | Active Team present | A position only means something inside a team roster. |
| Platform admin | `isPlatformAdmin` | Links to the platform consoles. |

The selector is a pure, unit-tested function; the `AccountView` is prop-only and renders the same
Log-out control in **every** state including its own loading and error shells (so a failed
member-profile fetch never hides logout). Name and position are the *only* team-conditional rows,
and they read the Active Team from the session — no slug in the URL.

### 3. A local `clearSession()` escape hatch for the states that render without the shell

`/account` cannot save the out-of-shell states, because they render in place of `RootLayout`. Each
gets its own logout affordance wired to a **client-only** `clearSession()` — drop the user store,
set `['auth','me']` to `null`, and hard-redirect to `/login` — with **no** `api.Logout()` round-trip,
so it works when the backend is the thing that is down:

- the router's `defaultErrorComponent` (`RouteErrorFallback`) gains a "Log out" beside "Retry";
- the verify→invite-accept-failure state gains the same;
- a new `defaultNotFoundComponent` (a real 404) carries it too.

`clearSession()` is the shared primitive; the normal in-shell logout keeps calling `api.Logout()`
first (a clean server-side session teardown) and then runs the same client clear.

**Rejected: a logout on the cold-start `WakingSplash`.** The splash renders *before* the session
probe resolves — there may be no confirmed session to end — and it is transient. If the wake fails,
it escalates to `RouteErrorFallback`, which *does* carry the hatch. A control on a "waking…" screen
would be noise on the one screen where logout has nothing to act on yet.

### 4. Teams is a single entry that opens a sub-page — the "main view" — not an inline list

The Teams row names the Active Team (or hints "join or create" when there is none) and opens a Teams
management view: **switch between your teams · join with an invite link · create a team** — all
three. This generalizes the existing `/select-team` (`features/switch-team`), whose guards are
relaxed so it is reachable with an Active Team set, and which gains the join/create entry points
alongside the switcher.

The **teamless onboarding page (`/onboarding`) stays unchanged** as the core view for a user with no
team; the Teams sub-page mirrors it for members. A teamless caller reaching `/select-team` still
redirects to `/onboarding`, so there is one core teamless view, not two.

### 5. The top bar is unchanged: team identity + switch, only

The header already carries just the wordmark and `TeamSwitcher`, which names the Active Team and
switches when the caller is in more than one (ADR-0023 §3). No change is needed — the switch also
lives in the Account tab's Teams view (§4), so the header is never the only door.

### 6. Frontend-only; no contract change

`/auth/me` already returns `teams[]`, `activeTeam`, `actAs` and `isPlatformAdmin`; the logout and
member-profile endpoints already exist. No Wirespec change, no backend change. Every decision above
is routing, one pure selector, and presentational components.

## Consequences

- **A teamless `/account` must not trigger the forced-logout bounce.** `auth-redirect.ts` turns a
  `403 NO_TEAM_MEMBERSHIP` into a hard redirect to `/login`; a teamless caller's member-profile
  query would produce exactly that. Two guards, together: the Account container fetches the current
  member only when an Active Team is present (`enabled: !!activeTeam`), and `/account` is added to
  `TENANT_RESOLVING_PATHS` so a stray 403 is treated as "no tenant here yet", not "log out". This is
  the same class of fix ADR-0023 made for `/select-team` and `/onboarding`.
- **Logout during act-as ends the whole session, not just the grant.** A platform admin acting-as
  (ADR-0024) has an Active Team without a membership; `/account` shows that team's name/position via
  the session tenant, and Log out tears down the session. Exiting act-as without logging out stays
  the `ActAsBanner`'s job — the two controls are distinct.
- **The get-started trap closes structurally.** Because `/account` is outside `/t/$slug`, no
  onboarding-guard exception is needed; a non-onboarded member can always reach it. The guard itself
  is untouched.
- **`teamRoutes` no longer needs a `profile` destination**, and the BottomNav's Profile tab stops
  depending on the slug. The other tabs (Events/Team/Money) still collapse to `/` when teamless;
  tapping them routes to the dispatcher, which is a sensible "go home". Whether to visually de-emphasise
  them on a teamless bar is a presentational follow-up, not part of this decision.
- **One new e2e seam.** Logout from a teamless (or mid-onboarding) session is a path the login and
  attendance flows never exercise, so it earns a single new flow (ADR-0017's bar): sign in with no
  onboarded team → open Profile → Log out → land on `/login`. Everything else is proved lower down —
  the section selector as a Vitest unit, the views as Storybook stories that assert Log out renders
  and fires in every state.
- **The old single-location logout is retired.** `LogoutButton` moves off `routes/t/$slug/profile`
  into `AccountView`; the team-scoped profile route becomes a thin redirect. Nothing in the app
  reaches logout through a team slug any more.
</content>
