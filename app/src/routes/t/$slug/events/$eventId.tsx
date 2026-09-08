import { createFileRoute, Link } from '@tanstack/react-router'
import { useLayoutEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { toast } from 'sonner'
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
import { crossMemberToast } from '@entities/event/lib/cross-member-toast'
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

  // The same field the card reads (⑪), not this page's own row — one answer to "who set mine?".
  // Here the rows are present, so the id resolves to a name instead of the neutral fallback.
  const myAttribution = currentUserId
    ? attributionName(
        { userId: currentUserId, state: myState, changedBy: event.myChangedBy },
        event.attendances,
      )
    : null

  // Setting an answer. For a teammate (trust-based, ADR-0003) it raises an Undo toast — the awareness
  // and the safety net for a cross-member change; your own answer just writes.
  const setAttendance = (userId: string, state: AttendanceState) => {
    const target = event.attendances.find((a) => a.userId === userId)
    const prior = (target?.state as AttendanceState) ?? 'NOT_RESPONDED'
    mutate({ eventId, userId, state })
    if (userId !== currentUserId) {
      const { message, undoState } = crossMemberToast(target?.displayName ?? 'teammate', state, prior)
      toast(
        message,
        undoState
          ? { action: { label: 'Undo', onClick: () => mutate({ eventId, userId, state: undoState }) } }
          : undefined,
      )
    }
  }
  // Two independent questions, and conflating them is what used to lose the headcount here (#271 ⑥).
  // The bar shows for ANY tracked roster — with position targets it counts slots, without them it
  // counts people (a target fraction, or a plain tally). RoleBreakdown is the per-role fallback and
  // still turns on the narrower question: it survives only where no position carries a target, since
  // there the bar states a total but nothing about who plays where.
  const hasPositionTargets = event.roster.positions.some((p) => p.required != null)
  const showRosterBar = hasPositionTargets || event.roster.trackRoster

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

      {/* Roster overview — pinned so completeness stays one glance away however far a big squad
          scrolls. Sits high, right under the event identity, so on a tall desktop screen it is
          visible and pinning from the start rather than buried below the response/info sections.
          Shows for any tracked roster (#317): position targets count slots, otherwise a headcount
          or plain tally; RoleBreakdown stays the per-role fallback where no position is targeted (⑥). */}
      {showRosterBar && (
        <div
          className="sticky z-20 -mx-4 mt-6"
          style={{ top: `calc(var(--header-height) + ${subHeaderHeight}px)` }}
        >
          <RosterBar roster={event.roster} />
        </div>
      )}

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

      {/* Attendance — one list by position, no tabs. The roster bar (pinned above) shows for any
          tracked roster; where no position carries a target RoleBreakdown stays as the per-role
          fallback (⑥). */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
        {!hasPositionTargets && <RoleBreakdown breakdown={event.attendanceSummary.roleBreakdown} />}
        <AttendeeList
          attendees={event.attendances}
          roster={event.roster}
          currentUserId={currentUserId}
          onRespond={setAttendance}
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
