# ADR-0009: Attendance model v1 — roles in, audience-subsets deferred

- Status: Accepted
- Date: 2026-06-23

## Context

The role-based attendee summary is v1's load-bearing hook (ADR-0004), yet the frontend
mock model currently has **no roles** (attendances are just `userId + displayName +
state`, summary is plain counts). The design doc also describes an **audience** feature
(events can target a subset of the team) and configurable per-team roles. These needed a
concrete v1 cut.

## Decision

**Roles are in v1.**

- A **Role** is **team-configurable** (not hardcoded volleyball positions) — required by
  the multi-sport direction (ADR-0001).
- Each member has **exactly one role** (their primary position). The role summary is a
  clean partition that sums to the attendee headcount (e.g. "1 Trainer, 4 Setters, 3
  Mids").
- **Role management UI is deferred** (already Priority 3): in v1 roles are set up
  back-office (DB/API). The app *uses* roles; it doesn't yet let admins manage them.

**Audience-subsets are deferred.**

- In v1, **every event targets the whole team**. No subset selection, no per-event
  audience.
- The attendance summary (including "Not Responded" and the role breakdown) is therefore
  always computed over the **full team roster**.
- The "Mine" filter is trivial in v1 (everything is mine) and effectively deferred with
  audience.

## Consequences

- The frontend mock model and the API contract must **add a single `role` to each member
  / attendee** and group the summary by it. (Current mocks need updating — follow-up.)
- "Not Responded" denominator = the whole team, unambiguously.
- The audience concept stays in the long-term design (CONTEXT.md) but isn't built now;
  when added, the summary denominator switches from "team" to "audience".
- Keeps the differentiating view while removing the most intricate attendance logic from
  v1.
