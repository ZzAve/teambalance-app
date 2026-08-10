# Testing

Reference for the four-layer test pyramid. See `CLAUDE.md § Testing` for the PR gate and taxonomy rules.

## Command surface

| Target | Runs | Speed |
|--------|------|-------|
| `make test-api` | Kotlin units + Testcontainers ITs (real Postgres) | moderate |
| `make test-app` | Vitest: jsdom unit project **+ Storybook** (headless-chromium, via Vitest addon) | fast |
| `make e2e` | Real full-stack Playwright: `make infra` → `bootRun` → seed → 2 flows | slow |
| `make test` | `test-api` + `test-app` — everyday inner loop, **no full-stack e2e** | fast |
| Chromatic | Visual-regression diff of every story (CI-only, `.github/workflows/chromatic.yml`) | CI |

Chromatic is a **CI gate, not a local `make` target** — it renders every story on Chromatic's
infra and diffs pixels against the accepted baseline. It runs on PRs and `main`; see the
"Visual regression" section below and ADR-0017.

## Vitest / Storybook bright line

**Vitest (jsdom) owns only pure, non-rendering logic:** mappers, adapters, stores, utility functions. No component rendering, no RTL, no DOM assertions.

**Storybook owns everything that renders.** A component's states (empty/loading/data/error, disabled, variants) live as `.stories.tsx` files co-located with the component, and the Storybook Vitest addon runs them headlessly under `make test-app`.

This is the enforced split: if it renders, it belongs in a story, not a Vitest unit.

### Stories assert behaviour, not just render (prop-contract spies)

A story must prove *what the component did*, not only *what's on screen*. For every interactive
component, pass `fn()` spies (from `storybook/test`) as the callback props, drive the interaction
in `play`, and assert the callback fired:

```tsx
args: { onCreate: fn(), onRename: fn(), onDelete: fn() },
// …in play:
await userEvent.click(canvas.getByRole('button', { name: 'Add' }))
await expect(args.onCreate).toHaveBeenCalledWith('Middle Blocker')
```

This catches the "a Radix/Tailwind bump severed the wiring so the click no longer fires the
handler" class — which a `getByText` assertion cannot. **Hold the network line:** a spy proves the
component called its prop; it does *not* prove the request reached the server. Real API round-trips
stay in the e2e flows — do not reach for MSW in a story to assert HTTP.

`features/manage-positions/ui/ManagePositionsView.stories.tsx` is the reference exemplar.

### Container/View split — state shells live in the View

A `*View` is presentational and prop-only and **gets the story**; its container wires the query +
mutations and is thin wiring **covered by e2e** (the same seam class as the query hooks below).
Keep **loading/error shells in the View** as props-driven states (`isLoading` / `isError`), never
in the container — otherwise those states render only against a live query and no story can see
them. With the shells in the View, all four data states (loading / error / empty / data) are
stories with zero network. This is a convention, not a CI-enforced gate. See ADR-0017.

## Visual regression (Chromatic)

Behavioural coverage (the `play`/`expect` above) does not look at pixels. **Chromatic** owns that
layer: it renders every story on its own fixed infra and diffs against the accepted baseline, so a
Tailwind/Radix/shadcn bump that shifts spacing, a token, or a layout is caught even though no
`getByText` changed.

- **A visual delta blocks the merge; it is never auto-accepted.** The job runs
  `--exit-zero-on-changes`, so a diff does not fail the Actions job — instead Chromatic's
  **"UI Tests"** commit status stays unresolved until a human accepts/rejects in the Chromatic UI.
  That status, marked **required** in branch protection, is what gates Renovate automerge.
- **TurboSnap** (`--only-changed`) re-shoots only stories whose dependencies changed.
- **Setup lives outside this repo:** the Chromatic project, the `CHROMATIC_PROJECT_TOKEN` secret,
  and the required-check branch-protection rule are one-time manual steps. Until "UI Tests" is a
  required check, a visual delta will not actually block a merge.

See ADR-0017 for the full rationale and the Renovate-automerge policy this gate exists to serve.

### Sanctioned exception

Three render-gate tests use `msw/node` to render under controlled network conditions. They are the **only sanctioned exceptions** to the no-RTL rule; do not treat them as precedent.

