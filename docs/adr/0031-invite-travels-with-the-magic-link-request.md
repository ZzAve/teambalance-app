# ADR-0031: The Invite travels with the Magic Link request, by reference

- Status: Accepted
- Date: 2026-09-18
- Amends: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (the accept ordering, and what a
  sign-in may leave behind)
- Relates to: [ADR-0025](0025-invite-link-recoverable-at-rest.md) (why the Magic Link stays free of
  credentials), [ADR-0019](0019-self-service-team-onboarding.md) (why teamless is now a real place)
- Resolves: [#342](https://github.com/ZzAve/teambalance-app/issues/342)

## Context

Joining a Team spans two page loads: `/invite/:token`, where the joiner types their email, and the
emailed `/auth/verify`, where they click through. Nothing connected them on the server. The
magic-link request carried only the email, the emailed URL carried only the login token, and the
invite token was held in between by the joiner's `localStorage`.

`localStorage` is scoped to one browser profile. The two page loads are the same profile only if the
joiner reads their email in the browser they tapped the invite from. Where that fails:

| Path | Same profile? |
|---|---|
| Tap on a phone, open the email on a laptop | no |
| Tap in WhatsApp's in-app browser on iOS, open the email in Mail or Gmail | no |
| Installed PWA versus Safari on iOS | no |
| Desktop WhatsApp into the default browser, mail in the same browser | yes |

The issue framed this as an iOS in-app-browser problem. It is broader than that: the phone-to-laptop
case breaks on every platform, by construction, and needs no device-specific behaviour to explain.

The failure was quiet. Verify found no pending token, read that as "not an invite", signed the person
in with no team, and the root guard dropped them on the onboarding hub. Recovery existed — the hub's
*I have an invite* paste page, or re-tapping the original link while signed in — but nothing told
them an invite had been lost, and they landed in precisely the signed-in-but-teamless state the
verify page's accept ordering was written to prevent.

## Decision

**The invite travels with the magic-link request, and the server remembers it by reference.**
`magic_link_tokens` gains a nullable `invitation_id`. The invite page sends its token with the
request; the server resolves it, stores the id, and accepts the invitation when that magic link is
verified. The client keeps nothing.

**Signed-in-but-teamless is a legitimate outcome, not a failure.** A sign-in whose invitation has
since expired, been rotated, or (for the single-use ADMIN handover link) been spent still establishes
the session, and says what happened. This reverses ADR-0008's fail-closed accept ordering.

## Considered options

**By value: the invite token in the emailed URL.** Rejected. The two halves of such a link have
wildly different lifetimes — a Magic Link is single-use and expires in fifteen minutes, while an
Invite Link is reusable and lives until an admin rotates it. Every joiner's mailbox would hold a live
team-join credential for months, with a lifetime nobody reading "this link is valid for 15 minutes"
would expect, and forwarding a stale login email would hand over membership. ADR-0025 explicitly
carved the Magic Link out of its own relaxation and said none of that reasoning transferred; this
would have quietly transferred it. It also leaves the accept on the client, keeping the cross-mount
seam and its sanctioned render test alive.

**Client carry kept as a fast path, with recovery copy added.** Rejected. Two mechanisms for one
fact, which can disagree, and it does not fix the cross-device case at all: nothing the phone wrote
is readable from the laptop. It renames the failure instead of removing it.

**Email-bound invitations.** Rejected. It dissolves the problem by making the invite *be* the magic
link, but it contradicts ADR-0008's "one link, many joiners" and ADR-0025's low-secrecy design, and
turns a paste into the group chat into per-player admin work.

**Generalising now to any post-sign-in destination.** Deferred. A logged-out person opening a shared
event deep link loses it the same way, and the same record would carry it. But a foreign key to
`invitations` cannot point anywhere dangerous, whereas a stored destination is a string that must be
validated as a same-origin relative path or it becomes an open redirect on an auth link. Two typed
columns added when each is needed beat one generic blob added early; the deep-link case is filed
separately.

## Consequences

**Nothing recoverable is added to the database.** The column holds a foreign key, not a credential,
so a dump yields "this address was invited to this team" and no usable link. ADR-0025's threat model
is unchanged, and the Magic Link email is still a pure identity credential.

**The pending invite cannot outlive, or diverge from, the link it belongs to.** It is a column on the
magic-link row, so it inherits that row's fifteen-minute expiry and its single-use consumption. There
is no second lifecycle to reason about, and no cleanup to write.

**A dead invite is refused before any email is sent.** The invite page can say so while the joiner is
still looking at it. The refusal does not distinguish unknown from expired, matching accept. This
does give an unauthenticated caller an oracle for whether an invite token is live, which we accept:
the token is 32 random bytes, the endpoint is throttled per address, and confirming a low-secrecy
shared link is live tells an attacker only what using it would.

**A new, accepted capability: an invite can be attached to someone else's sign-in.** Anyone holding a
team's Invite Link — which lives in a group chat by design — can request a magic link for any address
with that invite attached, and the recipient joins by clicking what reads as a login link. Per
ADR-0023 the joined Team also becomes their Active Team, so an existing member of another Team is
switched. We accept it: the payload is membership of a volleyball roster, the attacker gains nothing
they could not get by pasting the link to the person directly, and the recipient had to click an
unsolicited email whose own copy tells them to ignore it if they did not request it. Two things keep
it bounded. The binding is to the **specific magic-link row**, never to the email address, so an
invite can never ride a sign-in the person requested themselves. And the landing names the Team, so
no join is silent.

**Accept sits outside the atomic consume-and-resolve pair, and before the session starts.** Outside,
because a lapsed invitation must not veto a valid proof of identity — the existing atomicity
guarantee, and `MagicLinkSignInBoundaryIT` which holds it, are untouched. Before, because accepting
remembers the joined Team as the caller's last active one, which the landing pin then reads
(ADR-0023 §4); reversed, the two disagree about which Team is active.

**The client-side carry and its tests are gone.** `savePendingInviteToken` /
`takePendingInviteTokenForEmail`, the email-match gate that existed only to protect them on a shared
browser, that gate's unit test, and the `invite-flow.test.tsx` sanctioned MSW/RTL exception are all
removed, and CLAUDE.md is down to two exceptions. The property they approximated is now held where it
can actually be observed: `app/e2e-real/invite-cross-browser.spec.ts` drives two real browser
contexts, because a jsdom test mounting two routers shares one `localStorage` and so could never
express "a different browser" at all.
