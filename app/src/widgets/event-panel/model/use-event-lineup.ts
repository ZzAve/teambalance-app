import { useState } from 'react'
import type { Event } from '@entities/event/api/events'
import {
    useRemoveSubstituteAttendance,
    useSetSubstituteAttendance,
    usePendingSubstituteEvents,
} from '@entities/substitute/api/substitutes'
import type { PositionRef } from '@entities/event/lib/lineup'
import type { SubstituteState } from '@features/call-in-substitutes/ui/SubstitutesBlock'

/**
 * The Substitute side of the lineup panel, shared by the events list and the event page: the two
 * Substitute writes, the pending flag and the one Substitute picker, aimed at one event and, from an
 * open spot, one Position (ADR-0033). The target outlives `open` so the sheet can animate out.
 * Attendance answers stay with the caller, because the list holds an optimistic answer and the
 * event page raises the cross-member Undo toast.
 *
 * `events` is where the picker's target is looked up.
 */
export function useEventLineup(events: readonly Event[] | undefined) {
    const [target, setTarget] = useState<{eventId: string, position: PositionRef | null, open: boolean} | null>(null)
    const setSubstituteAttendance = useSetSubstituteAttendance()
    const removeSubstituteAttendance = useRemoveSubstituteAttendance()
    const pendingSubstituteEvents = usePendingSubstituteEvents()

    return {
        picker: {
            open: target?.open ?? false,
            event: events?.find(e => e.id === target?.eventId) ?? null,
            position: target?.position,
            onClose: () => setTarget(current => current && {...current, open: false}),
        },
        lineupHandlers: (eventId: string) => ({
            onCallInSubstitutes: (position: PositionRef | null) => setTarget({eventId, position, open: true}),
            onSetSubstituteState: (substituteId: string, state: SubstituteState) =>
                setSubstituteAttendance.mutate({eventId, substituteId, state}),
            onTakeOffSubstitute: (substituteId: string) =>
                removeSubstituteAttendance.mutate({eventId, substituteId}),
            substitutePending: pendingSubstituteEvents.includes(eventId),
        }),
    }
}
