# ADR-0014: Recurring events — materialized batch, split-on-edit, season-bounded

- Status: Accepted
- Date: 2026-07-26

## Context

Teams need to schedule repeating events — overwhelmingly "weekly training on these
weekdays for the season". The rebuild design and `CONTEXT.md` already call for recurring
events "created in a batch", and the `events` table ships a stub `recurring_group UUID`
column left for exactly this. We want UX familiar from Outlook/Google Calendar (pick a
frequency + weekdays + a range, preview, then edit/delete with this / this-and-following /
all scopes) — but not necessarily their storage internals. Attendance is fanned out one
row per member per event, so occurrences must be **concrete rows**, not virtual expansions
of a rule.

## Decision

Several linked decisions:

1. **Materialized batch, not RRULE.** Creating a recurring event generates all N concrete
   `events` rows up front, each linked by a shared `recurring_group` UUID. Every occurrence
   is an ordinary, independently-editable event; attendance fans out per row as today.
   **No recurrence rule is stored** — series identity is *row membership in a group*, the
   single source of truth. The frequency/weekday selection is used only at generation time
   and then discarded.

2. **Bounded expressiveness.** Frequency is **weekly or bi-weekly**; one or more
   **weekdays**; a required **start → end date range**. No monthly / day-of-month /
   arbitrary-interval rules, and no count-based or never-ending series (an infinite series
   cannot be materialized). Generation is **capped at 200** occurrences.

3. **Season bound (per team).** A per-team, tenant-schema **season** (`season_start`,
   `season_end`), admin-configurable. When a season is set, event writes whose start falls
   outside `[season_start, season_end]` are **hard-rejected** — single and recurring events
   alike. Validation fires on **create** always, and on **update only when the start is
   being moved** — unchanged starts are **grandfathered**, so an event already outside the
   window (e.g. after the window was shrunk) stays editable. Changing the season window
   **only warns** that existing events may fall outside it; it never deletes or
   retro-invalidates. The season also supplies default dates to the recurring create form.

4. **Level-3 edit/delete via splitting.** Edits and deletes carry a **scope** —
   *This event* / *This and following* / *All events*. Because there is no stored rule,
   every operation is row-reassignment + field updates:
   - **Edit / This event** → the row detaches (`group = null`); rows *after* it get a new
     group; rows *before* keep the original group. Three disconnected things.
   - **Edit / This and following** → rows before keep the original group; this row + all
     following get a new group, edit applied to all of them. Two disconnected series.
   - **Edit / All** → apply to every row in the group; group unchanged.
   - **Delete** removes the row(s) in scope and **never splits** (a delete creates no
     divergent occurrence).

   Bulk scopes (following / all) propagate **every field except each occurrence's calendar
   date** — occurrences keep their own dates; a changed time-of-day *does* propagate. Only
   the *This event* scope may move a single occurrence's date.

   **Consequence, accepted deliberately:** any partial edit permanently fragments the
   series — once a single occurrence is edited, "All events" can no longer reach the whole
   season as one unit. This diverges from Outlook (where a detached occurrence still belongs
   to its parent series) in exchange for a model with **no exception-tracking**.

5. **API shape.** `POST /api/recurring-events` → `201 RecurringEventSeries
   { recurringGroup, events[] }` (creation only — its response cardinality differs from
   single create, so it is a separate resource). Lifecycle edits go through the existing
   `PUT/DELETE /api/events/{id}` with an added `scope` query param
   (`THIS | THIS_AND_FOLLOWING | ALL`, default `THIS`); `UpdateEvent`'s success type becomes
   `EventList` (a bulk edit touches many rows). Season via `GET/PUT /api/team/season`.

## Consequences

- No RRULE/iCal engine, no virtual-occurrence expansion, no exception table — the concrete
  rows and their group id are the whole model.
- Attendance seeding is unchanged: the per-member NOT_RESPONDED fan-out runs per generated
  occurrence.
- There is no "extend the series" or "change the pattern" — those are delete + recreate.
- Partial edits fragment series irreversibly (Decision 4); this is intended.
- Storing the season per tenant means write-time validation needs no cross-schema lookup;
  teams set seasons independently.
- The season control ships on a minimal **Team Settings** page; the richer "Team" hub that
  will eventually host it is deferred to issue #107.
- Built in three phases — (1) season foundation + validation, (2) recurring creation,
  (3) series edit/delete — tracked in the epic issue #108.
- UX: a guided step wizard with a live month-calendar preview (season band + highlighted
  occurrences) and persistent per-step context; modification via a scope prompt plus a
  visual affected-preview.
