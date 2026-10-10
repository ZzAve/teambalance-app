# ADR-0040: Calendar link personalisation — which answers a feed carries, and how it is shown

- Status: Accepted
- Date: 2026-10-10
- Amends: [ADR-0039](0039-calendar-links-webcal-feed.md) (the feed's contents and rendering, and its
  "delete is the only other action": links are now editable). ADR-0039 is otherwise unchanged.

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
  filtered out. The refresh cadence is banded on the Team's next event, not the next one the link
  shows: an unanswered training tomorrow that the member may yet accept has to reach a Partner
  calendar within the hour, not twelve hours later.
- **`showAttendancePrefix`** — whether `SUMMARY` wears the `✓ ` / `? ` / `✗ ` prefix.
- **`calendarNameSuffix`** — optional, trimmed, 1 to 30 characters; blank is none. `X-WR-CALNAME` is the
  Team name, or `{team} · {suffix}` when set.

Nothing else in the feed changes with the options: `TRANSP:TRANSPARENT` still marks only `ABSENT`
events, and `DESCRIPTION` and `URL` always link back to the event page. The ETag is still a hash of
the body, so two links with different options on the same events carry different ETags.

### Filtering by Event Type

A link also carries **`eventTypeIds`**: absent means every Event Type, including types the team
creates after the link; present means a non-empty, explicit allowlist, so a type created later is left
out until the member edits the link. The feed includes an Event if and only if its type is allowed
*and* the subscriber's answer is in `attendanceStates`.

Absent rather than "every type that existed at the time" because that is what a member choosing
nothing means: a team that adds "Beach" in June should not need every Me link edited to see it. An
explicit list is the opposite promise, a member who picked Training and Match asked for those two.

**Archived types are never filtered out.** As long as the app shows events of an archived type,
every feed does too: archiving a type that an explicit list names does not drop its events from that
link, and archiving one does not drop it from a link with no list. The create form offers the active
types; an edit additionally offers the archived ones the link already lists, so saving does not
silently drop them. A row's summary names an archived type as "Training (archived)", with no further
hint.

### Editing a link

`PUT /api/calendar-links/{id}` takes the same body as create and replaces the label and all four
options, with the same defaults for an absent field. The token, so the URL, and `createdAt`,
`expiresAt` and the link's slot under the cap stay as they were. Owner-only, with the same 404 for
"not yours" and "not there" as delete, and refused under Act-as like every other calendar-link
endpoint. The edit form is the create form, opened in the link's row, starting at the preset the link
matches.

An expired link may be edited on the server: there is nothing to protect by refusing it. The UI does
not offer Edit on an expired row, since an expired link serves nothing.

Editing exists because the alternative is worse for the person it is for. A member with a Me link
and a Partner link already uses two of their three slots, so changing a filter by creating a new link
and deleting the old one needs the third slot free, and it hands the partner a new URL: their phone
has to be re-subscribed for a change the member made. With an edit the feed changes in place on the
next refresh, and the URL the partner holds keeps working.

### Presets are UI defaults, not stored

The create form offers **Me** (all four states, prefix on, no suffix), **Partner** (`ATTENDING` only,
prefix off, suffix "Partner", and the label "Partner" when the label is still empty) and **Custom**
(anything else). The server stores only the options; it has no notion of a preset. Which preset a set
of options matches is a pure frontend function: Me when all four states are included with the prefix
on, Partner when only `ATTENDING` is included with the prefix off, Custom otherwise. Both Me and
Partner serve every type, so an explicit `eventTypeIds` is Custom. The suffix and
the label take no part, so a Partner link named after a specific person is still a Partner link.

Storing a preset name would make it a second source of truth beside the options, and every later
change to what "Partner" means would have to decide what to do with links already stored under it.

### Validation

An empty `attendanceStates` is a 400: a link that can serve nothing is a mistake, not a choice. A
suffix over 30 characters is a 400. So is an empty `eventTypeIds`, for the same reason as an empty
`attendanceStates`, and so is a type id the team does not have. Every option is optional in the request: an absent
`attendanceStates` means all four, an absent `showAttendancePrefix` means on, so a body of just
`{ label }` keeps creating exactly the link it created before.

### Storage

`V016__calendar_link_options.sql` adds `show_attendance_prefix BOOLEAN NOT NULL DEFAULT true` and
`calendar_name_suffix VARCHAR(30)` to `calendar_links`, and a `calendar_link_attendance_states
(link_id, state)` join table with a cascading foreign key — the same shape as
`event_type_position_targets`, because the schema has no array or `jsonb` columns and this is not the
place to introduce one. The migration gives every existing link all four states, the prefix on and no
suffix, so every feed subscribed before this release stays byte-identical.

`V017__calendar_link_event_types.sql` adds `calendar_link_event_types (link_id, event_type_id)`, with
a cascading foreign key from the link and a plain one to `event_types(id)`. No rows means every type,
so existing links need no backfill. There is no cascade from the type side: types are archived, never
deleted, and a delete that reached this table would be a bug to refuse.

## Consequences

**A partner can be given their own link** without seeing the member's maybes, absences or unanswered
events. It is still one of the member's three links and still a bearer credential; the options narrow
what it discloses, they do not change what it is.

**The subscriber lookup now returns the link, not just its owner**, because the feed needs the link's
options. Membership is still checked on every fetch exactly as before.

**A link's options can change after it is subscribed.** The member who edits a Partner link changes
what the partner's calendar shows on its next refresh, without telling them. That is the point of
editing, and the reason the label and the summary line say what each link serves.

**An explicit type list goes stale when the team adds a type.** That is the promise an explicit list
makes; the form says so under the type chips, and the member widens it with an edit.
