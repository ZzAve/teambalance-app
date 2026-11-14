import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useEvents, type Event } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { usePendingAttendanceEvents, useSetAttendance } from '@shared/api/attendances'
import {
    useRemoveSubstituteAttendance,
    useSetSubstituteAttendance,
    usePendingSubstituteEvents,
} from '@shared/api/substitutes'
import { useCurrentUser } from '@shared/api/auth'
import { usePositions } from '@shared/api/positions'
import { useNow } from '@shared/lib/use-now'
import type { PositionRef } from '@entities/event/lib/lineup'
import { NextEventHero } from '@widgets/next-event-hero/ui/NextEventHero'
import { CreateEventSheet } from '@widgets/create-event/ui/CreateEventSheet'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'
import { useEventPanelStore } from '@features/event-panel-view/model/event-panel-store'
import { EventLineupPanel } from '@widgets/event-panel/ui/EventLineupPanel'
import { EventsPageView } from '@pages/events/ui/EventsPageView'
import { eventsPageContent } from '@pages/events/lib/events-page-content'
import { reconcileTypeIds } from '@features/filter-event-types/model/filter-preferences'
import { BulkAttendBar } from '@features/bulk-attend/ui/BulkAttendBar'
import { SubstitutePicker } from '@features/call-in-substitutes/ui/SubstitutePicker'

export const Route = createFileRoute('/t/$slug/')({
    component: EventListPage,
})

/**
 * The events page. Composition, in order: a compact header with the filter trigger, the Next Up
 * hero when (and only when) one is due and past events are not shown, then one flat chronological
 * list.
 *
 * `eventsPageContent` decides what the page shows (which events survive the filters, the hero, the
 * list without it, Bulk Attend) so the views below stay prop-only. This route wires it to the
 * stores, queries and mutations.
 */
