# ADR-0032: Calendar links — a per-member webcal feed, unauthenticated by design

- Status: Accepted
- Date: 2026-09-19
- Builds on: [ADR-0025](0025-invite-link-recoverable-at-rest.md) (the token storage pattern),
  [ADR-0024](0024-platform-admin-act-as.md) (what Act-as may not do),
  [ADR-0026](0026-member-team-profile-owned-by-the-tenant.md) (what belongs in a tenant schema)
- Numbering note: this was specified as ADR-0031, which `main` had already taken
  ([ADR-0031](0031-invite-travels-with-the-magic-link-request.md), merged in `5df8f7c`).

## Context

Attendance is the core pillar ([ADR-0002](0002-attendance-is-the-core-pillar.md)), and the whole
product rests on a member opening the app often enough to answer. But the team's schedule does not
live where the member plans their life: it lives here, and their week lives in their phone's
calendar. Every team we have watched solves this by hand — someone types the training times into
their own calendar once a season, and the copy silently goes stale the first time an event moves.

The standard answer is a **webcal subscription**: a URL the calendar app polls, so the events show up
next to work meetings and stay correct. Every calendar client — Google, Apple, Outlook, Thunderbird —
supports exactly one flavour of it: an HTTP GET returning `text/calendar`, with **no login**. A
calendar app cannot be shown a magic-link page, cannot hold a session cookie, and will not carry an
`Authorization` header. So "subscribe to your team's calendar" is, unavoidably, "hand a calendar app
a URL that needs no credentials but the URL itself".

That is a new shape for this codebase. Every other endpoint either authenticates
(`requireCurrentUserId()`) or accepts a token that is spent immediately (magic link, invite link).
This one is a **standing, long-lived bearer credential in a URL**, held by software we do not control,
stored in plaintext in the subscriber's calendar account, and replayed automatically every hour.

## Decision

### The domain term is **Calendar link**

The credential, not the feed, is the thing a member creates, sees, and deletes. It belongs to one
(user, team) membership. See the glossary entry in `CONTEXT.md`.

### It lives in the tenant schema

`calendar_links` is a tenant table (`db/tenant-migration/V010`), not a platform one. The schema that
already scopes a team's events scopes its calendar links, and that is load-bearing rather than tidy:
a token minted for team A, presented under team B's slug, is looked up **in B's schema**, finds
nothing, and 404s. The cross-team check is the absence of a row, not a comparison somebody has to
remember to write and a reviewer has to remember to look for.

It also puts the link inside the schema-routing guarantee ADR-0026 moved positions for: a request
that resolves no tenant routes to `__no_tenant__`, which does not exist, so a routing mistake fails
loudly instead of quietly reading the platform schema.

### The token is stored twice over, exactly as ADR-0025 stores an invite token

A salted SHA-256 for **lookup** — what a presented token is matched on, so a subscriber's fetch never
causes a decryption — and an AES-256-GCM copy for **display**, so a member can come back to the URL
they already put in their calendar instead of it being show-once. Both secrets are calendar-link
specific (`TEAMBALANCE_CALENDAR_LINK_SALT`, `TEAMBALANCE_CALENDAR_LINK_ENCRYPTION_KEY`) and are never
the invitation ones: one leaked secret must not read the other kind of link.

ADR-0025's cost/benefit transfers, with one difference worth naming. An invite link is *designed* to
be low-secrecy — pasting it in a group chat is the feature. A calendar link is not: it is shared to a
device, never to a person, and a leaked one discloses one member's schedule. What makes the
reversible copy acceptable anyway is that the alternative is worse in the same direction: a show-once
URL that a member cannot re-read is a URL they will mint again on every new device and never revoke,
so hash-only storage buys secrecy at the price of exactly the unbounded accumulation ADR-0025 was
written to stop.

`InviteTokenCipher` was generalised into `TokenCipher` rather than copied, so there is one
implementation of the crypto and two keys.

### Bounded, explicit, and short of forever

- **Created explicitly.** Nothing mints one on a member's behalf, so a member's exposure is exactly
  the links they asked for.
- **Three per member per team, expired ones counted.** A phone, a laptop and a work calendar is an
  ordinary thing to want. Counting expired rows is what stops the cap widening by itself over time.
