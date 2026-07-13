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
- MSW mocks intentionally carry role ahead of generated types (progress.txt notes which issue re-adds it to the contract)

## config / profiles
- A new required `@Value` with no default (fail-fast) must be supplied in EVERY non-prod profile: application-dev.yml, test (application-test.yml), AND application-e2e.yml. CI's `scripts/e2e.sh` boots bootRun under the `e2e` profile, so a missing key there fails CI even when `:api:test` (test profile) is green. Prod relies solely on the env var.

## multitenancy / hexagonal
- SessionTenantContextFilter must NOT inject TeamMemberRepository (domain port) — schema name is infra; inject SpringDataTeamMemberRepository directly — SessionTenantContextFilter.kt
- Filter reads UserContext.get() (set by SessionUserContextFilter at order +2); no session re-read needed — avoids duplicate UUID parse + impossible IllegalArgumentException catch
- TenantContext is resolved but NOT consumed (no Hibernate multi-tenant wiring; hibernate.default_schema=public) — the ThreadLocal is a placeholder until a CurrentTenantIdentifierResolver or guard filter is wired (blocker for real tenant isolation)

## html
- EventCard renders location as `<a>` nested inside the outer `<Link>` `<a>` — invalid HTML; console error in Playwright run; pre-existing, tracked separately
