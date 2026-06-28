# ADR-0003: Trust-based attendance editing — convenience now, tighten later

- Status: Accepted
- Date: 2026-06-23

## Context

The design doc says "any team member can update anyone's attendance (trust-based, like
the money pool)." This is unusual — most apps let you edit only your own RSVP. It is
lovely and low-friction for a tight-knit team, but it conflicts with the "built to grow"
posture (ADR-0001): open/larger teams won't all trust each other.

## Decision

Keep **anyone-edits-anyone** as the **default behaviour for now**, but treat it as a
**convenience, not a sacred product principle**. Specifically:

- Model an Attendance change with an explicit **actor** ("changed by") from day one, so
  a permission layer and audit can be added later without reworking the data model.
- When teams get bigger or the app opens to strangers, introduce "edit own only" +
  admin override without a migration of intent.

## Consequences

- Near term: no per-field ownership or locking; friction stays minimal for known teams.
- The data model records who changed an attendance, even though nothing restricts it yet.
- Trust is a **default**, not a guarantee — explicitly distinct from the money pool,
  where trust is more load-bearing.
- Avoids over-investing in a permission system before there's a team that needs it.
