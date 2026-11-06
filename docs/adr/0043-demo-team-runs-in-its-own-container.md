# ADR-0043: The demo team runs in its own container, with its own database

- Status: Proposed
- Date: 2026-11-05
- Relates to: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (magic link),
  [ADR-0012](0012-adopt-spring-security-session-fixation-csrf-unified-auth.md) (XSRF cookie), [ADR-0019](0019-self-service-team-onboarding.md) (tenant
  migration at boot), [ADR-0022](0022-jdbc-backed-shared-sessions-survive-restart.md) (JDBC sessions),
  [ADR-0024](0024-platform-admin-act-as.md) (act-as), [ADR-0036](0036-jvm-startup-time-tuning-without-native-image.md)
  (scale-to-zero, AOT), [ADR-0037](0037-in-memory-rate-limiting-defer-redis.md) (rate limiting),
  [ADR-0042](0042-money-pool-bunq-oauth-connection-held-in-memory.md) (Bunq connection). Issue #463.

## Context

Visitors of teambalance.nl should be able to try a team without an account: as a member (profile,
attendance, money pool, top-up) and as an admin. The team is shared and live: every visitor sees the
others' changes until the next reset. It is obviously fictional and in Dutch. Running cost must stay
below €10 a month.

Prod holds real teams and a live Bunq money pool. A demo inside prod would need a passwordless
login next to real tenants, a per-team Bunq branch, a guard on the Bunq OAuth start, and hiding the
demo from admin lists. Every image runs the `prod` Spring profile (the AOT bean set is fixed at
build time), so a `demo` profile is not available; behaviour differs only by runtime properties, as
on stg.

The stg image (`api/Dockerfile --target stg`) already runs the prod jar with Postgres inside the
container, starts with an empty database on every cold start, seeds a team, and logs email instead
of sending it.

## Decision

1. **Separate deployment.** A third Serverless Container, `demo.teambalance.nl`, runs the stg image
   with demo environment variables. 1 vCPU / 1 GB, `min-scale 0`, `max-scale 1` (the database is
   in the container). The prod deploy job updates its image together with prod's. It has no
   Platform Admins (`PLATFORM_ADMIN_EMAILS` empty).
2. **One host.** The demo container serves the SPA's built files itself, with client routes falling
   back to `index.html`. No CORS, no bucket, no `cookie-domain`: cookies are host-only, and the XSRF
   cookie has its own name so a prod `.teambalance.nl` cookie sent along cannot be mistaken for it.
3. **Demo switch, fail-closed.** `teambalance.demo.enabled=true` turns the demo on. With it on, the
   app refuses to start unless email sending is off, the Bunq environment is `fake`, and the
   datasource host is a loopback host (`127.0.0.1` or `localhost`). With it off, the guest-login
   endpoint answers 404 (the AOT image fixes the bean set at build time, so the switch is a runtime check).
   `teambalance.bunq.environment=fake` is refused under the prod profile unless the switch is on.
4. **Guest login = sign in as a seeded persona.** Two seeded users with real `team_members` rows:
   a member and an admin. `POST /demo/session` with a persona creates a normal session for that
   user and pins the demo tenant. Authorization is the ordinary membership path; there is no
   second authorization source like act-as. Sessions last 4 hours, fixed; when one ends, the
   visitor lands on the persona picker, never on the magic-link screen. Session creation has its
   own per-IP rate-limit bucket.
5. **Money pool.** `FakeBunqGatewayAdapter` serves the balance and payments; the seed includes a
   Bunq connection. The seeded top-up link opens an in-app "Dit is een demo — er wordt niets
   betaald" page, and in demo mode the money-pool settings refuse a change to the top-up link.
6. **Reset.** The whole database is the demo, so a reset empties it and runs Flyway and the seed
   again, sessions included: every visitor goes back to the picker. The database starts empty
   on every cold start, so a boot needs no reset. A reset runs lazily, when a demo session is created and the last reset is
   older than 1 hour. There is no scheduler.
7. **No outside effects.** No email (switch rule 3), no real Bunq (rule 3, rule 5), and the personas
   cannot be removed or demoted and the team cannot be deleted.

## Considered options

- **Demo team inside prod.** Rejected: puts a passwordless login, a Bunq branch and hiding rules
  next to real tenants and the live money pool. Each is a code guard that has to stay right.
- **Reuse the stg container.** Rejected: every `deploy:stg` of a branch would replace the demo.
- **A throwaway member per visit.** Rejected: adds user creation and cleanup; a shared persona fits
  a shared live team.
- **Reset only the tenant schema, keep sessions.** Simpler for visitors but more code; a full reset
  is accepted because a 4-hour demo session losing its login once an hour costs one click.
- **A second SPA build in its own bucket.** Rejected: another Edge Services pipeline and fee, and
  the XSRF cookie clash on `.teambalance.nl`.

## Consequences

- The guest-login code ships in the prod image, inert. The boot check and the 404 IT are what keep
  it inert; both are Testcontainers/MockMvc ITs.
- Visitors see each other's changes and lose them at the hourly reset.
- Cost scales with the hours the demo container is awake; measure after the first month.
- The demo always runs prod's commit, so it shows features only once they ship.
