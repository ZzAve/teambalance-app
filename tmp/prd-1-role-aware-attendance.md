## Problem Statement

When a team member opens an event today, they see a flat count — "4 going" — which is the
same information the group chat already gives them. They cannot tell whether the team is
actually *fielded*: is there a setter? enough middles? a libero? The position information
already exists on every member, but it is invisible in the app. The at-a-glance overview —
the single reason to open TeamBalance instead of scrolling the chat (see ADR-0004) — is
therefore not delivered.

## Solution

Surface each attendee's **Role** in the event view and add a **role-grouped breakdown** to
the attendance summary, so an event answers "who's coming, by position, and are the gaps
covered?" instantly on a phone. This is the v1 hook: the event view becomes worth opening
just to *look*, not only to respond.

## User Stories

1. As a team member, I want to see each attendee's role next to their name on an event, so that I know which positions are represented.
2. As a team member, I want the event view to show how many *attending* people fill each role (e.g. "1 Setter, 2 Outside Hitters, 1 Libero"), so that I can tell at a glance whether we have a full team.
3. As a team member, I want the events *list* card to show the attending-by-role split, so that I can scan upcoming events without opening each one.
4. As a captain, I want to spot at a glance that a position is unfilled for an upcoming match, so that I can arrange a substitute early.
5. As a team member, I want roles to be shown consistently wherever attendees appear (list card, event detail, attendance response), so that the vocabulary never drifts.
6. As a team member, I want the role breakdown to count only people who are actually attending, so that the "are we fielded?" answer isn't muddied by maybes and absentees.
7. As a team member, I want members who share a role to be aggregated into one count, so that the summary stays compact.
8. As a team member viewing an event nobody has responded to yet, I want the role breakdown to be empty rather than misleading, so that I trust the numbers.
9. As a team member, I want the existing state counts (going / maybe / absent / pending) to remain alongside the role breakdown, so that I keep the full picture.
10. As a team member on mobile, I want the role information to be readable on a small screen, so that the overview stays effortless.
11. As a developer, I want the role exposed through the existing events API contract, so that web and any future client share one source of truth.
12. As a team member, I want my own response flow to be unchanged by this, so that responding stays one tap.

## Implementation Decisions

- **No domain model change needed.** `TeamMember` already carries a single `role: String`
  (one role per member — ADR-0009). The separate `teamRole` field (admin/user) is a
  *permission* concept and MUST NOT be conflated with the position Role.
- **API contract (Wirespec `events.ws` / `attendances.ws`):**
  - `AttendanceEntry` gains `role: String`.
  - `AttendanceSummary` gains a role breakdown of **attending** members only:
    a list of `{ role: String, attending: Integer }`, ordered by count desc then role
    name. Maybe / absent / not-responded stay in the existing flat counts; they are not
    broken down by role in v1 (matches the design-doc example "8 attending: 1 Trainer,
    4 Setters, 3 Mids" and avoids a combinatorial summary).
  - The `SetAttendance` response (`attendances.ws`) includes `role`.
  - Contracts are edited in `.ws` and regenerated (`make wirespec`); generated files are
    never hand-edited.
- **Application layer (`AttendanceService`):** the attendee lookup returns role as well as
  display name (today it returns name only). The summary computation joins attending
  attendances to each member's role and aggregates counts. Prefer a batch member lookup to
  avoid an N+1 over attendees.
- **Port (`TeamMemberRepository`):** add a lookup that returns a member's `displayName` +
  `role` (or a batch variant for an event's attendees), rather than the current
  name-only `findDisplayName`.
- **Interfaces/mappers:** `EventController` maps `role` into each `AttendanceEntry` and the
  role breakdown into `AttendanceSummary` for both `GET /api/events` and
  `GET /api/events/{id}`; `AttendanceController` includes `role` in its response.
- **Frontend (FSD):** the `AttendanceEntry` type and MSW mocks already carry `role`. Add
  the role breakdown to the `AttendanceSummary` type + mock summaries; render attending-by-
  role chips on `EventCard` and group/label attendees by role in the event detail. The
  frontend consumes the Wirespec-generated client once the contract is regenerated.

## Testing Decisions

- **Good tests assert external behavior** — the JSON returned by the events API — not
  service internals or mapper wiring.
- **Seam:** the existing events REST API over **Testcontainers Postgres** (no DB mocks, per
  repo convention). This is the highest existing seam; reuse the current
  `EventController` / `AttendanceController` integration-test style.
- **Cases to cover:**
  - `GET /api/events/{id}` returns each attendance with a `role`.
  - `attendanceSummary` role breakdown reflects only ATTENDING members, aggregated by role,
    correctly ordered.
  - MAYBE / ABSENT / NOT_RESPONDED members are excluded from the role breakdown.
  - An event with no attendances yields an empty breakdown (and zeroed flat counts).
  - Members sharing a role are summed into one entry.
  - `GET /api/events` (list) includes the same breakdown per event.
- **Frontend:** an MSW-backed render test of the card + detail showing the role grouping, if
  component tests exist in the suite; otherwise note it as a manual check.
- **Prior art:** existing events/attendance controller integration tests.

## Out of Scope

- Audience subsets and the "Mine" filter (deferred — ADR-0009).
- Role *management* UI; roles are seeded back-office in v1.
- Multiple roles per member.
- Role breakdowns for non-attending states (only attending is broken down).
- Any change to authentication or who may edit attendance (covered by the auth PRD).

## Further Notes

- Reaffirms ADR-0002 (attendance is the core pillar) and ADR-0004 (the role-grouped
  overview is the v1 hook); implements ADR-0009 (one role per member, summary partitions by
  it).
- `teamRole` (admin/user) is intentionally distinct from the position `Role` — keep them
  separate in code and copy.
- Glossary term: **Role** (see CONTEXT.md).
