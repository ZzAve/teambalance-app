import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useEvents, type Event } from '@entities/event/api/events'
import { useEventTypes } from '@entities/event/api/event-types'
import { useSetAttendance } from '@entities/attendance/api/attendances'
import type { AttendanceState } from '@entities/attendance/model/attendance-state'
import { useSession } from '@shared/session/session'
import { useNow } from '@shared/lib/use-now'
import { NextEventHero } from '@widgets/next-event-hero/ui/NextEventHero'
import { CreateEventSheet } from '@widgets/create-event/ui/CreateEventSheet'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'
import { useEventPanelStore } from '@features/event-panel-view/model/event-panel-store'
import type { OptimisticAnswer } from '@entities/event/ui/EventListView'
import { EventLineupPanel } from '@widgets/event-panel/ui/EventLineupPanel'
import { useEventLineup } from '@widgets/event-panel/model/use-event-lineup'
import { EventsPageView } from '@pages/events/ui/EventsPageView'
import { buildEventsPageModel } from '@pages/events/model/events-page-model'
import { BulkAttendBar } from '@features/bulk-attend/ui/BulkAttendBar'
import { SubstitutePicker } from '@features/call-in-substitutes/ui/SubstitutePicker'

export const Route = createFileRoute('/t/$slug/')({
    component: EventListPage,
})

/**
 * The events page: wiring only. What the page shows is decided by `buildEventsPageModel`.
 */
function EventListPage() {
    const {slug} = Route.useParams()
    // All four filter dimensions live in the store, restored from this team's local preferences
    // (ADR-0030 §1, reversing ADR-0029 §8).
    const {
        showPast, hiddenTypeIds, activeStates, activeTurnouts,
        openTeam, setShowPast, toggleType, toggleState, toggleTurnout, clearFilters,
    } = useEventFiltersStore()
    // The card panel's display preferences are separate: `Clear filters` must leave them alone (ADR-0030 §3).
    const {defaultExpanded, setDefaultExpanded} = useEventPanelStore()
    const {data: events, isLoading, error} = useEvents(showPast)
    const {data: eventTypes} = useEventTypes()
    const {user, isAdmin} = useSession()
    const currentUserId = user?.id ?? null

    // Per team, so a member of two teams does not carry one team's type filter into the other.
    useEffect(() => {
        openTeam(slug)
    }, [slug, openTeam])

    // One clock for the whole page, so the hero, the hero cut-off and every card label agree.
    const now = useNow()

    const {
        allTypeIds, activeTypeIds, sortedEvents, heroEvent, listEvents,
        showTurnout, bulkEvents, emptyMessage, listShell,
    } = buildEventsPageModel({
        events, eventTypes, isLoading, error, hiddenTypeIds, activeStates, activeTurnouts, showPast, now,
    })

    // `applyOptimisticAttendance` patches only the detail cache, so the list holds the picked answer
    // itself until the refetch reports the same one; onError clears it so a failed write does not
    // leave the card stuck.
    const {mutate: setAttendance} = useSetAttendance()
    const [optimistic, setOptimistic] = useState<OptimisticAnswer | null>(null)

    // One path for every answer on this page, the viewer's own included.
    const respondFor = (eventId: string, userId: string, state: AttendanceState) => {
        setOptimistic({eventId, userId, state})
        setAttendance({eventId, userId, state}, {onError: () => setOptimistic(null)})
    }
    const respond = (eventId: string, state: AttendanceState) => {
        if (!currentUserId) return
        respondFor(eventId, currentUserId, state)
    }

    const {picker, lineupHandlers} = useEventLineup(events)
    // Built once for the list cards and the hero; the card is an entity and cannot build a widget itself.
    const lineupPanel = (event: Event) => (
        <EventLineupPanel
            attendances={event.attendances}
            roster={event.roster}
            currentUserId={currentUserId}
            substitutes={event.substitutes}
            onRespond={(userId, state) => respondFor(event.id, userId, state)}
            {...lineupHandlers(event.id)}
        />
    )

    return (
        <>
        <EventsPageView
            createAction={isAdmin && <CreateEventSheet/>}
            filters={{
                eventTypes: eventTypes ?? [],
                activeTypeIds,
                activeStates,
                activeTurnouts,
                showTurnout,
                showPast,
                resultCount: sortedEvents.length,
                onToggleType: (typeId) => toggleType(typeId, allTypeIds),
                onToggleState: toggleState,
                onToggleTurnout: toggleTurnout,
                onToggleShowPast: setShowPast,
                onClearFilters: clearFilters,
            }}
            panelMenu={{
                defaultExpanded,
                onDefaultExpandedChange: setDefaultExpanded,
            }}
            hero={heroEvent && <NextEventHero event={heroEvent} now={now} lineup={lineupPanel}/>}
            bulkBar={<BulkAttendBar events={bulkEvents}/>}
            list={{
                events: listEvents,
                onRespond: respond,
                optimistic,
                currentUserId,
                defaultRosterOpen: defaultExpanded,
                rosterPanel: lineupPanel,
                ...listShell,
                now,
                emptyMessage,
            }}
        />
        <SubstitutePicker {...picker}/>
        </>
    )
}
