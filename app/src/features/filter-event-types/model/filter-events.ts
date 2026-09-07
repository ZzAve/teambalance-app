import type { Event } from '@shared/api/events'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'

/**
 * The events the filter lets through: OR within a dimension, AND across dimensions (ADR-0029 §2).
 *
 * Both arguments are membership sets over a total partition of the list — every event has exactly
 * one type and exactly one `myState` — so a fully-selected group contains every value an event can
 * have and drops nothing. That is why "all chips on" needs no special case here (ADR-0029 §1).
 */
export function filterEvents(
    events: Event[],
    activeTypeIds: Set<string>,
    activeStates: Set<AttendanceState>,
): Event[] {
    return events.filter(
        (event) => activeTypeIds.has(event.eventType.id) && activeStates.has(event.myState),
    )
}
