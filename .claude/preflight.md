# preflight — project notes
test: npm --prefix app test   # Playwright e2e; API tests run via ./gradlew :api:test
setup: npm --prefix app install && ./gradlew :api:wirespec-typescript  # generated TS client must exist before typecheck/build

## wirespec client
- mutationFns must unwrap res.body (return `res.body`, not the raw `api.*()` call) — caller mutation.data is the body, not the Wirespec envelope
- Generated from() throws `Cannot internalize response with status: N` for undeclared status codes → React Query error state; no extra guard needed in queryFn for non-declared codes
- MSW mocks intentionally carry role ahead of generated types (progress.txt notes which issue re-adds it to the contract)

## multitenancy / hexagonal
- SessionTenantContextFilter must NOT inject TeamMemberRepository (domain port) — schema name is infra; inject SpringDataTeamMemberRepository directly — SessionTenantContextFilter.kt
- Filter reads UserContext.get() (set by SessionUserContextFilter at order +2); no session re-read needed — avoids duplicate UUID parse + impossible IllegalArgumentException catch
- TenantContext is resolved but NOT consumed (no Hibernate multi-tenant wiring; hibernate.default_schema=public) — the ThreadLocal is a placeholder until a CurrentTenantIdentifierResolver or guard filter is wired (blocker for real tenant isolation)

## html
- EventCard renders location as `<a>` nested inside the outer `<Link>` `<a>` — invalid HTML; console error in Playwright run; pre-existing, tracked separately
