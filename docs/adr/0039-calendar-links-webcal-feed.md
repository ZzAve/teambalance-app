# ADR-0039: Calendar links — a per-member webcal feed, unauthenticated by design

- Status: Accepted
- Date: 2026-09-19
- Builds on: [ADR-0025](0025-invite-link-recoverable-at-rest.md) (the token storage pattern),
  [ADR-0024](0024-platform-admin-act-as.md) (what Act-as may not do),
  [ADR-0026](0026-member-team-profile-owned-by-the-tenant.md) (what belongs in a tenant schema)
- Numbering note: specified as ADR-0031, which `main` had already taken; renumbered again to 0039 when
  the branch caught up with `main`, which had since taken 0032 through 0038.

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

`calendar_links` is a tenant table (`db/tenant-migration/V014`), not a platform one. The schema that
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

`GET /api/calendar/{teamSlug}/{token}.ics`, session-less. When this was written the API had no Spring
Security: a controller was public exactly by not calling `requireCurrentUserId()`. Since ADR-0012 landed
(2026-10-10) the SecurityFilterChain requires a session by default and lists `/api/calendar/` as public,
next to `/api/auth/`. Its CSRF check applies only to mutating methods, so a cookie-less GET (or HEAD) is
not rejected.

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
timestamps, the event's own id as `UID` so a refetch updates entries in place, `LOCATION`, and a
`DESCRIPTION`/`URL` pointing back at the event page.

`DTSTAMP` and `LAST-MODIFIED` both carry the **event's revision time**. On an object with no `METHOD`,
RFC 5545 gives `DTSTAMP` the meaning "the date and time that the information associated with the
calendar component was last revised", and `LAST-MODIFIED` says the same in the property several
clients read instead — together they are how a calendar app decides that the component it already
holds under this `UID` is stale. Carrying the *creation* time instead, as the first cut did, told every
client that a rescheduled training was the version it already had.

That needed a revision time to exist. `events.updated_at` was in the schema from the baseline but the
JPA mapper wrote it as `created_at` on every save, so the column was dead; `Event` now carries
`updatedAt` and the scoped-edit write path stamps it from the injected clock. Only the occurrences the
edit actually touched are stamped — a detached series tail is moved, not revised, and bumping it would
churn every subscription for a split no subscriber can see.

**No `SEQUENCE`.** It counts revisions and nothing here counts them; a number synthesised from a
timestamp would be both a lie and an overflow waiting to happen. Its real job is iTIP scheduling
(`METHOD:REQUEST` with `ATTENDEE`s), which a published read-only feed is not.

`SUMMARY` carries the subscriber's own answer as a prefix — `✓`, `?`, `✗`, and nothing at all for an
unanswered event, because a bare title is the honest rendering of "you haven't answered". A prefix
rather than a colour or a category because it is the one decoration every client renders identically.
`TRANSP:TRANSPARENT` only for `ABSENT`: the member said they are not going, so it must not make them
look busy — while an *unanswered* event stays opaque, since "I haven't decided" is not "I am free".

**No attendees, no roster, no teammate names, no alarms.** The URL is a bearer credential held by
software we do not control; the less it discloses if it leaks, the better. Reminders are the
subscriber's own business and their calendar app already does them better.

### The refresh cadence tightens as an event approaches

`REFRESH-INTERVAL` (RFC 7986) and `X-PUBLISHED-TTL` (what Outlook and several others actually read)
are not fixed. They are banded by how far off the feed's soonest *future* event is:

| Next event | Cadence |
|---|---|
| three days or more away, or nothing at all | **12 hours** |
| inside three days | **6 hours** |
| inside 36 hours | **3 hours** |
| inside 12 hours | **1 hour** |

A flat interval has to be wrong in one direction. Hourly polling of a team whose next training is a
fortnight away is pure traffic for a calendar that will not change; twelve-hourly polling on the
morning of a match means a cancellation reaches people after they have already left for the hall.

Four bands rather than a formula, because a client honours this as a **hint** at best — Google in
particular polls on its own schedule regardless — so finer resolution would be precision nobody
consumes, while four named bands are four cases a test can state. The boundaries belong to the calmer
band (exactly three days away is still 12 hours), and only events still ahead count: the feed reaches
thirty days back, so its first entry is usually one that has already happened.

The hourly band is deliberately narrow. An event is only *about* to happen for the last half-day, and
that is the window where a cancellation has to land before people leave for the hall; a day out, three
hours is soon enough, and two days out six hours is. Spending an hourly poll on everything inside two
days — the first cut — bought nothing and cost twelve times the traffic in the quiet half of it.

There is no configuration for this. The bands are a product decision about how fresh a team's
schedule needs to be, not an operational dial.

### Caching and throttling

`ETag` over the response body with `If-None-Match`/304 and `Cache-Control: max-age=0, private` — a
client refetches on its own schedule whether or not anything changed, so the 304 is the point, and no
shared cache may hold one member's schedule. `DTSTAMP` is the event's `created_at` rather than the
wall clock, precisely so the ETag is stable; a `now()` there would defeat the whole mechanism.

