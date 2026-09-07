import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { ALL_ATTENDANCE_STATES } from './attendance-states'

interface EmptyMessageInput {
    /** A hero is on screen, so the page is not empty — only the list beneath it is. */
    hasHero: boolean
    showPast: boolean
    activeTypeIds: Set<string>
    allTypeIds: string[]
    activeStates: Set<AttendanceState>
}

/**
 * What the events list says when it has nothing to show.
 *
 * With three filter dimensions the specific messages are combinatorial, so only a *single* narrowed
 * dimension earns one; anything else falls back to the generic line, which is true whatever the
 * combination. The answer dimension gets its specific line only for the "Not responded" selection —
 * it is the one whose emptiness has a plain-English meaning, and the wrong-status version of it
 * ("Nothing needs your answer" after filtering to `Going`) would be a lie.
 */
export function emptyEventsMessage({
    hasHero,
    showPast,
    activeTypeIds,
    allTypeIds,
    activeStates,
}: EmptyMessageInput): string {
    if (hasHero) return 'Nothing else coming up.'

    const typeFiltered = activeTypeIds.size < allTypeIds.length
    const stateFiltered = activeStates.size < ALL_ATTENDANCE_STATES.length

    if (!typeFiltered && !stateFiltered) return showPast ? 'No events yet.' : 'No upcoming events.'
    if (typeFiltered && !stateFiltered) return 'No events for this type.'
    if (!typeFiltered && activeStates.size === 1 && activeStates.has('NOT_RESPONDED')) {
        return 'Nothing needs your answer.'
    }
    return 'No events match these filters.'
}
