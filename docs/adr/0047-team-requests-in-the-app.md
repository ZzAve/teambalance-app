# ADR-0047: Team requests are made in the app and approved by a Platform Admin

- Status: Accepted
- Date: 2026-11-11
- Relates to: [ADR-0019](0019-self-service-team-onboarding.md) (creation codes gate team creation),
  [ADR-0031](0031-invite-travels-with-the-magic-link-request.md) (invite travels with the magic-link request),
  [ADR-0043](0043-dutch-and-english-react-i18next-language-on-the-user.md) (mail language), issue #152

## Context

A person who wants a team needs a creation code, and codes are minted by hand by a Platform Admin. Issue #152
asked for a way to ask for one. The first idea was a public form on the landing page whose request travels
with the magic-link request, as the invite does in ADR-0031.

## Decision

**A signed-in user requests a team inside the app; a Platform Admin approves or rejects it.** This replaces
the travel-with-the-magic-link idea. ADR-0031's model is not used and the public surface does not change: the
only new endpoints are authenticated.

- A **Team Request** holds a team name (TeamNaming rules, at most 100 characters) and a purpose (1 to 1000
  characters, plain text). Any signed-in user may submit, teamless or not.
- One pending request per user (partial unique index); a second submit is a 409. There is no edit or
  withdraw. After a rejection, or once the approved code is consumed or has expired, the user may submit
  again. Pending requests do not expire.
- **Approve** mints a creation code that expires in 30 days, links it to the request and sets the status,
  in one transaction. **Reject** takes an optional reason of at most 500 characters.
- Mails: Platform Admins get a Dutch "new request" mail with a link to `/admin/creation-codes`. The requester
  gets "received", "approved" (a link to `/create-team?code=...&name=...`) and "rejected" (with the reason if
  given) in their stored language, Dutch when none (as for the magic link). Mails go out after the write
  commits and are best-effort.
- The creation code stays the only gate to a tenant schema. A request grants nothing by itself; creating the
  team still redeems a code through the existing create-team path.
- No extra rate-limit policy: the endpoint is authenticated and limited to one pending request per user.

## Consequences

- The approved code is in a mailbox and also returned to the requester by `GET /api/team-requests/mine` while
  it is unconsumed and unexpired.
- Platform Admins decide in the app, next to the creation-codes page.
- No new e2e flow: no new auth path, cross-tenant write or external integration.