- `app/src/app/providers/auth-gate.test.tsx`, `verify-flow.test.tsx` — the auth routing seam (fail-closed on network error, race between verify and /me) cannot be forced into a meaningful failure state against a real backend, and is not story-able (depends on React Router state and network interception beyond a story's reach).
- `app/src/app/providers/invite-flow.test.tsx` — the invite-acceptance seam: the invite token is carried across two separate router mounts (`/invite/:token`, then `/auth/verify` on link-click) via `localStorage`, and the fail-closed accept ordering needs a valid magic-link token paired with a simultaneously-expired invite — unforceable against a real backend, and a single story can't mount two routes to assert the redirect. The pure email-match gate under the carry lives at the Vitest-unit layer (`shared/api/invitations.test.ts`); only the cross-mount seam stays as RTL.

See CLAUDE.md for the full justification and the bar a fourth exception would have to clear.

## What is deliberately not tested

The following are not covered, and that is intentional:

- **`shared/api/*` TanStack Query hooks** — thin wrappers over Wirespec-generated calls; the seam they exercise (HTTP → server) is covered by e2e.
- **`shared/ui/*` shadcn primitives** — third-party components with their own test suites; wrapping them in stories adds no signal.
- **`shared/lib/utils.cn`** — a one-liner re-export of clsx + tailwind-merge; trivial.

## How to run each layer

```bash
# Backend
make test-api                   # all backend tests (Kotlin units + Testcontainers ITs)

# Frontend (fast)
make test-app                   # Vitest unit project + Storybook stories (headless)

# Real full-stack e2e
make infra                      # ensure Postgres + Redis are up
make e2e                        # boots backend, runs Playwright, kills backend

# Fast inner loop (no e2e)
make test                       # test-api + test-app
```

## Real e2e internals

**Entry point:** `app/e2e-real/` + `playwright.real.config.ts`. `make e2e` runs `scripts/e2e.sh`, which:
1. Reuses whatever is listening on :5432/:6379 (CI service containers) or docker-compose ups them.
2. Boots `bootRun --spring.profiles.active=e2e` and health-gates on `/internal/actuator/health`.
3. Runs Playwright, then kills the backend by port (the bootRun JVM is a daemon child, not the gradlew pid).

**`e2e` Spring profile:** `E2eEnvironmentInitializer` (ApplicationRunner, after Flyway) provisions the `team_test` tenant schema and runs a pure-INSERT idempotent `db/e2e/seed.sql` (one user: `e2e@example.com`). The `/internal/e2e/magic-link-token` endpoint returns the plaintext token recorded by `RecordingEmailAdapter` (@Primary @Profile("e2e")).

**Flows covered:** login (magic-link → verify → `/events`) + change-attendance (authed via `storageState` → open event → toggle → assert persisted transition). These two flows exercise browser→API→DB, auth handshake + session cookie, tenant-schema resolution, and a mutation round-trip.

## Gotchas

### Token race (single-seeded user)

The magic-link token recorder is last-write-wins per email (`ConcurrentHashMap<email, token>`), and the seed has one user (`e2e@example.com`). Two concurrent in-test logins for that email (login spec + a logout spec on different Playwright workers) race — one consumes the other's token.

**Fix:** mint session-mutating specs' sessions in the **serial setup phase** (`auth.setup.ts`) as separate `storageState` files (`user.json` shared, `logout-user.json` disposable), not via in-test fresh logins. Each setup creates an independent server-side session, so logging out the disposable one never kills the shared session the attendance spec reuses.

### CI timeout on auth render-gate tests

The auth render-gate jsdom tests (`verify-flow`, `auth-gate`) flake in CI at RTL's default 1000ms `findBy`/`waitFor` timeout — the "lands on events" chain (10ms verify delay → cache write → redirect → events route mount) can exceed 1000ms on a loaded runner. Pass explicit `{ timeout: 5000 }` to router/render assertions in these tests. Do not rely on the 1000ms default for any `msw/node` router-render assertion.

### Colima env for Testcontainers

`make test-api` runs Testcontainers (real Postgres). On this machine, Colima manages Docker. The pre-commit hook runs `make test-api` unconditionally, so the Colima env must be active:

```
DOCKER_HOST=unix:///Users/<you>/.colima/default/docker.sock
TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
TESTCONTAINERS_RYUK_DISABLED=true
```

`make e2e` also needs Docker up (`docker info`) and ports 5432/6379/8080 free.

### Fresh-worktree setup

When working in a git worktree, two extra steps are required before the pre-commit gate will pass:

```bash
npm ci --prefix <worktree>/app                              # node_modules are not shared
./gradlew -p <worktree> :api:wirespec-typescript            # generated TS client is gitignored
```
