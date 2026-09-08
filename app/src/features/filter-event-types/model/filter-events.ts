import type { Event } from '@shared/api/events'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { turnoutBucket, type TurnoutBucket } from './turnout'

/**
 * The events the filter lets through: OR within a dimension, AND across dimensions (ADR-0029 §2).
 *
 * Every argument is a membership set over a total partition of the list — every event has exactly
 * one type, exactly one `myState` and exactly one Turnout band — so a fully-selected group contains
 * every value an event can have and drops nothing. That is why "all chips on" needs no special case
 * here (ADR-0029 §1), the Turnout group included even on the teams it is not rendered for.
 */
export function filterEvents(
    events: Event[],
    activeTypeIds: Set<string>,
    activeStates: Set<AttendanceState>,
    activeTurnouts: Set<TurnoutBucket>,
): Event[] {
    return events.filter(
        (event) =>
            activeTypeIds.has(event.eventType.id) &&
            activeStates.has(event.myState) &&
            activeTurnouts.has(turnoutBucket(event.roster.state)),
    )
}
