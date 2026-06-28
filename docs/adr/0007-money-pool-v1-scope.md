# ADR-0007: Money pool v1 scope — read + top-up, Bunq-only, optional per team

- Status: Accepted
- Date: 2026-06-23

## Context

The money pool is secondary to attendance (ADR-0002) but still in v1. "Secondary" needed
a concrete cut: how thin, and what about teams without Bunq? ADR-0001 already mandates a
Bunq **port** abstraction even with a single implementation.

## Decision

**v1 money pool = the give-and-see loop:**

- Live **balance + Beer Counter + transaction history**, read directly from Bunq.
- **Top-up** flow: preset (€10/€20/€50) + custom amount → bunq.me deep link (mobile-first,
  no QR).
- **Deferred:** Hall of Fame / Hall of Shame rankings, transaction-exclusion filtering.

**Bunq-only, and the pool is optional per team:**

- Build only the Bunq adapter behind the port. No manual/other-bank pool in v1.
- A team without Bunq simply has **no money pool** — attendance still delivers full value
  (ADR-0002). The pool UI is hidden for such teams.

## Consequences

- One adapter (Bunq) behind the money port; manual/other-bank modes are future work.
- v1 pool work is bounded: read integration + a deep-link top-up, no ranking computation.
- Rankings (Toppers/Floppers) and exclusion filtering are explicitly v1.1+.
- Reinforces that the pool is a bonus, not a gate, for adopting TeamBalance.