- **One year, no renewal.** Long enough to set up and forget for a season or two; short enough that a
  URL leaked into a shared calendar stops working without anyone having to notice and revoke it.
  Renewal is deliberately absent: a link you can extend is a link that never expires.
- **Delete is the only other action, and only your own.** There is no admin view and no admin
  control. A calendar link is a personal credential; an admin who could list one would be reading a
  teammate's private feed, and an admin who could revoke one would be breaking their calendar.
- **An optional 50-character label**, because three otherwise identical URLs are indistinguishable
  when deciding which to delete.

### Blocked entirely under Act-as

A Platform Admin inside a team holds a **Virtual Member** that satisfies `requireMember` exactly as a
real membership does, so the management endpoints would otherwise simply work — and an operator would
mint a year-long standing credential in somebody else's team, or delete one a member relies on, with
only the generic Act-as Record to show for it (ADR-0024 §4 records that access happened, never what
came of it). Act-as is full read and write on the team's *own* data; issuing personal credentials to
a person who is not you is not that. The refusal is checked **before** membership, since the Virtual
Member is what it is guarding against, and is reported as `ACT_AS_NOT_PERMITTED`.

### The feed authenticates on the token and nothing else

`GET /api/calendar/{teamSlug}/{token}.ics`, session-less. The API has no Spring Security: a controller
is public exactly by not calling `requireCurrentUserId()`, which is how the `/api/auth` endpoints are
already public. There is no CSRF filter and no session filter that would reject a cookie-less GET.

Resolution order, all of it re-established per request:

1. team by slug,
2. token by salted hash, **in that team's schema**,
3. the link is still within its year,
4. its owner is **still a member** — read from `team_members`, not carried on the link, so a member
   who leaves stops receiving the schedule on their next refresh without anyone deleting anything.

Every failure is the same bare **404** with an empty body. The endpoint is unauthenticated and its
identifiers look guessable, so telling a caller which of the four they hit would turn it into an
oracle for the other three.

Tenant resolution gets its own small filter, because the session filter has no session to resolve
from. It binds a schema from a **public** slug and nothing else; that grants nothing on its own,
since every row served is still gated on steps 2–4. It is the second and last sanctioned caller of
`TeamRepository.findTenantRoutingUnchecked`, whose documentation now names both.

### What the feed discloses, and what it does not

One `VEVENT` per event from 30 days back (a subscribed calendar is a record as well as a plan), UTC
timestamps, the event's own id as `UID` so an hourly refetch updates entries in place, `LOCATION`,
and a `DESCRIPTION`/`URL` pointing back at the event page.

`SUMMARY` carries the subscriber's own answer as a prefix — `✓`, `?`, `✗`, and nothing at all for an
unanswered event, because a bare title is the honest rendering of "you haven't answered". A prefix
rather than a colour or a category because it is the one decoration every client renders identically.
`TRANSP:TRANSPARENT` only for `ABSENT`: the member said they are not going, so it must not make them
look busy — while an *unanswered* event stays opaque, since "I haven't decided" is not "I am free".

**No attendees, no roster, no teammate names, no alarms.** The URL is a bearer credential held by
software we do not control; the less it discloses if it leaks, the better. Reminders are the
subscriber's own business and their calendar app already does them better.

### Caching and throttling

`ETag` over the response body with `If-None-Match`/304 and `Cache-Control: max-age=0, private` — a
client refetches hourly whether or not anything changed, so the 304 is the point, and no shared cache
may hold one member's schedule. `DTSTAMP` is the event's `created_at` rather than the wall clock,
precisely so the ETag is stable; a `now()` there would defeat the whole mechanism.

Rate limited to 60/hour **per token** on the existing `RateLimitFilter` (ADR-0020), which now also
inspects GET and HEAD. Per token rather than per IP because there is no session to key on and a whole
club behind one office NAT would otherwise share a bucket and knock each other's calendars offline.

Two consequences of keying on a caller-supplied value, both accepted:

