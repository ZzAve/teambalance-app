# Testing

Reference for the four-layer test pyramid. See `CLAUDE.md § Testing` for the PR gate and taxonomy rules.

## Command surface

| Target | Runs | Speed |
|--------|------|-------|
| `make test-api` | Kotlin units + Testcontainers ITs (real Postgres) | moderate |
| `make test-app` | Vitest: jsdom unit project **+ Storybook** (headless-chromium, via Vitest addon) | fast |
| `make e2e` | Real full-stack Playwright: `make infra` → `bootRun` → seed → 2 flows | slow |
| `make test` | `test-api` + `test-app` — everyday inner loop, **no full-stack e2e** | fast |

## Vitest / Storybook bright line

**Vitest (jsdom) owns only pure, non-rendering logic:** mappers, adapters, stores, utility functions. No component rendering, no RTL, no DOM assertions.

**Storybook owns everything that renders.** A component's states (empty/loading/data/error, disabled, variants) live as `.stories.tsx` files co-located with the component, and the Storybook Vitest addon runs them headlessly under `make test-app`.

This is the enforced split: if it renders, it belongs in a story, not a Vitest unit.

### Sanctioned exception

The two auth render-gate tests (`app/src/app/providers/auth-gate.test.tsx`, `verify-flow.test.tsx`) use `msw/node` to render the auth provider under controlled 500/204 network conditions. The auth routing seam — fail-closed on network error, race between verify and /me — cannot be forced into a meaningful failure state against a real backend, and it is not story-able (depends on React Router state and network interception beyond a story's reach). These are the **single sanctioned exception** to the no-RTL rule. Do not treat them as precedent.

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

**`e2e` Spring profile:** `E2eEnvironmentInitializer` (ApplicationRunner, after Flyway) provisions the `team_test` tenant schema and runs a pure-INSERT idempotent `db/e2e/seed.sql` (one user: `e2e@example.com`). The `/internal/e2e/magic-link-token` endpoint returns the plaintext token recorded by `RecordingEmailSender` (@Primary @Profile("e2e")).

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
