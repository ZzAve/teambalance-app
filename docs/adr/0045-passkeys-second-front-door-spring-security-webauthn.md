# ADR-0045: Passkeys are the second front door, through Spring Security's WebAuthn module

- Status: Accepted
- Date: 2026-11-07
- Amends: [ADR-0034](0034-drop-google-signin-magic-link-only.md) (which reserved this decision for its own ADR)
- Relates to: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (magic link stays),
  [ADR-0012](0012-adopt-spring-security-session-fixation-csrf-unified-auth.md) (the chain this slots into,
  the CSRF exemption rule, nothing of Spring Security's on the session),
  [ADR-0031](0031-invite-travels-with-the-magic-link-request.md) (why a passkey sign-in carries no invite)

## Context

ADR-0034 dropped Google Sign-In and said repeat-login convenience would come from passkeys, under a new ADR,
following ADR-0011's shape: one identity, many proofs. Magic link costs an email round trip on every sign-in;
a passkey signs in with the device's own unlock.

Spring Boot 4.1 brings Spring Security 7.1, whose `spring-security-webauthn` module ships the registration
and authentication endpoints, the ceremony verification (webauthn4j), a session-backed challenge store and an
owner-checked delete. The SPA side is `@simplewebauthn/browser`, which speaks the same WebAuthn Level 3 JSON.

## Decision

1. **Passkeys are the second proof of identity. Magic link remains the first and the only way to create an
   account.** A passkey is registered by a signed-in user, so passkey sign-in always lands on an existing
   account. There is no sign-up by passkey and no invite attached to a passkey sign-in: an invite travels with
   a magic-link request (ADR-0031), and a passkey request has no email to send.
2. **Spring Security's WebAuthn module, not a hand-rolled port.** Its five endpoints are used as shipped:
   `POST /webauthn/register/options`, `POST /webauthn/register`, `DELETE /webauthn/register/{id}`,
   `POST /webauthn/authenticate/options`, `POST /login/webauthn`. They are Spring's contract and are therefore
   **not in Wirespec**; `shared/api/passkeys.ts` is the one client file that names them. Our own
   `GET /api/account/passkeys` (the list) is Wirespec-first.
3. **The app's session stays the identity.** Spring's `/login/webauthn` success is bridged by a success
   handler that calls `AuthService.startSession` — the same call magic-link verify makes — so the session is
   rotated, act-as is closed and the landing Team is pinned exactly as on a magic-link sign-in. Spring Security
   stores nothing on the session (ADR-0012); the WebAuthn filter is given a request-attribute context
   repository.
4. **Users are the WebAuthn user entities.** The `PublicKeyCredentialUserEntity` is a read-only view of
   `users`: `id` is the user's UUID bytes, `name` the email (what the passkey picker shows), `displayName` the
   display name. No table for them; credentials live in `public.passkeys` with
   `ON DELETE CASCADE` from `users`.
5. **Two more CSRF-exempt endpoints, JSON only**: `/webauthn/authenticate/options` and `/login/webauthn`, for
   the reason ADR-0012 gives for the magic-link pair: pre-session, nothing to echo yet, and a JSON body cannot
   be sent by an HTML form without a CORS preflight. Register and delete run on a session and keep the check.
6. **RP ID and allowed origin derive from `teambalance.frontend-base-url`**: `localhost` / `http://localhost:5173`
   in dev and e2e, `app.teambalance.nl` / `https://app.teambalance.nl` in prod. Not the registrable domain:
   passkeys are for the app, not the landing page or the demo host.
7. **Spring's ceremony defaults stand**: resident key required (discoverable, so sign-in needs no username),
   user verification preferred, attestation none, EdDSA/ES256/RS256.

8. **The passkey is offered right after a magic-link sign-in, never before one.** `/api/auth/me` reports
   `passkeyCount`; while it is 0 and the browser supports passkeys, the app shows a one-line prompt
   ("Add a passkey and skip the email next time?") on the first screen after sign-in. "Not now" is a
   per-device preference in `localStorage` (`tb.pref.passkey-prompt-dismissed`, ADR-0030's convention): the
   right answer differs per device, and nothing on the server depends on it. The login page says an account
   starts with an email and a passkey can be added right after. Sign-up *with* a passkey — a passkey registered
   before the email is proven — is rejected: it would mean either a pending, hijackable account or a second
   user and a cross-schema merge the tenant tables (no foreign keys to `users`) cannot police. Options
   compared in the planning record; this is option D.
9. **A passkey the server no longer knows is dropped from the device.** It happens when someone removes a
   passkey (or their account) while the device keeps it. Spring answers every failed `/login/webauthn` with 401;
   our failure handler adds `{"error":"unknown_passkey"}` only when no credential with that id exists. The SPA
   then calls the WebAuthn Signal API (`PublicKeyCredential.signalUnknownCredential`) so the password manager
   deletes it, and forgets the device's last sign-in method so /login stops starting a ceremony that cannot
   succeed. Other failures (expired challenge, bad signature) carry no body: the passkey may still be good, so
   it is never signalled away. Browsers without the Signal API keep offering it until the person deletes it.

## Considered options

- **webauthn4j or Yubico java-webauthn-server behind our own port and controllers.** Rejected: we would
  rewrite the five endpoints, the challenge store and the owner check Spring already ships, and the options
  JSON (a dozen nested types) still could not be Wirespec-typed.
- **Conditional UI (autofill) on the login page.** Deferred: a button is enough; autofill adds an abortable
  pending request and an input it must attach to.
- **`userVerification: REQUIRED`.** Deferred: it needs our own `WebAuthnRelyingPartyOperations` bean; the
  default already asks for verification where the authenticator can.

## Consequences

- A second front door exists. Rate limiting covers `POST /webauthn/authenticate/options` (every sign-in
  attempt needs fresh options, so this bounds `/login/webauthn` too; `/login/webauthn` itself runs before the
  limiter in the chain). An anonymous options call writes a session row for the challenge; the same limit
  bounds that. `/login/webauthn` is not throttled itself: the WebAuthn filter runs before the limiter, each challenge is single-use (Spring clears it before it verifies), and challenges are rate limited at the options endpoint. An anonymous challenge's session lives five minutes, not the session timeout.
- Passkeys are off in the demo container: its guests share one persona, so the SPA hides them and `/webauthn/register*` answers 404 when `teambalance.passkeys.enabled` is false (set in the demo image).
- Passkeys can be listed and removed by their owner on `/account`. There is no admin view: a passkey is a
  personal credential, like a Calendar link.
- The e2e suite gains one flow (`passkey.spec.ts`) using Chromium's virtual authenticator. It is the only
  place the signature verification and the session bridge run end to end; ITs pin the wiring around them.
- `WebConfig`'s CORS mapping now also covers `/webauthn/**` and `/login/webauthn`; the prod SPA calls them
  cross-origin.
- The device remembers which method signed in last (`tb.pref.last-sign-in-method`) and marks it on `/login`; when it was a passkey the ceremony starts on page load, except once right after a logout. Per device, like the add-a-passkey dismissal.
- Nobody is asked twice on one device; someone who deletes their last passkey sees the
  prompt again on the next sign-in unless they dismissed it on that device.
- ADR-0034's "if passkeys land, they become the second front door under a new ADR" is fulfilled here.
