# ADR-0005: Clean start — no data migration from the old app

- Status: Accepted
- Date: 2026-06-23

## Context

The owner's teams already use the old TeamBalance: real events, attendance, and a
live Bunq-backed money pool with transaction history. The rebuild design says the old
app stays running, but never specified how teams move over.

## Decision

**The new app starts empty. No data migration is built.**

- Members re-onboard fresh; events and attendance start from zero (events age out
  anyway, so historical events have little ongoing value).
- The **Bunq account is the source of truth for the pool balance**, so the money pool
  reads the live balance/transactions directly from Bunq — no historical import needed.
- The old app can remain available read-only for anyone who wants to look back.

## Consequences

- No old-schema → new-schema migration tooling — removes a large chunk of work and
  unblocks v1.
- Old event/attendance history is **not** carried over (accepted loss).
- The money pool's correctness depends on the Bunq integration reading live data, not on
  a migrated ledger.
- Reinforces the pilot-friendly posture of ADR-0001 (a team can simply start fresh).
