# TeamBalance

Sports team management app — event attendance + shared money pool (Bunq integration).
Serving volleyball teams. Currently rebuilding from scratch as a clean-slate rewrite.

## Architecture

Gradle 9.4 monorepo with four modules:

| Module | Tech | Purpose |
|--------|------|---------|
| `api/` | Kotlin 2.3, Spring Boot 4, Hibernate/JPA, Flyway | Backend REST API (hexagonal DDD) |
| `app/` | Vite 6, React 19, TypeScript 5, Tailwind 4, Shadcn | SPA at app.teambalance.nl |
| `www/` | Plain HTML + shared tokens | Landing page at teambalance.nl |
| `design-tokens/` | CSS custom properties + Tailwind preset | Shared visual identity |

API contracts defined in Wirespec (`api/src/main/wirespec/`) — generates Kotlin + TypeScript.

## Backend structure (hexagonal DDD)

```
api/src/main/kotlin/app/teambalance/
  domain/          # Entities, value objects, domain events — no framework deps
  application/     # Use cases (orchestration), port interfaces
  infrastructure/  # Adapters: JPA repos, Bunq client, external services
  interfaces/      # REST controllers, DTOs, mappers
```

## Frontend structure (Feature-Sliced Design)

```
app/src/
  app/        # Providers, routing, global styles
  pages/      # Route-level components
  widgets/    # Composite UI blocks
  features/   # User interactions (attendance toggle, top-up)
  entities/   # Domain models (event, member, transaction)
  shared/     # UI kit, API client, utilities
```

## Common commands

```bash
make build          # Build everything (default target)
make db             # Start PostgreSQL only
make infra          # Start all infra (Postgres + Redis)
make api            # Run backend (port 8080)
make app            # Run frontend dev server (port 5173)
make run-local      # Start infra + backend + frontend
make test           # Fast inner loop: test-api + test-app (no full-stack e2e)
make test-api       # Backend tests only
make test-app       # Frontend tests only (Vitest: units + Storybook stories)
make e2e            # Real full-stack Playwright suite (requires infra + port 8080 free)
make lint           # Lint everything (detekt + ESLint)
make format         # Auto-format code
make wirespec       # Regenerate API contracts from .wirespec files
make yolo           # Fast build, skip tests and linting
make clean          # Clean build artifacts
make update         # Check for dependency updates
make help           # Show all targets
```

## Multitenancy

- `public` schema: users, teams, team_members, invitations (platform-wide)
- Per-team tenant schemas: events, attendances, transactions, etc.
- Tenant resolved from authenticated user's team context

## Key conventions

- **Wirespec first**: API changes start in `.wirespec` files, then generate code. Never hand-edit generated files.
- **No mocks for DB tests**: Use Testcontainers with real Postgres.
- **Semantic attendance colors**: green=attending, gold=maybe, red=absent (defined in `design-tokens/tokens.css`).
- **Fonts**: Grandstander (display only — wordmark, titles, stats), DM Sans (everything else).
- **Guardrails**: ArchUnit enforces hexagonal boundaries, detekt 2.0 for Kotlin style, eslint-plugin-boundaries for FSD layers.

## Plans

Implementation plans live in `docs/plans/`. Each plan tracks its own status and deviations.

## Git workflow

- Branch per feature/phase, PR to `main`
- Commit messages: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
- Don't commit docs/plan files unless explicitly asked

## Feedback loops

Changes should follow a TDD process.

Manual verification should always be done after every change, ensuring that the intent is met, the system remains stable and
free of regressions. Self-verification is encouraged by spinning up the application locally and interacting with it,
either through its endpoint, or through the UI. 

Every change made must deliver proof that it delivers the intended value and does not introduce regression.

## Testing

Four honest layers — place each new test at the **lowest layer that proves it**:

| Layer | Command | What it covers |
|-------|---------|----------------|
| Backend unit / IT | `make test-api` | Kotlin units + Testcontainers integration tests |
| Frontend pure logic | `make test-app` | Vitest (jsdom): mappers, adapters, stores |
| Component states | `make test-app` | Vitest + Storybook addon (headless): empty/loading/data/error stories |
| Real e2e | `make e2e` | Full-stack Playwright: login flow + change-attendance flow |

`make test` = `test-api` + `test-app` — the fast everyday inner loop. Full-stack e2e is excluded; run `make e2e` explicitly.

### PR gate

> **When adding or changing a feature, place its coverage at the lowest layer that proves it:**
> - Component states (empty/loading/data/error) → a Storybook story.
> - Pure logic (mappers, adapters, stores) → a Vitest unit.
> - Backend behaviour → a Kotest unit or Testcontainers IT.
> - **A new e2e is justified *only* if the change introduces a seam not already exercised by the login or attendance flows** (new auth path, new cross-tenant write, new external integration). If it does, add one flow. If it doesn't, say so in the PR.

### Sanctioned MSW/RTL exception

The two auth render-gate Vitest tests (`app/src/app/providers/auth-gate.test.tsx`, `verify-flow.test.tsx`) use `msw/node` to render the auth provider under controlled network conditions. They are the **single sanctioned exception** to the "Vitest owns only pure non-rendering logic" rule: the auth routing seam (fail-closed on error, verify-vs-/me race) cannot be forced into a meaningful failure state against a real backend, and it is not story-able. Do not remove them or use them as precedent for new RTL render tests.

See [`docs/testing.md`](docs/testing.md) for command mechanics, the Vitest/Storybook bright line, and real-e2e gotchas.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`ZzAve/teambalance-app`) via the `gh` CLI; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
