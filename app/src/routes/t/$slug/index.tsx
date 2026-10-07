import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useEvents, type Event } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { useSetAttendance } from '@shared/api/attendances'
import {
    useRemoveSubstituteAttendance,
    useSetSubstituteAttendance,
    usePendingSubstituteEvents,
} from '@shared/api/substitutes'
import { useCurrentUser } from '@shared/api/auth'
import { useNow } from '@shared/lib/use-now'
import { selectHeroEvent } from '@entities/event/lib/next-event'
import type { PositionRef } from '@entities/event/lib/lineup'
import { NextEventHero } from '@widgets/next-event-hero/ui/NextEventHero'
import { CreateEventSheet } from '@widgets/create-event/ui/CreateEventSheet'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'
import { useEventPanelStore } from '@features/event-panel-view/model/event-panel-store'
import type { OptimisticAnswer } from '@entities/event/ui/EventListView'
import { EventLineupPanel } from '@widgets/event-panel/ui/EventLineupPanel'
import { EventsPageView } from '@pages/events/ui/EventsPageView'
import { reconcileTypeIds } from '@features/filter-event-types/model/filter-preferences'
import { spansMultipleTurnoutBuckets } from '@features/filter-event-types/model/turnout'
import { filterEvents } from '@features/filter-event-types/model/filter-events'
import { emptyEventsMessage } from '@features/filter-event-types/model/empty-message'
import { BulkAttendBar } from '@features/bulk-attend/ui/BulkAttendBar'
import { SubstitutePicker } from '@features/call-in-substitutes/ui/SubstitutePicker'
import { eligibleEvents } from '@features/bulk-attend/lib/eligible-event-ids'

export const Route = createFileRoute('/t/$slug/')({
    component: EventListPage,
})

/**
 * The events page. Composition, in order: a compact header with the filter trigger, the Next Up
 * hero when (and only when) one is due, then one flat chronological list.
 *
 * All the deciding happens here so the views below stay prop-only: which events survive the filters,
 * whether there is a hero, and — because the hero must not appear twice — which event the list
 * drops. Everything on the page reads the same filtered list — the hero and Bulk Attend included
 * (ADR-0029 §6).
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
    // `attendances` are both on the list payload, so no detail read is involved; the one shared
    // mutation and the optimistic hold live here. `applyOptimisticAttendance` patches only the detail
    // cache, not this list, so the picked answer is held here and applied by EventListView until the
    // invalidated refetch reports the same answer — no clearing effect needed, the derivation drops
    // it on its own. onError clears it so a failed write does not leave the card stuck. While held,
    // the card shows the answer optimistically and its readiness badge stays pending (⑤).
    const currentUserId = useCurrentUser()?.id ?? null
    const {mutate: setAttendance} = useSetAttendance()
    const [optimistic, setOptimistic] = useState<OptimisticAnswer | null>(null)

    // One path for every answer on this page, the viewer's own included: the panel's chips and the
    // card's own pill are the same write aimed at a different member.
    const respondFor = (eventId: string, userId: string, state: Event['myState']) => {
        setOptimistic({eventId, userId, state})
        setAttendance({eventId, userId, state}, {onError: () => setOptimistic(null)})
    }
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

    const filteredEvents = useMemo(() => {
        if (!events || !eventTypes) return events ?? []
        return filterEvents(events, activeTypeIds, activeStates, activeTurnouts)
    }, [events, activeTypeIds, activeStates, activeTurnouts, eventTypes])

    // The API returns upcoming ascending but "all" descending, so sort here: the list is flat now,
    // and flat only reads if it is chronological.
    const sortedEvents = useMemo(
        () => [...filteredEvents].sort((a, b) => a.startTime.localeCompare(b.startTime)),
        [filteredEvents],
    )

    const heroEvent = selectHeroEvent(sortedEvents, now)
    const listEvents = heroEvent ? sortedEvents.filter(e => e.id !== heroEvent.id) : sortedEvents

    // Read off the *unfiltered* list (ADR-0029 §5): narrowing another dimension must not make the
    // group vanish underneath a Turnout selection that is still in effect.
    const showTurnout = useMemo(() => spansMultipleTurnoutBuckets(events ?? []), [events])

    // Bulk Attend acts on exactly what the page shows (ADR-0020, ADR-0029 §6), so it reads
    // `listEvents` — already narrowed by *both* chip groups. The hero's event is left out (#386): its
    // own answer buttons sit directly above the bar, so "Attend 1 match" must not describe the event
    // the member just read. That is also why filtering to an answered status leaves no buttons at
    // all: the visible list then holds nothing unanswered. Past events are excluded by the selector,
    // not by the surrounding UI: with the tabs gone, `showPast` merely adds past events to the same
    // list, so the future-only rule has to live in the selector. It reads the page's shared `now`,
    // so the button and the cards can never disagree about which events have started.
    const bulkEvents = useMemo(
        () => eligibleEvents(listEvents, activeTypeIds, now),
        [listEvents, activeTypeIds, now],
    )

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
                resultCount: sortedEvents.length,
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
            bulkBar={<BulkAttendBar events={bulkEvents}/>}
            list={{
                events: listEvents,
                onRespond: respond,
                optimistic,
                currentUserId,
                // What each card's roster disclosure opens onto (ADR-0030 §5-§7, as amended by the
                // lineup panel). Injected from here because the panel is a widget and the card is an
                // entity — the card cannot build one itself.
                defaultRosterOpen: defaultExpanded,
                rosterPanel: lineupPanel,
                // A rendered hero IS loaded data — it was pulled out of this very list — so an empty
                // list beneath it means "nothing else", never a failure. Withholding the flags keeps
                // the list from painting a skeleton or an error over a page that is plainly fine.
                isLoading: heroEvent ? false : isLoading,
                error: heroEvent ? undefined : error,
                now,
                emptyMessage: emptyEventsMessage({
                    hasHero: heroEvent !== null,
                    showPast,
                    activeTypeIds,
                    allTypeIds,
                    activeStates,
                    activeTurnouts,
                }),
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
