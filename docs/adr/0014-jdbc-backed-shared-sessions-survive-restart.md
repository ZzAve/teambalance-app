# ADR-0014: JDBC-backed shared sessions (Postgres) so logins survive a restart

- Status: Accepted
- Date: 2026-07-26
- Supersedes: ADR-0010 (in-memory servlet sessions; defer shared sessions to post-1.0)
- See also: ADR-0008 (server-side sessions), ADR-0012 (Spring Security harness — not yet implemented)

## Context

ADR-0010 deferred a shared session store: 1.0 used the servlet container's in-memory
`HttpSession` (`JSESSIONID`), on the premise of a single always-on instance where dropping
sessions on a deploy was tolerable.

That premise no longer holds. The API runs on a Scaleway Serverless Container with
**min-instances = 0**. Every cold start (scale-from-zero after idle), every redeploy, and any
scale beyond one instance starts a fresh JVM with an empty heap-resident session table. The
authenticated principal lives only as a `USER_ID` attribute on an in-heap Tomcat `HttpSession`,
so **every new pod boot silently logs every user out** — they must request a fresh magic link.
This is routine on scale-to-zero, not a rare deploy event.

ADR-0010 itself named the exit condition ("when zero-downtime deploys or more than one instance
are needed, revisit") and pointed at Redis. Between Redis and JDBC:

- **Redis** needs a managed instance kept warm even while the container is scaled to zero —
  ongoing cost and an extra always-on dependency, which works against the scale-to-zero posture.
- **JDBC (Postgres)** reuses the database the app always has. Nothing extra to keep warm; it is
  the natural fit for a service designed to idle at zero. Session I/O load is negligible at this
  scale.

## Decision

**Store sessions in Postgres via Spring Session JDBC.** Concretely:

- Depend on `spring-boot-starter-session-jdbc`. Boot 4 moved session auto-configuration out of
  `spring-boot-autoconfigure` into a dedicated module, so the raw `spring-session-jdbc` library is
  **not** auto-wired; the starter pulls both the library and the auto-config that registers the
  session repository filter.
- Flyway owns the `SPRING_SESSION` / `SPRING_SESSION_ATTRIBUTES` DDL (`db/migration/V005`, in the
  platform `public` schema); `spring.session.jdbc.initialize-schema: never`.
- Queries are schema-qualified (`spring.session.jdbc.table-name: public.SPRING_SESSION`) so they
  resolve to `public` regardless of the tenant `search_path` the multitenancy connection provider
  may leave on a pooled connection.
- Spring Session's repository filter is forced to the front (`spring.session.servlet.filter-order:
  Integer.MIN_VALUE`) so it wraps the request before `SessionUserContextFilter`
  (`HIGHEST_PRECEDENCE+2`) and `SessionTenantContextFilter` (`+3`) call `request.getSession()`.
- The cookie name is Spring Session's default `SESSION` (ADR-0010 anticipated exactly this: "confirm
  the `SESSION` cookie replaces `JSESSIONID`"). The name is opaque to the SPA — it sends the cookie
  via `credentials: 'include'`, and the browser/Playwright cookie jars are name-agnostic — so no
  cookie-name override is needed. The prod `secure` + `SameSite=Lax` flags (application-prod.yml)
  still apply to the `SESSION` cookie.

## Consequences

- **Logins survive a restart / cold start / redeploy, and are shared across instances.** Verified
  end-to-end: log in, restart the process (new JVM, empty heap), `/auth/me` with the same cookie
  still returns 200 with no fresh magic link; a session row lives in `public.SPRING_SESSION` and its
  `userId` in `SPRING_SESSION_ATTRIBUTES`; logout deletes the row.
- Redis is **not** used for sessions (ADR-0008's original Redis intent is not restored). Redis
  remains only a health-indicator concern in prod.
- Interaction with ADR-0012 (Spring Security, not yet implemented): its assumption of an in-memory
  `HttpSession` is now a JDBC-backed one. Spring Security integrates with Spring Session — session
  fixation (`changeSessionId`) is supported by the JDBC store — so the planned harness still applies;
  update ADR-0012's "in-memory" wording when that work lands.
- Session attributes are JDK-serialized into `ATTRIBUTE_BYTES`. Today's attributes (`userId`,
  tenant schema, tenant team id) are all `String`s; any future non-`Serializable` attribute would
  need attention.
- Tests thread the session by reading the emitted cookie generically (`response.cookies.first()`),
  not via `MockHttpSession`/`.session()` — Spring Session carries identity by cookie and ignores a
  mock session. The prod cookie hardening (`secure` + `SameSite=Lax`) is covered by
  `ProdProfileSmokeIT` reading `ServerProperties`.
