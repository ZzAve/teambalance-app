# ADR-0040: Calendar link personalisation — which answers a feed carries, and how it is shown

- Status: Accepted
- Date: 2026-10-10
- Amends: [ADR-0039](0039-calendar-links-webcal-feed.md) (the feed's contents and rendering). ADR-0039 is
  otherwise unchanged.

## Context

ADR-0039 gives every **Calendar link** the same feed: every Event from 30 days back, each title
prefixed with the subscriber's own answer, under a calendar named after the Team. That fits the member
subscribing on their own phone. It does not fit the second most common request: sharing a link with a
partner or family member who wants to know when the member is out at volleyball. That person wants
only the events the member is going to, without the `✓`/`?`/`✗` bookkeeping, under a calendar name
that does not look like the member's own copy of the team calendar.

## Decision

### Three options on a link

A link carries, besides its label:

- **`attendanceStates`** — a non-empty subset of `ATTENDING`, `MAYBE`, `ABSENT`, `NOT_RESPONDED`. The
  feed includes an Event if and only if the subscriber's own answer to it is in the set, an unanswered
  Event counting as `NOT_RESPONDED`. The 30-day lookback is unchanged. Archived Event Types are never
  filtered out.
- **`showAttendancePrefix`** — whether `SUMMARY` wears the `✓ ` / `? ` / `✗ ` prefix.
- **`calendarNameSuffix`** — optional, trimmed, 1 to 30 characters; blank is none. `X-WR-CALNAME` is the
  Team name, or `{team} · {suffix}` when set.

Nothing else in the feed changes with the options: `TRANSP:TRANSPARENT` still marks only `ABSENT`
events, and `DESCRIPTION` and `URL` always link back to the event page. The ETag is still a hash of
the body, so two links with different options on the same events carry different ETags.

### Presets are UI defaults, not stored

The create form offers **Me** (all four states, prefix on, no suffix), **Partner** (`ATTENDING` only,
prefix off, suffix "Partner", and the label "Partner" when the label is still empty) and **Custom**
(anything else). The server stores only the options; it has no notion of a preset. Which preset a set
of options matches is a pure frontend function: Me when all four states are included with the prefix
on, Partner when only `ATTENDING` is included with the prefix off, Custom otherwise. The suffix and
the label take no part, so a Partner link named after a specific person is still a Partner link.

Storing a preset name would make it a second source of truth beside the options, and every later
change to what "Partner" means would have to decide what to do with links already stored under it.

### Validation

An empty `attendanceStates` is a 400: a link that can serve nothing is a mistake, not a choice. A
suffix over 30 characters is a 400. Every option is optional in the request: an absent
`attendanceStates` means all four, an absent `showAttendancePrefix` means on, so a body of just
`{ label }` keeps creating exactly the link it created before.

### Storage

`V016__calendar_link_options.sql` adds `show_attendance_prefix BOOLEAN NOT NULL DEFAULT true` and
`calendar_name_suffix VARCHAR(30)` to `calendar_links`, and a `calendar_link_attendance_states
(link_id, state)` join table with a cascading foreign key — the same shape as
`event_type_position_targets`, because the schema has no array or `jsonb` columns and this is not the
place to introduce one. The migration gives every existing link all four states, the prefix on and no
suffix, so every feed subscribed before this release stays byte-identical.

## Consequences

**A partner can be given their own link** without seeing the member's maybes, absences or unanswered
events. It is still one of the member's three links and still a bearer credential; the options narrow
what it discloses, they do not change what it is.

**The subscriber lookup now returns the link, not just its owner**, because the feed needs the link's
options. Membership is still checked on every fetch exactly as before.

**A link's options cannot be changed after creation yet.** Editing, and filtering by Event Type,
follow in part 2.
