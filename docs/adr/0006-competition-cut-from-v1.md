# ADR-0006: Competition (Nevobo standings) cut from v1

- Status: Accepted
- Date: 2026-06-23

## Context

The design doc lists "View league standings (Nevobo integration)" as Priority 1. But it
is neither attendance nor money (the two pillars), it is specific to the Dutch volleyball
federation, and it contradicts the multi-sport "built to grow" direction (ADR-0001). It
appears to have inherited Priority 1 from the old app rather than from v1's needs.

## Decision

**Cut Competition from v1.** v1's feature surface is **attendance + money pool only**.
Reintroduce league standings later as an **optional, per-team, pluggable integration** a
team can enable — not core, and ideally sport-agnostic (any league link), with Nevobo as
one implementation.

## Consequences

- v1 scope shrinks; effort concentrates on the heart (ADR-0002, ADR-0004).
- No Nevobo client in v1.
- The "Competition" bounded context still exists in the long-term design but is not built
  now.
- Honors the multi-sport direction by refusing to bake a volleyball-only feature into the
  core.
