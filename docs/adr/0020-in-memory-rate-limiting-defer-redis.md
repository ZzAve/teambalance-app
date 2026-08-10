# ADR-0020: In-memory per-instance rate limiting; defer a shared (Redis) store

- Status: Accepted
- Date: 2026-08-10
- Relates to: #200 (rate limiting on invitation & auth endpoints); ADR-0010 / ADR-0014 (session store)

## Context

The onboarding-fork security audit (#200) found the app has **no rate limiting**: the
magic-link request/verify endpoints and `POST /api/invitations/{token}/accept` accept
unlimited attempts. It is not a live exploit today — invite tokens are 256-bit `SecureRandom`
and `accept` is auth-gated — so this is defense-in-depth, to add before token entropy is the
only thing standing in the way.

The issue floated a **Redis-backed token bucket** (bucket4j) as "the natural fit, Redis is
already in the infra", and also listed "a lightweight servlet filter" as a candidate.

Two facts about this codebase point away from Redis:

- **Redis is deliberately un-wired.** ADR-0010 chose in-memory sessions over Redis; ADR-0014
  then backed sessions with **Postgres (JDBC)**, not Redis. The startup-time-optimization work
  went further and **removed `spring-boot-starter-data-redis` / `spring-session-data-redis`
  outright** as cold-start dead weight ("Found 0 Redis repository interfaces", multiple-modules
  strict-mode tax). Re-adding a hard Redis dependency would reverse a deliberate optimization on
  the scale-to-zero Serverless Container, where every dependency is paid at cold start.
  (The `redis` service in `docker-compose.yml` and the Testcontainers Redis in `TeamBalanceIT`
  are leftovers from that earlier plan; nothing in `main` connects to them.)
- **Scale is tiny and single-instance-typical.** A handful of volleyball teams on a
  min-instances=0 container. Per-instance limits are effective here; the effective ceiling only
  loosens by a factor of the (usually 1) live instance count.

## Decision

Implement rate limiting as a **lightweight in-memory servlet filter** — the issue's second
candidate — not a Redis-backed store.

- `RateLimitFilter` (order `HIGHEST_PRECEDENCE + 4`, just after the session→user filter) throttles
  `magic-link/request` and `magic-link/verify` **per client IP**, and `invitations/{token}/accept`
  **per authenticated user** (falling back to IP). Rejections get `429` + `Retry-After` and the
  app's standard `{"error","code":"rate_limited"}` body.
- Storage is a hand-rolled `TokenBucket` kept in a **Caffeine** cache (already a dependency),
  bounded and self-evicting; the injected `Clock` is the single time source, so the algorithm is
  deterministically unit-testable.
- Limits live in `teambalance.rate-limit.*` (`RateLimitProperties`), tunable per environment, with
  a master `enabled` switch and a `trust-forwarded-for` flag (prod reads the client IP from
  `X-Forwarded-For`, set by Scaleway's edge).

## Consequences

- **Zero new runtime infra / dependencies**; no cold-start regression — consistent with ADR-0010/0014.
- Limits are **per instance**: with N live instances the effective ceiling is N× the configured
  value. Acceptable at current scale for a defense-in-depth control.
- Buckets are **not shared across instances and reset on restart** (an attacker's counter resets on
  a redeploy/scale event). Also acceptable here — the same trade-off ADR-0010 accepted for sessions.
- **Per-IP limits are coarse**: `X-Forwarded-For` is caller-spoofable, so IP throttling is a backstop;
  the per-user limit on `accept` is the sharper control. Behind Scaleway's edge the header is trustworthy.
- **When to revisit:** if the app runs multiple concurrent instances *and* a genuinely enumerable or
  guessable endpoint appears (reduced token entropy, a numeric id, etc.), swap the `RateLimiter`
  internals for a shared store (bucket4j + the store of the day). The filter, properties, and tests
  stay; only the bucket backing changes.
