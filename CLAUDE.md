# TeamBalance

Sports team management app — event attendance + shared money pool (Bunq integration).
Serving volleyball teams. Currently rebuilding from scratch as a clean-slate rewrite.

## Architecture

Gradle 9.4 monorepo with four modules:

| Module | Tech | Purpose |
|--------|------|---------|
| `api/` | Kotlin 2.3, Spring Boot 4, Hibernate/JPA, Flyway | Backend REST API (hexagonal DDD) |
| `app/` | Vite 6, React 19, TypeScript 5, Tailwind 4, Shadcn | SPA at app.teambalance.app |
| `www/` | Plain HTML + shared tokens | Landing page at teambalance.app |
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
make test           # Run all tests
make test-api       # Backend tests only
make test-app       # Frontend tests only
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
