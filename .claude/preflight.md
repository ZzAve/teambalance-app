# preflight — project notes
test: npm --prefix app test (=vitest run) + ./gradlew :api:test   # api tests need colima env (see docs/testcontainers-colima)
# macOS: no JAVA_HOME override needed (gradle toolchain=25 in gradle.properties, default java is 25); the JDK-21/linux path in progress.txt is sandbox-only
# in a worktree, results live in <worktree>/api/build/test-results — read those, not the main repo's build dir
setup: npm --prefix app install && ./gradlew :api:wirespec-typescript  # generated TS client must exist before typecheck/build

## review scope
- PRs are squash-merged; local `main` diverges from origin/main → diff-base.sh mis-scopes. Scope the review to `origin/main..HEAD`, and rebase feature branches with `rebase --onto origin/main <last-already-merged-commit>` (expect "patch already upstream" drops).
- Never resolve a rebase with `-X ours` blindly: it silently dropped `findRole` a feature needed when a port addition conflicted with a differently-implemented upstream version. Resolve port/interface conflicts as a union by hand.

## wirespec client
- Stale gen across branches: switching to a branch with a different `.ws` set leaves orphaned files in `app/src/shared/api/generated/` → `tsc`/build fails on a missing export (e.g. CreateInvitation → removed Invitation model). `rm -rf app/src/shared/api/generated api/build/generated app/.tsbuild app/tsconfig.tsbuildinfo` then re-run `:api:wirespec-typescript` — `tsconfig.generated.json` is a composite project, so without clearing its buildinfo `tsc` keeps reporting the OLD generated types as missing properties.
- mutationFns must unwrap res.body (return `res.body`, not the raw `api.*()` call) — caller mutation.data is the body, not the Wirespec envelope
- Generated from() throws `Cannot internalize response with status: N` for undeclared status codes → React Query error state; no extra guard needed in queryFn for non-declared codes

## auth / session (frontend)
- MSW mock session state (shared/mocks/handlers.ts) must type against the generated `AuthenticatedUser` (from shared/api/auth.ts), not a hand-rolled inline literal — avoids silent drift if wirespec regenerates the contract.
- Session-clearing mutations (logout) must write the `['auth','me']` query cache synchronously via `queryClient.setQueryData(['auth','me'], null)`, not `invalidateQueries` — invalidate triggers an async refetch, and the root guard's `ensureQueryData` would then re-hit the network instead of reading the synchronously-cleared null. verify.tsx's login path uses the same synchronous `setQueryData`; mirror it.
- Route protection is a TRUE gate in the root route's `beforeLoad` (__root.tsx): `ensureQueryData(authMeQueryOptions)` runs before a protected route loads, so the component never mounts / fetches until the session is confirmed; a 401 (null) OR any /me error fails closed to `/login`. Don't reintroduce a component-render gate (conditionally rendering `<Outlet/>`) — it leaks: on the redirect the Outlet briefly re-mounts the stale route match and fires its data fetch. The shared `queryClient` (shared/api/query-client.ts) MUST be the one instance the React tree uses, or the guard primes a cache useAuthMe never reads.
- MSW auth (shared/mocks/handlers.ts) boots UNAUTHENTICATED and persists the session in `sessionStorage` (survives reloads like a cookie) — so e2e must `login()` (e2e/helpers.ts: verify `valid-token`) before hitting a protected route, then can hard-navigate freely. One `MOCK_USER` (non-roster id `1111…`, ADMIN) backs both verify and /me — non-roster so it isn't pulled out of any event's attendee list ($eventId.tsx splits current-user out).

## config / profiles
- A new required `@Value` with no default (fail-fast) must be supplied in EVERY non-prod profile: application-dev.yml, test (application-test.yml), AND application-e2e.yml. CI's `scripts/e2e.sh` boots bootRun under the `e2e` profile, so a missing key there fails CI even when `:api:test` (test profile) is green. Prod relies solely on the env var. EXCEPTION: if the reading bean is `@Profile("prod")`-gated (e.g. ScalewayTemEmailAdapter), its `@Value` is never read outside prod → leave the key defaultless and add nothing to non-prod profiles.

## backend / transactions
- `make test` does NOT run `:api:processAot`; `make ci` (`./gradlew build -x test`) does. Spring Data AOT binds `:named` query params against the method signature, so an orphaned `@Query`/`@Modifying` left above the wrong method fails CI only — 'No bindable parameter with name X'. Run `./gradlew build -x test` before pushing.
- `@Transactional` lives on the JPA adapter methods, NOT the service. A service method composing >1 write (e.g. bulk-update then save) is therefore NOT atomic unless it carries its own `@Transactional` — check any multi-step orchestration (InvitationService.rotateInviteLink). Pair a `@Modifying` bulk update with `clearAutomatically = true` so a same-tx read after it isn't stale.

## multitenancy / hexagonal
- SessionTenantContextFilter must NOT inject TeamMemberRepository (domain port) — schema name is infra; inject SpringDataTeamMemberRepository directly — SessionTenantContextFilter.kt
- Filter reads UserContext.get() (set by SessionUserContextFilter at order +2); no session re-read needed — avoids duplicate UUID parse + impossible IllegalArgumentException catch
- Tenant schema routing IS wired (Hibernate CurrentTenantIdentifierResolver + MultiTenantConnectionProvider, since #49) and fails closed to a non-existent schema if TenantContext is unresolved — no silent `public` fallback.

## local IT runner (no Docker here)
- `local-it.sh` starts its OWN postgres (`/var/lib/postgresql/tbdata`, socket `/tmp`). NEVER run
  `service postgresql start` — the system cluster grabs 5432 first, the script's `pg_isready` check
  passes, and it then dies on `psql: Password for user postgres`.
- That failure is SILENT in the summary: the script does not clear `api/build/test-results`, so a
  dead run leaves the previous branch's XML in place and the count read back belongs to another
  branch. `rm -rf api/build/test-results` before every run and assert the expected new spec appears.
- It patches `TeamBalanceIT.kt` to localhost JDBC for the duration and reverts on `trap EXIT` —
  never commit that diff, and don't fight the stop-hook over it while a run is in flight.

## flaky tests
- `app/src/app/providers/invite-flow.test.tsx` fails intermittently under the FULL vitest run (waitFor for '/events'/'Events' heading times out) but passes in isolation (`vitest run invite-flow`) — full-suite concurrency flake, not a regression. Re-run isolated to confirm before chasing.

## html
- EventCard renders location as `<a>` nested inside the outer `<Link>` `<a>` — invalid HTML; console error in Playwright run; pre-existing, tracked separately

## outbound http (adapters)
- Outbound REST = Spring `RestClient` (from starter-web, blocking on virtual threads — not WebClient/webflux); timeouts via global `spring.http.client.{connect,read}-timeout`. Unit-test the adapter with `MockRestServiceServer.bindTo(RestClient.builder())` and pass `@Value`s as plain ctor args — ScalewayTemEmailAdapter.kt / ScalewayTemEmailAdapterTest.kt.
- Jackson snake_case for external payloads: annotate with `com.fasterxml.jackson.annotation.JsonProperty` — works under both the Jackson 2 (Boot default) and Jackson 3 (wirespec) modules on the classpath — TemSendEmailRequest.kt (`project_id`).
