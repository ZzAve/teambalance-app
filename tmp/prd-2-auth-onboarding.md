## Problem Statement

There is no real way for the owner's teammates to sign in. The backend trusts an
`X-User-Id` request header (`UserFilter`) — a development stub, not authentication. Without
real identity the app cannot safely attribute attendance changes to a person, onboard new
members, or be handed to a team. The trust-based ethos still needs *some* notion of "who
did this," and the at-a-glance overview is only useful if the people in it are real
members.

## Solution

Passwordless **magic-link** login backed by **server-side sessions** (Spring Session +
Redis, already provisioned in phase 1). An admin shares **one invite link**; a person
clicks it, enters their email, receives a magic link, and joins the team as a member.
Authentication carries per-person identity so every attendance change records *who* made
it. Team and Role provisioning stays back-office for v1 (no self-service team creation).

## User Stories

1. As a teammate, I want to enter my email and receive a login link, so that I can sign in without a password.
2. As a teammate, I want clicking the emailed link to log me in, so that getting in is one tap from my inbox.
3. As a teammate, I want my session to persist across visits, so that I don't have to log in every time.
4. As a teammate, I want a clear "check your email" confirmation after requesting a link, so that I know it's on the way.
5. As a teammate, I want an expired or already-used link to be rejected with a clear message, so that I know to request a fresh one.
6. As a teammate, I want to log out, so that I can leave the app secure on a shared device.
7. As an admin, I want to generate a single shareable invite link for my team, so that I can drop it in the group chat.
8. As an admin, I want to rotate or expire the invite link, so that I can stop new joins when the roster is set.
9. As a prospective member, I want clicking the invite link to let me enter my email and join the team, so that onboarding is self-explanatory.
10. As a member, I want to land in my team's events right after joining, so that I see value immediately.
11. As a member, I want my attendance changes attributed to me, so that the team has a record of who responded.
12. As a member who updates someone else's attendance (trust-based), I want the system to record that I was the one who changed it, so that history is honest even though editing is open.
13. As the owner, I want to provision a team and seed its roles via a back-office procedure, so that v1 works for my teams without building self-service.
14. As an authenticated member, I want the app to know my team context, so that I only see my team's events and pool.
15. As a developer, I want the dev/test flow to keep working without real email, so that local development and integration tests aren't blocked on a mail provider.
16. As an admin, I want event-management actions gated to admins, so that ordinary members can't create or delete events.

## Implementation Decisions

- **Mechanism:** magic-link (one-time, emailed token), **session-based** via the
  already-wired Spring Session + Redis (ADR-0008). This closes the design-doc "session vs
  JWT vs OAuth" question in favour of sessions and **supersedes** the phase-1 Auth0 note.
- **Auth endpoints (new Wirespec `auth.ws`):**
  - `POST /api/auth/magic-link/request { email }` → 202, always (no account enumeration).
  - `POST /api/auth/magic-link/verify { token }` → establishes the session, returns the
    current user; rejects expired/used tokens.
  - `POST /api/auth/logout` → clears the session.
  - `GET /api/auth/me` → current user + team context (drives the frontend auth guard).
- **Magic-link token:** single-use, short TTL (~15 min), stored **hashed** in the platform
  (`public`) schema, bound to an email. On verify, resolve-or-create the platform user and
  establish the session.
- **Email port (the one new external seam):** an outbound `EmailSender` port in the
  application/domain layer with an infrastructure adapter. **Faked in tests.** A dev/no-op
  adapter logs the link to the console so local dev needs no mail provider. The concrete
  provider (SES / Postmark / etc.) is deferred behind the port.
- **Invitations:** an invite link is a token bound to a **team** (platform-schema
  `invitations`). `POST /api/invitations` (admin) returns the link; `POST
  /api/invitations/{token}/accept` (after the joiner authenticates) adds the platform user
  to the team's roster and provisions tenant membership. One link, many joiners; the link
  can expire / rotate (ADR-0008).
- **Identity resolution:** replace the `X-User-Id` stub so `UserContext` is populated from
  the session. Keep a **test-profile-only** header shim so existing integration tests and
  the MSW dev flow continue to set a current user.
- **Tenant resolution:** after login, resolve the user's team into `TenantContext` from
  `team_members` (platform schema). v1 assumes **one team per user**; multi-team switching
  is deferred.
- **"Changed-by" actor (ADR-0003):** the domain `Attendance` records `changedBy` (the
  acting user) on write, taken from `UserContext`. Nothing yet restricts who may edit —
  trust is the default — but the actor is always recorded so a permission layer can be
  added later without a data migration.
- **Team creation:** NOT self-service in v1. The owner provisions teams and seeds roles via
  a documented back-office (DB/API) procedure (ADR-0001).
- **Frontend (FSD):** a login screen (email → "check your email"), a magic-link landing
  route that calls verify and redirects, an invite-link landing route, logout, an auth
  guard on app routes, and a user store hydrated from `/api/auth/me` (replacing the dev
  `X-User-Id` store).
- **Authorization:** admin-only actions (event CRUD, invite generation) are gated on
  `teamRole == admin`.

## Testing Decisions

- **Good tests assert external behavior** over HTTP + the session cookie — not token
  internals or session storage mechanics.
- **Seam:** the auth/invitation REST endpoints over **Testcontainers Postgres**, with a
  **fake `EmailSender`** that captures the emitted link/token (no real email sent). Sessions
  in tests use the phase-1 test toggle (`spring.session.store-type=none`/embedded).
- **Cases to cover:**
  - request → token captured by the fake sender; response reveals nothing about account
    existence.
  - verify(valid token) → session established; `GET /api/auth/me` returns the user.
  - verify(expired or already-used token) → rejected.
  - invite accept → the authenticated user becomes a `team_member` of the invited team.
  - `setAttendance` records `changedBy` = the session user (incl. when editing another
    member's attendance).
  - admin-gated endpoints reject a non-admin session.
- **Prior art:** existing controller integration tests; `UserFilter` / `TenantFilter`
  wiring from phase 1; the port-faking pattern shared with the money-pool PRD.

## Out of Scope

- Self-service team creation; multi-team membership and switching.
- OAuth / social login (superseded — ADR-0008) and password auth.
- Member-management UI (ban / promote / remove) and role-management UI.
- Push notifications (deferred — ADR-0004).
- Rate-limiting / anti-abuse hardening beyond single-use + TTL on tokens (note for later).

## Further Notes

- Supersedes the phase-1 plan's Auth0 direction; Auth0 / Keycloak / Zitadel are off the
  path unless ADR-0008 is reopened.
- Concrete email-provider selection is a follow-up; the `EmailSender` port is the contract.
- This PRD is the identity foundation the money-pool PRD leans on (real user for top-up
  attribution and admin config).
- Glossary terms: **Magic Link**, **Invite Link**, **Team creation** (see CONTEXT.md).
