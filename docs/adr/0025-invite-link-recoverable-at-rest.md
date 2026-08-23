# ADR-0025: The Invite Link is recoverable at rest

- Status: Accepted
- Date: 2026-08-23
- Amends: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (the Invite Link half only; the Magic Link stays hash-only)
- Resolves: [#38](https://github.com/ZzAve/teambalance-app/issues/38) (unmet AC: "surfaces the current active link")

## Context

`POST /api/invitations` minted a token, returned it once, and persisted only a salted SHA-256 of it.
The rationale was written into `InvitationService`:

> The plaintext is never stored, so a DB-read adversary cannot recover a usable link. Because the
> hash is one-way, a repeat call can't re-show a previous link — each call mints a new one.

That second sentence is the bug. #38's acceptance criteria included "Frontend admin control exposes
rotate/expire **and surfaces the current active link**", and it cannot be met against a one-way
digest: after a page refresh the server has no way to answer "what is my team's invite link?".
There was no `GET` on `invitations.ws` at all, because there was nothing readable to serve.

Two consequences followed, both reproduced before this change:

1. **The link was write-only.** An admin who closed the dialog could never see or re-copy the link
   they had just shared. The only recovery was to mint a new one and re-paste it into the group chat.
2. **Live links accumulated without bound.** `GenerateInviteDialog` auto-minted whenever its
   in-memory state was empty — which, after a refresh, was always. Every refresh-then-open created
   another concurrently-valid token, none of them visible anywhere. This contradicted #35's stated
   model ("one link, reusable by many joiners") and is the security-relevant half of the defect: the
   team's real exposure was N live credentials, where N was however many times someone had opened a
   dialog.

Revocation did still work — `expireActive` expires *every* active invitation for the team — but it
was only reachable by first opening the dialog, which minted a fresh link on the way in.

## Decision

**Store the invite token so the server can read it back.** Alongside the existing `token` hash
column, `invitations` gains `token_encrypted`: the same token under AES-256-GCM with an app-held key
(`INVITATION_TOKEN_ENCRYPTION_KEY`, the sibling of the existing `INVITATION_TOKEN_SALT`).

The hash stays and keeps its job. Accept still resolves a presented token by hashing it and matching
`token` — unchanged lookup, unchanged semantics, no decryption on the joiner's path. The ciphertext
is read on exactly one path: the new admin-only `GET /api/invitations/active`.

**One active Invite Link per team becomes an invariant.** `POST /api/invitations` is now idempotent:
with an active link present it returns that link instead of minting a second. Minting a *replacement*
is what `rotate` is for, and it stays the only way to invalidate-and-reissue in one step.

The invariant is held in `InvitationService`, not in the schema. A partial unique index would be the
natural home, but active-ness is `expires_at > now()` and Postgres requires index predicates to be
IMMUTABLE. Buying the constraint would mean adding a revoked-flag column purely to give the index
something immutable to bite on, and then keeping two representations of the same fact in sync — a
worse trade than enforcing it in the one service that mints.

## Consequences

**The security property is genuinely weaker, and this is the whole cost.** Before: a stolen database
dump yielded nothing, even with the salt, because 32 random bytes behind SHA-256 are not
recoverable. After: a dump *plus* the encryption key yields usable invite links. The key lives in the
container environment, not in the database or the repository, so the two have to be stolen
separately — but "DB alone is useless" has become "DB alone is useless unless the key leaked too".

We accept that, because the threat model does not justify what it was costing:

- The Invite Link is **designed to be low-secrecy**. Its entire purpose is to be pasted into a team
  WhatsApp group. Anyone holding it can join the roster; that is the feature.
- A read-only DB leak buys an attacker "can join a volleyball team's roster", against which the
  mitigation — an admin clicks Rotate — is one click and already built.
- An attacker with DB *write* access gains nothing from decryption: they can insert their own
  invitation row.
- Re-displayable shared invite links are what GitHub, Slack and Discord all do, for exactly the UX
  reason above.
- Against that, the hash-only choice was actively producing unbounded live credentials. The change
  makes the team's exposure *one* link that an admin can see and revoke, instead of N invisible ones.

**The Magic Link is untouched.** It stays single-use, short-TTL and hash-only. It is a bearer
credential for one person's identity, its secrecy is the point, and nothing needs to re-display it —
none of the reasoning above transfers.

**Existing active invitations are expired by the migration.** They have no ciphertext, so they cannot
be surfaced, and because of the accumulation bug there is no way to tell which of a team's live
tokens was the one actually shared. Leaving them active would preserve exactly the state this ADR
removes. Teams with a link in circulation must generate a new one; `V010` records this.
