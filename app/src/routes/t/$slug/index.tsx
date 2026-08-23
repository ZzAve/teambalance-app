import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useEvents } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'
import { useUserStore } from '@shared/stores/user-store'
import { useNow } from '@shared/lib/use-now'
import { EventListView } from '@entities/event/ui/EventListView'
import { selectHeroEvent } from '@entities/event/lib/next-event'
import { NextEventHero } from '@widgets/next-event-hero/ui/NextEventHero'
import { CreateEventSheet } from '@widgets/create-event/ui/CreateEventSheet'
import { EventFiltersView } from '@features/filter-event-types/ui/EventFiltersView'
import { toggleTypeSelection } from '@features/filter-event-types/model/toggleTypeSelection'
import { BulkAttendBar } from '@features/bulk-attend/ui/BulkAttendBar'
import { eligibleEvents } from '@features/bulk-attend/lib/eligible-event-ids'

export const Route = createFileRoute('/t/$slug/')({
    component: EventListPage,
})

/**
 * The events page. Composition, in order: a compact header with the filter trigger, the Next Up
 * hero when (and only when) one is due, then one flat chronological list.
 *
 * All the deciding happens here so the views below stay prop-only: which events survive the type
 * filter, whether there is a hero, and — because the hero must not appear twice — which event the
 * list drops.
 */
function EventListPage() {
    const [showPast, setShowPast] = useState(false)
    const [activeTypeIds, setActiveTypeIds] = useState<Set<string>>(new Set())
    const {data: events, isLoading, error} = useEvents(showPast)
    const {data: eventTypes} = useEventTypes()
    const isAdmin = useUserStore((s) => s.role) === 'ADMIN'

    useEffect(() => {
        if (eventTypes && activeTypeIds.size === 0) {
            setTimeout(() => setActiveTypeIds(new Set(eventTypes.map(t => t.id))))
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [eventTypes])

    // One ticking clock for the whole page, so the hero's countdown, the hero cut-off and every
    // card's relative label are read off the same instant and can never disagree with each other —
    // and so a screen left open overnight stops claiming "Tomorrow" about today.
    const now = useNow()

    const filteredEvents = useMemo(() => {
        if (!events || !eventTypes) return events ?? []
        if (activeTypeIds.size === eventTypes.length) return events
        return events.filter(e => activeTypeIds.has(e.eventType.id))
    }, [events, activeTypeIds, eventTypes])

    // The API returns upcoming ascending but "all" descending, so sort here: the list is flat now,
    // and flat only reads if it is chronological.
    const sortedEvents = useMemo(
        () => [...filteredEvents].sort((a, b) => a.startTime.localeCompare(b.startTime)),
        [filteredEvents],
    )

    const heroEvent = selectHeroEvent(sortedEvents, now)
    const listEvents = heroEvent ? sortedEvents.filter(e => e.id !== heroEvent.id) : sortedEvents

    const isTypeFiltered = activeTypeIds.size < (eventTypes?.length ?? 0)

    // Bulk Attend acts on exactly what the page shows (ADR-0020), so it reads `sortedEvents` — the
    // hero included, since pulling it out of the list does not stop it being on screen. Past events
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
                        showPast={showPast}
                        onToggleType={(typeId) =>
                            setActiveTypeIds(prev =>
                                toggleTypeSelection(prev, (eventTypes ?? []).map(t => t.id), typeId))
                        }
                        onToggleShowPast={setShowPast}
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
                // A rendered hero IS loaded data — it was pulled out of this very list — so an empty
                // list beneath it means "nothing else", never a failure. Withholding the flags keeps
                // the list from painting a skeleton or an error over a page that is plainly fine.
                isLoading={heroEvent ? false : isLoading}
                error={heroEvent ? undefined : error}
                now={now}
                emptyMessage={
                    // With a hero on screen the page is not empty — the list just has nothing left
                    // after the hero was pulled out of it.
                    heroEvent
                        ? 'Nothing else coming up.'
                        : isTypeFiltered
                            ? 'No events for this type.'
                            : showPast
                                ? 'No events yet.'
                                : 'No upcoming events.'
                }
            />
        </div>
    )
}
