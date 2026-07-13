import {createFileRoute} from '@tanstack/react-router'
import {useEffect, useMemo, useState} from 'react'
import {type Event, useEvents} from '@shared/api/events'
import {useEventTypes} from '@shared/api/event-types'
import {useUserStore} from '@shared/stores/user-store'
import {EventCard} from '@entities/event/ui/EventCard'
import {CreateEventDialog} from '@features/create-event/ui/CreateEventDialog'
import {toggleTypeSelection} from '@features/filter-event-types/model/toggleTypeSelection'

export const Route = createFileRoute('/')({
    component: EventListPage,
})

type Tab = 'upcoming' | 'past'

function groupUpcomingEvents(events: Event[]): { label: string; events: Event[] }[] {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const thisWeek = events.filter((e) => {
        const d = new Date(e.startTime)
        return d >= now && d <= weekFromNow
    })
    const later = events.filter((e) => new Date(e.startTime) > weekFromNow)

    const groups: { label: string; events: Event[] }[] = []
    if (thisWeek.length > 0) groups.push({label: 'This Week', events: thisWeek})
    if (later.length > 0) groups.push({label: 'Later', events: later})
    return groups
}

function EventListPage() {
    const [tab, setTab] = useState<Tab>('upcoming')
    const [activeTypeIds, setActiveTypeIds] = useState<Set<string>>(new Set())
    const {data: events, isLoading} = useEvents(tab === 'past')
    const {data: eventTypes} = useEventTypes()
    const isAdmin = useUserStore((s) => s.role) === 'ADMIN'

    useEffect(() => {
        if (eventTypes && activeTypeIds.size === 0) {
            setTimeout(() => setActiveTypeIds(new Set(eventTypes.map(t => t.id))))
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [eventTypes])

    const filteredEvents = useMemo(() => {
        if (!events || !eventTypes) return events ?? []
        if (activeTypeIds.size === eventTypes.length) return events
        return events.filter(e => activeTypeIds.has(e.eventType.id))
    }, [events, activeTypeIds, eventTypes])

    const groups =
        tab === 'upcoming' && filteredEvents
            ? groupUpcomingEvents(filteredEvents)
            : filteredEvents
                ? [{label: '', events: [...filteredEvents].reverse()}]
                : []

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Events</h2>
                {isAdmin && <CreateEventDialog/>}
            </div>

            {/* Segmented pill toggle */}
            <div className="mt-4 inline-flex rounded-full bg-muted p-1">
                {(['upcoming', 'past'] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setTab(t)
                        }}
                        className={[
                            'rounded-full px-4 py-1 text-sm font-medium capitalize transition-all',
                            tab === t
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        ].join(' ')}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* T3.3: Event type filter pills */}
            {eventTypes && eventTypes.length > 0 && (
                <div
                    className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {eventTypes.map((type) => {
                        const isActive = activeTypeIds.has(type.id)
                        const color = type.color ?? '#888'
                        return (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setActiveTypeIds(prev =>
                                        toggleTypeSelection(prev, eventTypes.map(t => t.id), type.id))
                                }}
                                style={isActive ? {
                                    backgroundColor: color,
                                    borderColor: color,
                                    color: '#fff'
                                } : {borderColor: color + '66', color}}
                                className={[
                                    'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all',
                                    isActive ? '' : 'hover:opacity-80',
                                ].join(' ')}
                            >
                                {type.name}
                            </button>
                        )
                    })}
                </div>
            )}

            {isLoading && <p className="mt-4 text-muted-foreground">Loading...</p>}

            {!isLoading && groups.length === 0 && (
                <p className="mt-4 text-muted-foreground">
                    {activeTypeIds.size < (eventTypes?.length ?? 0) ? 'No events for this type.' : 'No events yet.'}
                </p>
            )}

            {groups.map((group, gi) => (
                <div key={group.label || 'past'} className={gi === 0 ? 'mt-4' : 'mt-6'}>
                    {group.label && (
                        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            {group.label}
                        </h3>
                    )}
                    <div className="flex flex-col gap-3">
                        {group.events.map((event, idx) => (
                            <EventCard key={event.id} event={event} index={idx}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
