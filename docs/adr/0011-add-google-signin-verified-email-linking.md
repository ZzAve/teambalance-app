# ADR-0011: Add Google Sign-In via verified-email linking; no passwords

- Status: Accepted
- Date: 2026-07-14
- Amends: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (which chose magic-link
  and explicitly excluded "passwords, no third-party OAuth provider")

## Context

ADR-0008 chose magic-link as the sole authentication method and ruled out both passwords
and third-party OAuth. Two additions were proposed: username/password (for faster repeat
logins) and Google sign-in. Grilling showed the password motivation was really *dev-loop
friction* (fetching a token on every local login), not a user need — and that magic-link
already covers the "no Google account" segment. Password auth would add permanent cost
(hashing, reset flow — which needs email anyway, lockout, breach liability) to solve a
problem that long-lived sessions + a dev-only login shortcut solve for free.

## Decision

**Cut username/password. Add Google sign-in as a second passwordless method. Reopen
ADR-0008 only for Google — not passwords.**

- **Identity model — Google is another proof of email control.** A Google login with
  `email_verified == true` proves the same thing a magic link proves: control of an
  email. So it lands in the *same* account, matched on verified email via the existing
  find-or-create-by-email path. **No new schema, no identities/`google_sub` table, no
  identity-provider abstraction.** One identity, two front doors.
- **Email is the join key, normalized.** Introduce an `Email` value object that
  normalizes `trim().lowercase()`, used by *both* methods so the match is reliable. This
  fixes a pre-existing gap (magic-link stored email as-typed; `users.email` is a
  case-sensitive `UNIQUE VARCHAR`, so `Alice@…` and `alice@…` were distinct rows). Add a
  lowered-unique-index / `citext` guard on the column. No provider-specific rules (no
  Gmail dot/`+tag` stripping). Cost-free now under ADR-0005 (clean start, no migration).
- **Flow: backend-verified Google ID token (Google Identity Services), identity-only.**
  The SPA's Google button yields an ID token; the frontend POSTs it to
  `POST /api/auth/google/verify`; the backend verifies it and establishes the session
  exactly like magic-link verify. Verification uses `GoogleIdTokenVerifier`
  (`com.google.api-client:google-api-client`, 2.x) behind a domain port
  (`GoogleIdentityVerifier`) — the same "abstract the third party behind a port" pattern
  as Bunq, so `AuthService` stays framework-free and unit-testable with a fake. The one
  business rule on top of the library's signature/`aud`/`iss`/`exp` checks: reject unless
  `email_verified == true` (the account-takeover guard).
- **No Google API access, so no client secret and no auth-code flow.** Only the public
  client ID is needed (frontend `VITE_GOOGLE_CLIENT_ID`; backend
  `teambalance.auth.google.client-id` feeds the verifier's audience).
- **Google is optional, gated on config.** If the client ID is unset, the button hides
  and the endpoint is disabled. Dev, tests, and self-hosters without a Google project run
  magic-link-only, unchanged (supports ADR-0001's self-hostable ethos).
- **Enrichment on create only.** A user created via Google gets `displayName` and
  `avatar_url` from the token; an existing user logging in via Google is never mutated —
  login only establishes the session.
- **Onboarding unchanged and out of scope.** Google is symmetric with magic-link verify;
  it neither builds nor changes invite-accept (#37). A new email with no team hits the
  same `NoTeamMembershipException` dead-end magic-link produces today. **Forward
  constraint on #37:** invite-acceptance must be login-method-agnostic (attach the
  currently-authenticated user to the team, regardless of how they signed in), so Google
  onboarding comes for free rather than needing a retrofit.

## Considered Options

- **Separate Google identities / explicit "connect Google" linking** — rejected: creates
  the "why do I have two accounts?" problem and needs schema + UI for a threat model we
  don't have. Verified email is a sound join key.
- **Backend authorization-code / OIDC flow** — rejected: its only advantage is Google API
  access + refresh tokens we don't need; it costs a client secret and redirect plumbing.
- **Hand-rolled Nimbus JWKS verification** — rejected: easy to omit `aud`/`email_verified`
  and open a hole; the official verifier makes those checks the library's job.

## Consequences

- We cannot tell *how* a user authenticated after the fact (no per-provider audit trail),
  and a future "disconnect Google" action would require adding the identities table then.
  Accepted for v1.
- **Adopting Spring Security is a separate decision** (its own ADR/grilling), not part of
  this work. Flow (B) needs no Spring Security; if adopted later, Google verification
  becomes a filter/provider in the chain with the same verification logic.
- **Test gap:** no automated test exercises a real Google-signed token end-to-end. Above
  the `GoogleIdentityVerifier` port everything is tested with a fake (unit + Testcontainers
  integration); Google is mocked in the MSW/Playwright e2e; the real adapter is covered by
  one focused adapter test + manual verification. Logged in the layered-test-strategy plan.
