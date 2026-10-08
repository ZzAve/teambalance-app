import type { Event } from '@entities/event/api/events'
import type { AttendanceState } from '@entities/attendance/model/attendance-state'
import { selectHeroEvent } from '@entities/event/lib/next-event'
import { reconcileTypeIds } from '@features/filter-event-types/model/filter-preferences'
import { spansMultipleTurnoutBuckets, type TurnoutBucket } from '@features/filter-event-types/model/turnout'
import { filterEvents } from '@features/filter-event-types/model/filter-events'
import { emptyEventsMessage } from '@features/filter-event-types/model/empty-message'
import { eligibleEvents } from '@features/bulk-attend/lib/eligible-event-ids'

export interface EventsPageModelInput {
    events: Event[] | undefined
    eventTypes: readonly { id: string }[] | undefined
    isLoading: boolean
    error: unknown
    hiddenTypeIds: ReadonlySet<string>
    activeStates: Set<AttendanceState>
    activeTurnouts: Set<TurnoutBucket>
    showPast: boolean
    now: Date
}

export interface EventsPageModel {
    allTypeIds: string[]
    activeTypeIds: Set<string>
    sortedEvents: Event[]
    heroEvent: Event | null
    listEvents: Event[]
    showTurnout: boolean
    bulkEvents: Event[]
    emptyMessage: string
    listShell: { isLoading: boolean, error: unknown }
}

/**
 * Everything the events page decides before rendering (ADR-0029, ADR-0030): which events survive the
 * filters, whether there is a hero, which event the list drops so the hero does not appear twice,
 * and what Bulk Attend and the empty state read. Every output reads the same filtered list.
 */
export function buildEventsPageModel({
    events,
    eventTypes,
    isLoading,
    error,
    hiddenTypeIds,
    activeStates,
    activeTurnouts,
    showPast,
    now,
}: EventsPageModelInput): EventsPageModel {
    const allTypeIds = (eventTypes ?? []).map(t => t.id)
    // Derived rather than stored: a type deleted since the last visit is inert and a type added since
    // defaults to on (ADR-0030, #325). Filtering is withheld until the types have loaded.
    const activeTypeIds = reconcileTypeIds(hiddenTypeIds, allTypeIds)
    const filteredEvents = !events || !eventTypes
        ? events ?? []
        : filterEvents(events, activeTypeIds, activeStates, activeTurnouts)
    // The API returns upcoming ascending but "all" descending; the flat list only reads if chronological.
    const sortedEvents = [...filteredEvents].sort((a, b) => a.startTime.localeCompare(b.startTime))

    const heroEvent = selectHeroEvent(sortedEvents, now)
    const listEvents = heroEvent ? sortedEvents.filter(e => e.id !== heroEvent.id) : sortedEvents

    return {
        allTypeIds,
        activeTypeIds,
        sortedEvents,
        heroEvent,
        listEvents,
        // Read off the unfiltered list (ADR-0029 §5): narrowing another dimension must not make the
        // group vanish underneath a Turnout selection that is still in effect.
        showTurnout: spansMultipleTurnoutBuckets(events ?? []),
        // Bulk Attend acts on exactly what the page shows (ADR-0020, ADR-0029 §6), the hero included.
        bulkEvents: eligibleEvents(sortedEvents, activeTypeIds, now),
        emptyMessage: emptyEventsMessage({
            hasHero: heroEvent !== null,
            showPast,
            activeTypeIds,
            allTypeIds,
            activeStates,
            activeTurnouts,
        }),
        // A rendered hero is loaded data, so an empty list beneath it means "nothing else", never a failure.
        listShell: heroEvent ? { isLoading: false, error: undefined } : { isLoading, error },
    }
}
