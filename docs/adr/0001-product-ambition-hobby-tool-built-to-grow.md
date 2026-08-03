# ADR-0001: Product ambition — hobby tool, built to grow

- Status: Accepted (self-service onboarding amended by [ADR-0019](0019-self-service-team-onboarding.md))
- Date: 2026-06-23

## Context

TeamBalance began as a hobby project for two volleyball teams at Tovo Utrecht.
The rebuild's stated aspiration is to "open it up: any sport, any team, self-service."
These are two materially different products — a polished tool for known teams vs. a
multi-tenant SaaS for strangers — and the choice cascades into authentication,
onboarding, the Bunq dependency, and how much multitenancy machinery is load-bearing.

## Decision

Build **for the owner's own teams first**, but make **no decisions that would have to
be ripped out** to open it up later. A deliberate middle path:

- Build for the owner's teams; no hardcoded team/sport assumptions.
- Abstract external dependencies (e.g. Bunq) behind ports even when there is only one
  implementation.
- Defer self-service onboarding, but keep the schema and auth model ready for it.

## Consequences

- Success in the near term = the owner's teammates actually use it weekly.
- Self-service signup / team-creation UX is **deferred**, not designed out.
- Multitenancy is future-proofing now, not a marketed feature.
- Avoids both over-engineering a SaaS nobody uses yet and painting into a corner.
