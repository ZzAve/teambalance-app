# ADR-0002: Attendance is the core pillar

- Status: Accepted
- Date: 2026-06-23

## Context

The rebuild design doc gives both pillars — **event attendance** and the **money pool**
— equal "Priority 1" billing. But "build for our teams first" (ADR-0001) means focus is
finite; one loop has to be the magnet that earns daily opens.

## Decision

**Attendance is the heart of the app.** The event/attendance loop is polished first and
hardest. The money pool is genuinely valuable but secondary in priority and frequency.

Rationale:
- Attendance is used multiple times per week, every week — the highest-frequency job.
- It replaces the most annoying group-chat churn ("who's coming Saturday?").
- The money pool is roughly monthly; a team with no pool still gets full value from
  attendance.

## Consequences

- Build, test, and design-polish effort concentrates on events + the Attendance Toggle.
- The money pool can ship as a solid-but-simpler v1 and improve later.
- "Done" for a first usable release is defined primarily by the attendance loop being
  delightful, not by money-pool completeness.
