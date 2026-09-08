import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useEvents, type Event } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { useSetAttendance } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { useNow } from '@shared/lib/use-now'
import { EventListView } from '@entities/event/ui/EventListView'
import { selectHeroEvent } from '@entities/event/lib/next-event'
import { NextEventHero } from '@widgets/next-event-hero/ui/NextEventHero'
import { CreateEventSheet } from '@widgets/create-event/ui/CreateEventSheet'
import { EventFiltersView } from '@features/filter-event-types/ui/EventFiltersView'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'
import { reconcileTypeIds } from '@features/filter-event-types/model/filter-preferences'
import { spansMultipleTurnoutBuckets } from '@features/filter-event-types/model/turnout'
import { filterEvents } from '@features/filter-event-types/model/filter-events'
import { emptyEventsMessage } from '@features/filter-event-types/model/empty-message'
import { BulkAttendBar } from '@features/bulk-attend/ui/BulkAttendBar'
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
    const {data: events, isLoading, error} = useEvents(showPast)
    const {data: eventTypes} = useEventTypes()
    const isAdmin = useUserStore((s) => s.role) === 'ADMIN'

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

    // Attendance from the card (#273). `myState` is on the list payload, so the card needs no detail
    // read; the one shared mutation and the optimistic hold live here. `applyOptimisticAttendance`
    // patches only the detail cache, not this list, so the picked answer is held here. It is applied
    // by EventListView only until the invalidated list refetch reports the same answer — no clearing
    // effect needed, the derivation drops it on its own. onError clears it so a failed write does not
    // leave the card stuck. While held, the card shows the answer optimistically and its readiness
    // badge stays pending (⑤).
    const currentUserId = useUserStore((s) => s.userId)
    const {mutate: setAttendance} = useSetAttendance()
    const [optimistic, setOptimistic] = useState<{ eventId: string; state: Event['myState'] } | null>(null)

    const respond = (eventId: string, state: Event['myState']) => {
        if (!currentUserId) return
        setOptimistic({eventId, state})
        setAttendance({eventId, userId: currentUserId, state}, {onError: () => setOptimistic(null)})
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
    // `sortedEvents` — already narrowed by *both* chip groups, the hero included since pulling it
    // out of the list does not stop it being on screen. That is why filtering to an answered status
    // leaves no buttons at all: the visible list then holds nothing unanswered. Past events
    // are excluded by the selector, not by the surrounding UI: with the tabs gone, `showPast` merely
    // adds past events to the same list, so the future-only rule has to live in the selector.
    // It reads the page's shared `now`, so the button and the cards can never disagree about which
    // events have started.
    const bulkEvents = useMemo(
        () => eligibleEvents(sortedEvents, activeTypeIds, now),
        [sortedEvents, activeTypeIds, now],
    )

    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl font-bold">Events</h2>
                <div className="flex items-center gap-2">
                    {/* The invite link moved to the Team page (team-management action); Events keeps
                        only event creation for admins. */}
                    {isAdmin && <CreateEventSheet/>}
                    {/* Always mounted: the popover now owns the only route to past events, so it
                        must not disappear with the event types it also happens to host. */}
                    <EventFiltersView
                        eventTypes={eventTypes ?? []}
                        activeTypeIds={activeTypeIds}
                        activeStates={activeStates}
                        activeTurnouts={activeTurnouts}
                        showTurnout={showTurnout}
                        showPast={showPast}
                        resultCount={sortedEvents.length}
                        onToggleType={(typeId) => toggleType(typeId, allTypeIds)}
                        // Every group runs through the same isolate-first toggler in the store
                        // (ADR-0029 §3): one tap from the all-on default isolates the chip.
                        onToggleState={toggleState}
                        onToggleTurnout={toggleTurnout}
                        onToggleShowPast={setShowPast}
                        // A restored filter must never be invisible (ADR-0030 §2): the dot on the
                        // trigger says *that* something is filtered, this says undo it.
                        onClearFilters={clearFilters}
                    />
                </div>
            </div>

            {/* No hero when nothing is within RELATIVE_WINDOW_DAYS — and no placeholder in its
                place. The list carries the page. */}
            {heroEvent && <NextEventHero event={heroEvent} now={now}/>}

            {/* One button per event type with blanks left (ADR-0021); renders nothing at all when
                there are none, so a fully-answered page reserves no empty row. */}
            <BulkAttendBar events={bulkEvents}/>

            <EventListView
                events={listEvents}
                onRespond={respond}
                optimistic={optimistic}
                // A rendered hero IS loaded data — it was pulled out of this very list — so an empty
                // list beneath it means "nothing else", never a failure. Withholding the flags keeps
                // the list from painting a skeleton or an error over a page that is plainly fine.
                isLoading={heroEvent ? false : isLoading}
                error={heroEvent ? undefined : error}
                now={now}
                emptyMessage={emptyEventsMessage({
                    hasHero: heroEvent !== null,
                    showPast,
                    activeTypeIds,
                    allTypeIds,
                    activeStates,
                    activeTurnouts,
                })}
            />
        </div>
    )
}
