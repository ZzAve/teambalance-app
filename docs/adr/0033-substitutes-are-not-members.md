# ADR-0033: Substitutes are not Members

- Status: Accepted
- Date: 2026-09-29
- Relates to: [ADR-0009](0009-attendance-model-roles-in-audience-deferred.md) (Event Attendance is
  derived from the current Roster), [ADR-0003](0003-trust-based-attendance-editing.md) (anyone may
  set anyone's attendance)

## Context

Teams call in people from outside the Team for a single match or training. The first description
of the feature was "a member with a different type". A Member, however, has a **Role**, sits on the
**Roster**, is always tied to an account, and appears as Not Responded on every Event. None of that
holds for someone who is called in occasionally and never logs in.

## Decision

A **Substitute** is its own concept: a person on a Team-kept list, with a name and at most one
**Position**, and no account, no Role, and no place on the Roster. A Substitute appears on an Event
only once a Member adds them. From then on they carry an Attendance State (Attending, Maybe, Absent),
so "asked" and "confirmed" stay distinguishable. An attending Substitute fills a spot in the **Event
Roster** exactly like a Member. Substitutes never count toward the expected total, and are never
Not Responded.

Any Member may add a Substitute to an Event, set their state, or create a new Substitute (name plus
optional Position) while doing so. Renaming, changing a Position, and removing Substitutes from the
list are Admin actions. Removing a Substitute removes them from every Event, past ones included, the
same as a departed Member under ADR-0009. The removal dialog says so. There is no restore.

## Considered options

**Member with a type.** Rejected. Every rule stated in terms of Members (Roster, Event Attendance,
the summary denominator, Bulk Attend, Money Pool, Role) would need a "except Substitutes" clause, and
a Member row requires an account.

**A Substitute may have an account and respond for themselves.** Rejected for now. It means a
signed-in person who can see one Team's Event without being a Member of it, which is a new
authorization path across tenants (ADR-0023 resolves the Active Team from membership). Promoting a
Substitute to a Member is a possible follow-up.

**Per-event names instead of a list.** Rejected. Teams call the same few people, and a list lets
their Position count toward the Event Roster.

**Keep a removed Substitute on past Events.** Considered and dropped in favour of matching the
Member rule, so both kinds of people follow one rule.

## Consequences

Attendance no longer always belongs to an account: an attendance record belongs to either a Member
or a Substitute.