Rate limited to 30/hour **per token** on the existing `RateLimitFilter` (ADR-0037), which now also
inspects GET and HEAD. That is thirty times the headroom over the tightest band above, which is the
right shape: the ceiling exists for a runaway client, not to enforce the cadence, so it only has to
sit far enough above honest traffic to never be reached by it. Per token rather than per IP because there is no session to key on and a whole
club behind one office NAT would otherwise share a bucket and knock each other's calendars offline.

Per token alone, though, bounds a *subscription* and not a *host*: the token comes from the path, so a
caller who never reuses one is handed a fresh full bucket every request. So the feed carries **two
ceilings**, and must satisfy both — the per-token one above, plus **600/hour per client IP**. The
per-IP one is deliberately loose: a whole club behind one office NAT shares it, and the feed asks to be
polled between twice and twenty-four times a day per subscription, so even fifty members on one address
sit an order of magnitude under it. It is not there to shape honest traffic; it is there so an
unauthenticated endpoint doing three indexed queries cannot be driven without limit, and so the bucket
store cannot be churned past its key cap from one source. The token is hashed into its bucket key
rather than used raw, because keys outlive the request in the limiter's cache and a live credential has
no business sitting there.

One further rule came out of this: **a refill period must not outlive the bucket store's eviction
window.** `RateLimiter` evicts idle buckets, and its comment — "a bucket unused that long has long
since refilled to full" — is only true while the window is at least the longest refill period. This is
the first policy to refill over anything longer than a minute, and at the old ten-minute window a
"60 per hour" limit silently enforced 60 per ten minutes. The window is now an hour, and the invariant
is written into the class.

### Not Wirespec, and one library

The feed is a plain Spring controller. Wirespec models JSON request/response types; this serves
`text/calendar` to a calendar client and the SPA never calls it, so there is no generated client for
it to be the contract of. RFC 5545 is the contract, and it is held in `CalendarIcs` and its tests.
The **management** API is Wirespec-first as usual.

ICS was first generated with **biweekly 0.6.8**, which is **unmaintained — its last release is January
2024**. We took it anyway: escaping, line folding and the property/parameter grammar are the tedious,
get-it-subtly-wrong part, the format itself is frozen (RFC 5545 is from 2009), and the dependency was
confined to one file, with `CalendarIcsTest` asserting on the emitted text rather than on a biweekly
object graph so that a replacement could be proven against it.

**Superseded by a hand-rolled writer (#395).** We used the write half of a round-trip library and a
tenth of its property vocabulary: 2 jars, 432 classes, about 12 of them called. `CalendarIcs` now holds
the encoding itself — `escapeText`, `utc`, `property` and `fold` — and biweekly (and vinnie with it) is
gone from the build. Diffed against biweekly's output for the same feed, the only difference is how
multibyte lines fold (below). The team name in `X-WR-CALNAME` keeps its commas and semicolons raw, as
biweekly wrote them, because clients and Python's `icalendar` read an X- value without unescaping it;
only a newline in it is written as `\n`, so a name cannot start a new line.

**Former deviation, now fixed: biweekly folded by character, not by octet.** RFC 5545 §3.1 says a line
SHOULD NOT exceed 75 **octets**; biweekly (through vinnie) counted characters, so the `✓`/`✗` prefix
plus any accented title pushed a folded line past the limit — 90 octets for a real Dutch event title.
It never split a codepoint, so no client was known to object. `fold` counts UTF-8 octets, gives each
continuation line 74 octets after its leading space, and only breaks between code points. The pair of
tests that pinned the deviation is replaced by one strict test — no line over 75 octets, for ASCII and
multibyte input alike, and every line decodes as UTF-8 — and `CalendarIcsEncodingTest` covers folding
at the boundary directly. The output was re-validated against Python's `icalendar` parser.

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

**The ETag now moves with the clock as well as with the data.** The cadence is a calendar property,
so it is inside the body the ETag hashes: crossing a band changes the ETag even though nothing about
the schedule did, and that fetch is a 200 rather than a 304. That is the correct behaviour — a client
that kept revalidating into an unchanged response would never learn the new cadence — and it costs
two extra full responses per event, against the polling it saves in every quiet week.

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

**The cap travels with the write, so it is an invariant rather than a hope.** `count(*) <= 3` is not
expressible as an index predicate, and ADR-0025 accepted exactly this read-then-write for the
one-live-invite-link rule. Here it was cheap to close without inventing a column for a constraint to
bite on: the cap is an argument to `CalendarLinkRepository.saveWithinCap`, so one port call is one
transaction, and the adapter serialises the count and the insert per member with a transaction-scoped
Postgres advisory lock. Eight simultaneous creates leave three links; without the lock they leave
eight, which is what `CalendarLinkCapIT` pins.

The lock is taken through the `EntityManager`, not a `JdbcTemplate`, and that detail is load-bearing:
`SchemaMultiTenantConnectionProvider` pulls Hibernate's connection straight from the pool to set its
`search_path`, so Hibernate and a `JdbcTemplate` in the same Spring transaction sit on *different*
physical connections — and a transaction-scoped lock on one guards nothing happening on the other.

**The event deep link uses `teambalance.frontend-base-url`; the feed URL needs a new
`teambalance.api-base-url`.** In production the SPA and the API are separate origins, and it is the
API that serves the `.ics`.

## Out of scope

Push notifications and `VALARM`; filtering a feed by Event Type (a future refinement — deliberately
no placeholder column); renewal; admin management; and the frontend, which is a separate story.
