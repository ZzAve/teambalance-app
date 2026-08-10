# ADR-0020: Bulk Attend — non-destructive, future-only, Attending-only batch-create

- Status: Accepted
- Date: 2026-08-10

## Context

Members with a standing commitment ("I'm at every training this season") face a wall of
per-event **Attendance Toggle** taps. Because recurring events are **materialized up front
as a finite batch with no stored rule** ([ADR-0014](0014-recurring-events-materialized-batch-split-season.md)),
the whole season's occurrences already exist as concrete events the moment they're created —
so a single bulk fill over those existing occurrences delivers "set it for the season" without
inventing a persistent attendance-default concept.

We want the lowest-complexity, highest-convenience shortcut that serves this, re-tappable as
new/edited events appear, without re-opening the "don't store the rule" decision and without
the trust-based-editing footgun of clobbering deliberate answers. See **Bulk Attend** in
`CONTEXT.md`.

## Decision

1. **One-time fill, not a stored rule.** Bulk Attend is an *action* over already-existing
   occurrences, never a persistent "I attend this series" default. Nothing new is stored;
   ADR-0014's "the rule is not stored" stands. It stays useful over time only because it is a
   **persistent, re-tappable button** — new blanks appear, you tap again.

2. **Non-destructive / create-only.** It sets state only for events the member is currently
   **Not Responded** on. Since `NOT_RESPONDED` is the *absence* of an `attendances` row
   (`UNIQUE(event_id, user_id)`, resolved by outer-joining the roster — see ADR-0009), "only
   touch blanks" means the operation can **only ever INSERT, never UPDATE**. This is what makes
   the button safe to re-tap: a manually-set Absent (injury, holiday) is a real row, so it is
   never overwritten.

3. **Attending-only.** No Maybe/Absent picker. Because the action is non-destructive, "bulk
   Maybe" over blanks is incoherent and "bulk Absent" mostly matters for events you've *already*
   answered (which the non-destructive rule won't touch) — that's a bulk-*overwrite* need,
   deliberately cut.

4. **Future-only.** The server creates a row only when `startTime >= now` (aligned with how the
   event list defines "upcoming"); past events are skipped. Enforced server-side *and* by the
   UI (button lives only on the upcoming tab).

5. **Subset = "currently shown".** The action operates on the events the client currently lists
   (upcoming tab + active **Event Type** filter pills). The existing pills *are* the subset
   selector — filter to Training, Bulk Attend the trainings. No series-level (per-weekday)
   scoping in v1; a standing commitment is assumed to be "all trainings", not "Tuesdays only".

6. **Contract — a top-level batch resource with a reciprocal delete.**
   - `POST /api/attendances/batch` `{ userId, eventIds, state }` → returns the ids **actually
     created** (a race may have filled one since the list loaded); client invalidates its events
     query to refresh summaries.
   - `DELETE /api/attendances/batch` `{ userId, eventIds }` → Undo, deletes those rows.
   - Server guard is the *whole* server job: create a row **iff** no response row exists **and**
     `startTime >= now`; else skip. **No self-only check** — the endpoint stays trust-based per
     [ADR-0003](0003-trust-based-attendance-editing.md); self-only is a UI-only constraint.

## Considered options

- **Persistent attendance default** (auto-answer future occurrences) — rejected: a brand-new
  first-class concept that re-opens ADR-0014, made unnecessary by the season being materialized
  up front.
- **Overwrite / bulk-set-any-state** (scenario "I'll be away for 3 weeks → mark Absent") —
  rejected for v1: destructive, and it breaks the safe-to-re-tap property.
- **Client loops the existing `PUT`** — rejected: N round-trips, not atomic, and it can't enforce
  the non-destructive/future guards race-safely.
- **Server resolves a filter** (`{ types, upcoming }`) instead of explicit ids — rejected:
  "currently shown" is a client notion (the pills live there); duplicating the filter server-side
  co-owns UI truth. The client names the exact ids; the server stays a dumb applicator.
- **Reuse `POST /batch` for Undo** — impossible: the non-destructive guard would skip the now-
  `ATTENDING` rows Undo needs to reach. Undo is a separate `DELETE` (deleting freshly-created
  rows has no guard conflict and is idempotent).
- **Nest under `/events/{eventId}`** — rejected: the operation spans events, so there is no single
  event for the path. `attendances`, not `event-attendances` (the latter is reserved in the
  glossary for the per-event aggregate).

## Consequences

- Two homes for the attendance write: event-nested `PUT` for the single upsert, top-level
  `POST/DELETE /api/attendances/batch` for the batch — honest, because only the single op is
  addressed by one event.
- UI: an **"Attend N"** button (N = shown, unanswered, future count) that **hides at zero**; the
  count is the pre-tap confirmation, a toast offers Undo. No modal.
- The contract technically permits bulk-filling another member's blanks (trust-based); there is no
  UI for it, so it's self-only in practice.
- Per-weekday standing commitments (Tuesday-but-not-Thursday) are not expressible in v1 — they'd
  need series-level scoping, deferred until asked for.
