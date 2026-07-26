# ADR-0015: Session lifetime — long sliding idle (4 weeks) + absolute cap (3 months)

- Status: Accepted
- Date: 2026-07-26
- Builds on: ADR-0014 (JDBC-backed sessions), ADR-0008 (session-based auth)
- See also: ADR-0012 (Spring Security — session fixation, not yet implemented)

## Context

ADR-0014 made sessions durable (Postgres-backed, survive a restart). This ADR sets *how long*
a login lasts. Logging in is a magic-link email round-trip — enough friction that users
experience it as a hassle — so the product goal is to **stay logged in for a long time** and
re-authenticate rarely, while still bounding how long any single login (and therefore a leaked
session cookie) remains usable.

Spring Session natively provides only a **sliding idle timeout** (`MAX_INACTIVE_INTERVAL`,
refreshed on every request). It has **no absolute/maximum-lifetime** concept, and the session
cookie is a browser-session cookie (cleared when the browser closes) unless a max-age is set.

## Decision

Three settings, layered:

1. **Sliding idle timeout — 4 weeks.** `server.servlet.session.timeout: 28d`. A session stays
   valid as long as it is used at least once every 4 weeks; each request slides the window.
   Native Spring Session.

2. **Persistent cookie — 90 days.** `server.servlet.session.cookie.max-age: 90d`. Without this the
   cookie is dropped on browser close, forcing re-login for no security gain. Set to the absolute
   cap so the cookie never expires *before* the server-side session could. Native (Spring Boot maps
   `server.servlet.session.cookie.*` onto Spring Session's cookie serializer). Cookie stays
   `HttpOnly` + prod `Secure`/`SameSite=Lax` (ADR-0014).

3. **Absolute lifetime cap — 3 months.** Enforced by `SessionUserContextFilter` (not Spring
   Session, which cannot do it): if `now − session.creationTime > teambalance.session.absolute-timeout`
   (default `90d`), the filter invalidates the session and the request is unauthenticated, forcing a
   fresh magic-link login. This caps a *continuously active* session and bounds the useful life of a
   stolen cookie.

Effective session end = **min(28 days since last use, 90 days since login)**.

**Device fingerprinting: considered and deferred.** Binding a session to IP/User-Agent is not a
Spring default, is brittle for the mobile/roaming users this app serves (IP rotation would force the
very re-logins we are trying to avoid), and offers weak protection against a determined attacker. The
proportionate, established controls are used instead: `HttpOnly` + `Secure` + `SameSite=Lax` cookies,
the absolute cap above, server-side invalidation on logout, and — when ADR-0012 lands — session-ID
rotation on login (session-fixation protection). Revisit only if a concrete threat warrants it.

## Consequences

- Users stay logged in across browser restarts for weeks; a fresh login is needed only after 4 weeks
  of inactivity or 3 months since the last login, whichever comes first.
- The absolute cap is ~10 lines of app code (a `Clock` + a `Duration` in `SessionUserContextFilter`),
  unit-tested via an injected clock. It is the one piece that is not framework-native — a deliberate,
  small deviation because no Spring mechanism provides an absolute session lifetime.
- Interaction with ADR-0012: session-fixation rotation creates a new session (new `creationTime`),
  which resets the absolute clock — expected and acceptable, since rotation happens only at login.
- **Expired-row cleanup vs scale-to-zero is a non-issue.** Spring Session's `@Scheduled` cleanup job
  only runs while the container is up, so at `min-instances = 0` it pauses when scaled to zero and
  resumes on the next cold start. This does not affect correctness or security: an expired session is
  rejected at *read* time (`JdbcIndexedSessionRepository` returns null and deletes it), independent of
  the cleanup job. The job only reclaims table space, which is negligible at this scale. Left at the
  default cadence; no external scheduler is warranted.
- Larger `MAX_INACTIVE_INTERVAL` (28d = 2,419,200s) and a 90-day cookie mean a session row and its
  cookie live longer; storage impact is trivial for the current audience.
