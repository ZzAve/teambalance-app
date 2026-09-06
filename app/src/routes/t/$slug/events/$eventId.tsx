import { createFileRoute, Link } from '@tanstack/react-router'
import { useLayoutEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { useEvent, useEvents } from '@shared/api/events'
import { useSetAttendance } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { Button } from '@shared/ui/button'
import { EventTypeBadge } from '@entities/event/ui/EventTypeBadge'
import { EventTypeIcon } from '@entities/event/ui/EventTypeIcon'
import { EventDetailSkeleton } from '@entities/event/ui/EventDetailSkeleton'
import { QueryErrorState } from '@shared/ui/QueryErrorState'
import { ReferenceChips } from '@entities/event/ui/ReferenceChips'
import { RoleBreakdown } from '@entities/event/ui/RoleBreakdown'
import { RosterBar } from '@entities/event/ui/RosterBar'
import { SeriesPeek } from '@entities/event/ui/SeriesPeek'
import { attributionName } from '@entities/event/lib/attribution'
import { buildSeriesPeek } from '@entities/event/lib/series-peek'
import { AttendeeList } from '@widgets/attendee-list/ui/AttendeeList'
import { AttendanceToggle, type AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { EditEventDialog } from '@features/edit-event/ui/EditEventDialog'
import { DeleteEventDialog } from '@features/edit-event/ui/DeleteEventDialog'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { useTeamRoutes } from '@shared/lib/team-routes'

export const Route = createFileRoute('/t/$slug/events/$eventId')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const routes = useTeamRoutes()
  const { data: event, isLoading, isError, refetch } = useEvent(eventId)
  const currentUserId = useUserStore((s) => s.userId)
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'
  const { mutate, isPending } = useSetAttendance()
  // The roster bar pins directly beneath the sticky PageHeader; its offset is the header var plus the
  // sub-header's measured height, so it stacks without a magic pixel (the offset the PageHeader
  // widget was created to kill). Measured, not hardcoded, so a wrapped title can't overlap it.
  const subHeaderRef = useRef<HTMLDivElement>(null)
  const [subHeaderHeight, setSubHeaderHeight] = useState(0)
  // Only load the full list to find series siblings when this event actually belongs to a group.
  const { data: allEvents } = useEvents(true, !!event?.recurringGroup)

  useLayoutEffect(() => {
    const el = subHeaderRef.current
    if (!el) return
    const measure = () => setSubHeaderHeight(el.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [event?.id])

  if (isLoading) return <EventDetailSkeleton />
  if (isError)
    return (
      <QueryErrorState
        title="Couldn't load this event"
        description="Something went wrong on our end. Give it another try."
        onRetry={() => refetch()}
      >
        <Button asChild variant="ghost">
          <Link to={routes.events}>Back to events</Link>
        </Button>
      </QueryErrorState>
    )
  if (!event) return <p>Event not found.</p>

  const date = new Date(event.startTime)
  const myAttendance = event.attendances.find((a) => a.userId === currentUserId)
  const myState: AttendanceState = (myAttendance?.state as AttendanceState) ?? 'NOT_RESPONDED'

  const myAttribution = myAttendance ? attributionName(myAttendance, event.attendances) : null
  // The roster bar replaces RoleBreakdown only where a position carries a target; otherwise it has
  // nothing to be a fraction of and RoleBreakdown stays as the fallback (⑥, same rule as the card).
  const hasPositionTargets = event.roster.positions.some((p) => p.required != null)

  // "Part of a series" peek: siblings are every event sharing this occurrence's recurring group.
  const siblings = event.recurringGroup
    ? (allEvents ?? []).filter((e) => e.recurringGroup === event.recurringGroup)
    : []
  const seriesPeek = event.recurringGroup ? buildSeriesPeek(siblings, event.id) : null

  return (
    <div>
      {/* Sticky sub-header — offset comes from --header-height via PageHeader, not a magic pixel.
          Wrapped so its height can be measured for the roster bar that pins directly beneath it. */}
      <div ref={subHeaderRef}>
        <PageHeader title={event.title} backTo={routes.events} backLabel="Back to events" />
      </div>

      {/* Event header */}
      <div className="mt-2 flex items-start gap-4">
        <EventTypeIcon type={event.eventType} size="md" />
        <div className="min-w-0">
          <EventTypeBadge type={event.eventType} />
          <h1 className="font-display text-2xl font-bold leading-tight">{event.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {date.toLocaleDateString('nl-NL', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {' · '}
            {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {event.location && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground hover:text-blue hover:underline"
            >
              <MapPin size={13} className="shrink-0" />
              {event.location}
            </a>
          )}
        </div>
      </div>

      {/* Your Response */}
      {currentUserId && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your response</p>
          {/* Named group so this primary control is distinct from the per-row controls in the list
              below — the viewer now has a row of their own there too. */}
          <div role="group" aria-label="Your response">
            <AttendanceToggle
              value={myState}
              disabled={isPending}
              onToggle={(state) => mutate({ eventId, userId: currentUserId, state })}
            />
          </div>
          {/* You learn a teammate changed your answer right where you would change it back (⑪). */}
          {myAttribution && <p className="mt-2 text-xs text-muted-foreground">set by {myAttribution}</p>}
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="mt-6 rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
        </div>
      )}

      {/* Additional info — the event's References (Nevobo, match form, …), shown in full */}
      {event.references.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Additional info</p>
          <ReferenceChips references={event.references} max={event.references.length} />
        </div>
      )}

      {/* Attendance — one list by position, no tabs. The roster bar pins beneath the sub-header so
          completeness stays visible however far a big squad scrolls; where no position carries a
          target it has nothing to show and the headcount breakdown stays as the fallback. */}
      {hasPositionTargets && (
        <div
          className="sticky z-20 -mx-4 mt-6"
          style={{ top: `calc(var(--header-height) + ${subHeaderHeight}px)` }}
        >
          <RosterBar roster={event.roster} />
        </div>
      )}
      <div className={`overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm ${hasPositionTargets ? 'mt-3' : 'mt-6'}`}>
        {!hasPositionTargets && <RoleBreakdown breakdown={event.attendanceSummary.roleBreakdown} />}
        <AttendeeList
          attendees={event.attendances}
          roster={event.roster}
          currentUserId={currentUserId}
          onRespond={(userId, state) => mutate({ eventId, userId, state })}
          pending={isPending}
        />
      </div>

      {/* Part of a series peek */}
      {seriesPeek && <SeriesPeek peek={seriesPeek} />}

      {/* Admin Actions — scoped series edit/delete (ADR-0014 Phase 3); standalone events skip the prompt */}
      {isAdmin && (
        <div className="mt-6 flex gap-2.5 border-t border-border/40 pt-5">
          <EditEventDialog event={event} siblings={siblings} />
          <DeleteEventDialog eventId={event.id} title={event.title} siblings={siblings} />
        </div>
      )}
    </div>
  )
}
