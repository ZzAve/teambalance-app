# ADR-0027: Drop Google Sign-In — magic-link stays the sole auth method

- Status: Accepted
- Date: 2026-08-30
- Supersedes: [ADR-0011](0011-add-google-signin-verified-email-linking.md), **the Google Sign-In
  decision only** — ADR-0011's cut-username/password and `Email`-normalization decisions stand
  unchanged
- Relates to: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (magic-link as the sole
  method), [ADR-0012](0012-adopt-spring-security-session-fixation-csrf-unified-auth.md) (one of whose
  justifications was the forthcoming Google work)

## Context

[ADR-0011](0011-add-google-signin-verified-email-linking.md) added Google Sign-In as a *second*
passwordless method — another proof of email control landing in the same account, matched on verified
email. In the clean-slate rewrite it was never carried forward, and it is now dropped **for good**:
magic-link remains the sole authentication method.

ADR-0011 bundled three decisions. Two are independent of Google and **remain in force**:

- **No username/password** — the motivation was really dev-loop friction, solved for free by long-lived
  sessions plus a dev login shortcut.
- **The `Email` value object** — `trim().lowercase()` normalization with a lowered-unique guard. This is
  load-bearing regardless of how many front doors exist (magic-link stored email as-typed before it),
  and is entirely unaffected by dropping Google.

Only the third — Google as a second front door — is reversed here.

## Decision

**Magic-link is the sole authentication method. Google Sign-In is dropped.**

- Email control is the only proof v1 accepts (ADR-0008), and magic-link is the only mechanism providing
  it. No Google Identity Services, no `GoogleIdentityVerifier` port, no `POST /api/auth/google/verify`,
  no `VITE_GOOGLE_CLIENT_ID` / `teambalance.auth.google.client-id`. None of this was built in the
  rewrite, so there is nothing to remove — this is a decision-and-doc reversal, not a code migration.
- **Faster repeat login is being explored via passkeys, not Google.** The convenience ADR-0011
  attributed to a Google button is now expected to be served by passkey (WebAuthn) login, which is under
  investigation. That is its own decision and its own ADR when it lands; it is named here only to record
  *why* the gap Google would have filled is not being reopened with Google.
- **What stands from ADR-0011:** no username/password, and the `Email` normalization. Neither depends on
  Google.

## Consequences

- **ADR-0011 is partially superseded**: its Google-Sign-In decision no longer holds; its other two
  decisions do. ADR-0011's frontmatter carries a pointer here.
- **ADR-0012 (Spring Security)** listed "the forthcoming Google Sign-In work introduces a second auth
  method" among its three justifications. Spring Security adoption **stands** on its other grounds
  (session-fixation rotation, CSRF, a unified `SecurityFilterChain`); the Google justification is void.
  The unified filter chain is where a future passkey provider would slot in — the same seam Google would
  have used.
- We remain single-method. If passkeys land, they become the second front door under a new ADR, and the
  "one identity, many proofs of email control" shape ADR-0011 established is the pattern they follow.
