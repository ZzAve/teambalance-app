# ADR-0010: Use in-memory servlet sessions for 1.0; defer Redis-backed sessions

- Status: Accepted
- Date: 2026-07-01
- Amends: ADR-0008 (which specified server-side sessions via Spring Session + Redis)

## Context

ADR-0008 chose session-based auth backed by **Spring Session + Redis**. In practice, the
1.0 magic-link backend establishes sessions via the servlet container's in-memory
`HttpSession` (a `JSESSIONID` cookie); Spring Session / Redis is not yet wired. Redis is
provisioned in local infra but is not used as the session store.

For 1.0 — a single backend instance serving a handful of volleyball teams — in-memory
sessions are sufficient:

- One app instance, so there is no session state to share across nodes.
- The trust-based, low-traffic ethos (ADR-0001) tolerates sessions being dropped on a
  deploy/restart: a user simply requests a fresh magic link.

## Decision

**For 1.0, sessions are the servlet container's in-memory `HttpSession` (`JSESSIONID`).**
Redis-backed Spring Session (per ADR-0008) is **deferred to a post-1.0 follow-up**.

The `spring.session.store-type: redis` setting is aspirational until the Spring Session
dependency and wiring land; it currently has no effect.

## Consequences

- Sessions do not survive an app restart/redeploy and do not scale horizontally
  (no multi-instance session sharing). Acceptable at 1.0's single-instance scale.
- When zero-downtime deploys or more than one instance are needed, revisit: add
  `spring-session-data-redis`, confirm the `SESSION` cookie replaces `JSESSIONID`, and back
  sessions with the already-provisioned Redis — restoring ADR-0008's original intent.
- Tracked as a post-1.0 follow-up (GitHub issue).
