import type { Event, RosterState } from '@shared/api/events'

/**
 * Turnout — the member-facing banding of the seven Roster States into four legible chips
 * (CONTEXT.md, ADR-0029 §4), in the order the filter offers them: most short of people first.
 */
export type TurnoutBucket = 'missing-position' | 'spots-open' | 'covered' | 'no-target'

export const ALL_TURNOUT_BUCKETS: TurnoutBucket[] = [
    'missing-position',
    'spots-open',
    'covered',
    'no-target',
]

/**
 * State name in, band out — and deliberately nothing more. The backend owns the verdict (#219) and
 * `entities/event/lib/roster-view.ts` says why a second status implementation on the client is off
 * limits: it would be free to drift from the tested one. This table only re-words what arrived.
 *
 * The first three bands follow the card's own `RosterTone` split, so the filter reads the states the
 * way the card already does. `no-target` exists to complete the partition (ADR-0029 §1) rather than
 * because anyone will filter on it: a tally has nothing to fall short of and a social has no roster,
 * and neither may be dressed up as a verdict.
 *
 * Typed as a total `Record`, so a state added to the contract fails the typecheck here and the
 * exhaustive unit test next door — never silently falls through to no band.
 */
export const TURNOUT_BY_STATE: Record<RosterState, TurnoutBucket> = {
    CRITICAL: 'missing-position',
    SPOTS_OPEN: 'spots-open',
    HEADCOUNT_SHORT: 'spots-open',
    LINEUP_SET: 'covered',
    HEADCOUNT_FULL: 'covered',
    TALLY_ONLY: 'no-target',
    OFF: 'no-target',
}

export function turnoutBucket(state: RosterState): TurnoutBucket {
    return TURNOUT_BY_STATE[state]
}

/**
 * Whether the Turnout group is worth rendering at all (ADR-0029 §5).
 *
 * A team that sets no targets gets `TALLY_ONLY` on every event, so the group would be four chips
 * that provably filter nothing. Read off the *unfiltered* list, so narrowing another dimension can
 * never make the group vanish underneath a selection that is still in effect.
 */
export function spansMultipleTurnoutBuckets(events: Event[]): boolean {
    const buckets = new Set(events.map((event) => turnoutBucket(event.roster.state)))
    return buckets.size >= 2
}
