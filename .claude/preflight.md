# preflight — project notes
test: npm --prefix app test (=vitest run) + ./gradlew :api:test   # api tests need colima env (see docs/testcontainers-colima)
# macOS: no JAVA_HOME override needed (gradle toolchain=25 in gradle.properties, default java is 25); the JDK-21/linux path in progress.txt is sandbox-only
# in a worktree, results live in <worktree>/api/build/test-results — read those, not the main repo's build dir
setup: npm --prefix app install && ./gradlew :api:wirespec-typescript  # generated TS client must exist before typecheck/build

## review scope
- PRs are squash-merged; local `main` diverges from origin/main → diff-base.sh mis-scopes. Scope the review to `origin/main..HEAD`, and rebase feature branches with `rebase --onto origin/main <last-already-merged-commit>` (expect "patch already upstream" drops).
- Never resolve a rebase with `-X ours` blindly: it silently dropped `findRole` a feature needed when a port addition conflicted with a differently-implemented upstream version. Resolve port/interface conflicts as a union by hand.

## wirespec client
- Stale gen across branches: switching to a branch with a different `.ws` set leaves orphaned files in `app/src/shared/api/generated/` → `tsc`/build fails on a missing export (e.g. CreateInvitation → removed Invitation model). `rm -rf app/src/shared/api/generated api/build/generated` then re-run `:api:wirespec-typescript` before frontend build.
- mutationFns must unwrap res.body (return `res.body`, not the raw `api.*()` call) — caller mutation.data is the body, not the Wirespec envelope
- Generated from() throws `Cannot internalize response with status: N` for undeclared status codes → React Query error state; no extra guard needed in queryFn for non-declared codes

## auth / session (frontend)
- MSW mock session state (shared/mocks/handlers.ts) must type against the generated `AuthenticatedUser` (from shared/api/auth.ts), not a hand-rolled inline literal — avoids silent drift if wirespec regenerates the contract.
- Session-clearing mutations (logout) must write the `['auth','me']` query cache synchronously via `queryClient.setQueryData(['auth','me'], null)`, not `invalidateQueries` — invalidate triggers an async background refetch, leaving a window where AuthGuard reads stale cached (still-authenticated) data. verify.tsx's login path already uses the synchronous `setQueryData` pattern; mirror it for logout too.

## config / profiles
- A new required `@Value` with no default (fail-fast) must be supplied in EVERY non-prod profile: application-dev.yml, test (application-test.yml), AND application-e2e.yml. CI's `scripts/e2e.sh` boots bootRun under the `e2e` profile, so a missing key there fails CI even when `:api:test` (test profile) is green. Prod relies solely on the env var.

## multitenancy / hexagonal
- SessionTenantContextFilter must NOT inject TeamMemberRepository (domain port) — schema name is infra; inject SpringDataTeamMemberRepository directly — SessionTenantContextFilter.kt
- Filter reads UserContext.get() (set by SessionUserContextFilter at order +2); no session re-read needed — avoids duplicate UUID parse + impossible IllegalArgumentException catch
- Tenant schema routing IS wired (Hibernate CurrentTenantIdentifierResolver + MultiTenantConnectionProvider, since #49) and fails closed to a non-existent schema if TenantContext is unresolved — no silent `public` fallback.

## html
- EventCard renders location as `<a>` nested inside the outer `<Link>` `<a>` — invalid HTML; console error in Playwright run; pre-existing, tracked separately