function EventListPage() {
    const {slug} = Route.useParams()
    // All four filter dimensions live in the store, restored from this team's local preferences
    // (ADR-0030 §1, reversing ADR-0029 §8): members reach the detail page by mis-tapping a card, and
    // losing the filter as the penalty for that is worse than the misreporting §8 guarded against.
    const {
        showPast, hiddenTypeIds, activeStates, activeTurnouts,
        openTeam, setShowPast, toggleType, toggleState, toggleTurnout, clearFilters,
    } = useEventFiltersStore()
    // The card panel's two display preferences, in their own store: `Clear filters` clears where the
    // member was and must leave how they like to look at it alone (ADR-0030 §3). No team binding —
    // a taste follows the member across their teams, so there is nothing to restore on entry.
    const {defaultExpanded, setDefaultExpanded} = useEventPanelStore()
    const {data: events, isLoading, error} = useEvents(showPast)
    const {data: eventTypes} = useEventTypes()
    const isAdmin = useCurrentUser()?.role === 'ADMIN'
    const isActingAs = !!useCurrentUser()?.actAs

    // Per team, so a member of two teams does not carry one team's type filter into the other. The
    // restore lands after the first render, so a persisted `showPast` costs one extra events
    // request on entry — the alternative is holding the whole page back on local storage.
    useEffect(() => {
        openTeam(slug)
    }, [slug, openTeam])

    // One ticking clock for the whole page, so the hero's countdown, the hero cut-off and every
    // card's relative label are read off the same instant and can never disagree with each other —
    // and so a screen left open overnight stops claiming "Tomorrow" about today.
    const now = useNow()

    // Attendance from the card (#273), for anyone — the lineup panel makes a teammate's answer
    // editable from the list, which ADR-0003 allows and this page never needed before. `myState` and
    // `attendances` are both on the list payload, so no detail read is involved. The write patches
    // every cached events read, this list included, so the card shows the answer at once; its
    // readiness badge stays pending (⑤) while the write is in flight.
    const currentUserId = useCurrentUser()?.id ?? null
    const {mutate: setAttendance} = useSetAttendance()
    const pendingAttendanceEvents = usePendingAttendanceEvents()

    // One path for every answer on this page, the viewer's own included: the panel's chips and the
    // card's own pill are the same write aimed at a different member.
    const respondFor = (eventId: string, userId: string, state: Event['myState']) =>
        setAttendance({eventId, userId, state})
    // One Substitute picker for the whole page (#359), aimed at one card's event and, from an open
    // spot, one Position. Any Member may call Substitutes in (ADR-0033). The target outlives `open`
    // so the sheet can animate out.
    const [picker, setPicker] = useState<{eventId: string, position: PositionRef | null, open: boolean} | null>(null)
    const pickerEvent = events?.find(e => e.id === picker?.eventId) ?? null
    const setSubstituteAttendance = useSetSubstituteAttendance()
    const removeSubstituteAttendance = useRemoveSubstituteAttendance()
    const pendingSubstituteEvents = usePendingSubstituteEvents()

    // The lineup panel, built once for the list cards and the hero: both need the page's attendance
    // write and its one Substitute picker. The hero drops the header summary — its badge and status
    // line already state the verdict and the headcount (#386).
    const {data: positions} = usePositions()
    const positionOrder = positions?.map(p => p.label)
    const lineupPanel = (event: Event, {summary = true} = {}) => (
        <EventLineupPanel
            attendances={event.attendances}
            roster={event.roster}
            currentUserId={currentUserId}
            substitutes={event.substitutes}
            summary={summary}
            onRespond={(userId, state) => respondFor(event.id, userId, state)}
            onCallInSubstitutes={(position) => setPicker({eventId: event.id, position, open: true})}
            onSetSubstituteState={(substituteId, state) =>
                setSubstituteAttendance.mutate({eventId: event.id, substituteId, state})}
            onTakeOffSubstitute={(substituteId) =>
                removeSubstituteAttendance.mutate({eventId: event.id, substituteId})}
            substitutePending={pendingSubstituteEvents.includes(event.id)}
            positionOrder={positionOrder}
        />
    )

    const respond = (eventId: string, state: Event['myState']) => {
        if (!currentUserId) return
        respondFor(eventId, currentUserId, state)
    }

    const allTypeIds = useMemo(() => (eventTypes ?? []).map(t => t.id), [eventTypes])
    // The types to show, derived rather than stored: what the member switched off is what persists,
    // so a type deleted since the last visit is inert and a type added since defaults to on
    // (ADR-0030, #325). That is also why there is no bootstrap effect any more — before the types
    // load there is simply nothing to derive, and filtering is withheld until then.
    const activeTypeIds = useMemo(
        () => reconcileTypeIds(hiddenTypeIds, allTypeIds),
        [hiddenTypeIds, allTypeIds],
    )

    const {
        heroEvent, listEvents, bulkAttendEvents, showTurnout, resultCount, emptyMessage,
        isLoading: listLoading, error: listError,
    } = eventsPageContent({
        events,
        allTypeIds: eventTypes ? allTypeIds : undefined,
        activeTypeIds, activeStates, activeTurnouts,
        showPast, now, isLoading, error,
    })

    return (
        <>
        <EventsPageView
            createAction={isAdmin && <CreateEventSheet/>}
            hideCalendarLink={isActingAs}
            filters={{
                eventTypes: eventTypes ?? [],
                activeTypeIds,
                activeStates,
                activeTurnouts,
                showTurnout,
                showPast,
                resultCount,
                onToggleType: (typeId) => toggleType(typeId, allTypeIds),
                // Every group runs through the same isolate-first toggler in the store
                // (ADR-0029 §3): one tap from the all-on default isolates the chip.
                onToggleState: toggleState,
                onToggleTurnout: toggleTurnout,
                onToggleShowPast: setShowPast,
                // A restored filter must never be invisible (ADR-0030 §2): the dot on the
                // trigger says *that* something is filtered, this says undo it.
                onClearFilters: clearFilters,
            }}
            panelMenu={{
                defaultExpanded,
                onDefaultExpandedChange: setDefaultExpanded,
            }}
            hero={heroEvent && (
                <NextEventHero
                    // Keyed like the cards, so a re-pick (a filter, an event starting) hands the new
                    // hero a fresh disclosure rather than the one the member opened on the last.
                    key={heroEvent.id}
                    event={heroEvent}
                    now={now}
                    // The hero's lineup sits behind the cards' disclosure and follows the same
                    // preference (#386).
                    defaultRosterOpen={defaultExpanded}
                    lineup={(event) => lineupPanel(event, {summary: false})}
                />
            )}
            bulkBar={<BulkAttendBar events={bulkAttendEvents}/>}
            list={{
                events: listEvents,
                onRespond: respond,
                pendingEventIds: pendingAttendanceEvents,
                currentUserId,
                // What each card's roster disclosure opens onto (ADR-0030 §5-§7, as amended by the
                // lineup panel). Injected from here because the panel is a widget and the card is an
                // entity — the card cannot build one itself.
                defaultRosterOpen: defaultExpanded,
                rosterPanel: lineupPanel,
                isLoading: listLoading,
                error: listError,
                now,
                emptyMessage,
            }}
        />
        <SubstitutePicker
            open={picker?.open ?? false}
            event={pickerEvent}
            position={picker?.position}
            onClose={() => setPicker(current => current && {...current, open: false})}
        />
        </>
    )
}