- **It bounds a subscription, not a host.** Someone varying the token gets a fresh bucket per
  request, so this is not a volume defence — which is what ADR-0020 already says the limiter is
  ("a coarse backstop", "not a live-vuln fix"), and no unauthenticated route here has one. What it
  *does* buy is the case it was written for: a misconfigured or runaway calendar client hammering one
  real subscription. The bucket store is bounded (`maximumSize`), so distinct keys cost memory only up
  to that cap.
- **A refill period must not outlive the bucket store's eviction window.** `RateLimiter` evicts idle
  buckets, and its comment — "a bucket unused that long has long since refilled to full" — is only
  true while the window is at least the longest refill period. This is the first policy to refill over
  anything longer than a minute, and at the old ten-minute window a "60 per hour" limit silently
  enforced 60 per ten minutes. The window is now an hour, and the invariant is written down.

### Not Wirespec, and one library

The feed is a plain Spring controller. Wirespec models JSON request/response types; this serves
`text/calendar` to a calendar client and the SPA never calls it, so there is no generated client for
it to be the contract of. RFC 5545 is the contract, and it is held in `CalendarIcs` and its tests.
The **management** API is Wirespec-first as usual.

ICS is generated with **biweekly 0.6.8**, which is **unmaintained — its last release is January
2024**. We take it anyway: escaping, line folding and the property/parameter grammar are exactly the
tedious, get-it-subtly-wrong part, the format itself is frozen (RFC 5545 is from 2009), and the
dependency is confined to one file. If it ever has to go, `CalendarIcs` is what gets rewritten, and
`CalendarIcsTest` — which asserts on the emitted text, not on a biweekly object graph — is what
proves the replacement.

## Consequences

**A leaked calendar-link URL discloses one member's schedule for up to a year, to anyone holding it.**
That is the cost, and it is not hypothetical: the URL sits in plaintext in a Google or Apple calendar
account and travels in a query-less GET. It is bounded by what the feed carries (titles, times,
places, and that member's own answers — no other member appears), by the year, by the cap of three,
and by the member's own ability to see and delete every link they hold. It is not bounded by anything
an admin can do, which is the deliberate flip side of "no admin control".

**Membership is the live check, not the link.** A departed member's links keep existing and stop
working. That is the property that matters, and it costs a `team_members` read per fetch.

**HEAD is the same endpoint as GET, and has to be treated as one.** Spring routes a HEAD request to
the `@GetMapping` handler, so the tenant filter and the throttle both match the pair. Matching GET
alone left HEAD reaching the controller with no tenant bound — a 500 against `__no_tenant__` instead
of the undifferentiated 404, and, with a session cookie present, a token matched against the caller's
own team rather than the slug's.

**A member cannot be told why a link stopped working.** The undifferentiated 404 is a real usability
cost: a subscriber whose link expired sees exactly what a stranger with a wrong token sees, and their
calendar app will simply show the subscription as failing. The management list carries `expired`, so
the answer exists — just not at the feed.

**Rotating the encryption key makes existing links unlistable but not dead.** Lookup matches on the
hash, so every subscribed calendar keeps working while the management screen can no longer show the
URLs. That is the same asymmetry ADR-0025 accepted — and it is why `url` is nullable in the contract
and an undecryptable row is still *listed*: the row still counts toward the cap, so dropping it (or
failing the read) would leave the member unable to list, unable to delete and unable to create, with
nothing on screen to explain why.

**The cap is enforced by a read-then-write, so a member racing themselves can end up with four.**
Exactly the trade ADR-0025 made for the one-live-invite-link invariant, and for the same reason: the
cap is `count(*) <= 3`, which no index predicate can express, and buying it would mean inventing a
column for a constraint to bite on. The failure is bounded (one extra link, by the member's own double
click) and self-correcting (they can see and delete it), unlike the accumulation ADR-0025 was written
to stop, which was invisible and unbounded.

**The event deep link uses `teambalance.frontend-base-url`; the feed URL needs a new
`teambalance.api-base-url`.** In production the SPA and the API are separate origins, and it is the
API that serves the `.ics`.

## Out of scope

Push notifications and `VALARM`; filtering a feed by Event Type (a future refinement — deliberately
no placeholder column); renewal; admin management; and the frontend, which is a separate story.
