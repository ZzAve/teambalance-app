# ADR-0008: Auth — magic-link login, session-based, shareable invite onboarding

- Status: Accepted
- Date: 2026-06-23
- Supersedes: the Phase-1 foundation plan's tentative "Auth0 OAuth" direction
  (`docs/plans/2026-03-11-phase1-foundation.md`)

## Context

v1 needs **individual identity** — ADR-0003 records who changed an attendance, and the
money pool's future rankings attribute contributions per person. But the trust-based,
low-friction ethos (ADR-0001) pushes against heavyweight login. The original design doc
left "session vs JWT vs OAuth" open; the Phase-1 plan pencilled in Auth0 OAuth + Spring
Session + Redis for a later "Phase 5". Spring Session + Redis is already wired in.

## Decision

**Authentication: magic-link (passwordless email) login, session-based.**

- Enter email → click a one-time link → authenticated. No passwords, no third-party
  OAuth provider.
- Sessions are server-side via the already-provisioned **Spring Session + Redis** — this
  closes the doc's "session vs JWT vs OAuth" open question in favour of **sessions**.
- Requires transactional email sending (accepted infra cost).

**Onboarding: one shareable team invite link.**

- An admin generates a single invite link and shares it (e.g. in the group chat).
- A clicker enters their email → magic link → becomes a member of that team.
- One link, many joiners; the link can expire / rotate.

**Deferred (per ADR-0001):** self-service team *creation*. Teams are provisioned by the
owner via DB/API initially; the invite link onboards members into an existing team.

## Consequences

- Supersedes the Auth0/OAuth plan note. Auth0/Keycloak/Zitadel are no longer the planned
  path unless reopened.
- Per-user identity exists from v1, satisfying ADR-0003 and future rankings.
- No external auth dependency; lower friction, EU-data-friendly, self-hostable.
- New v1 dependency: a transactional email channel (for magic links + invites).
- Team creation remains a manual/back-office step until self-service is built.
