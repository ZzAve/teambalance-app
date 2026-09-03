import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
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
import { RosterPips } from '@entities/event/ui/RosterPips'
import { SeriesPeek } from '@entities/event/ui/SeriesPeek'
import { buildAttendeePanel } from '@entities/event/lib/attendee-panel'
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

const ATTENDEE_TABS: {
  state: AttendanceState
  label: string
  barColor: string
  badgeBg: string
}[] = [
  { state: 'ATTENDING', label: 'Going', barColor: 'bg-green', badgeBg: 'bg-green/10 text-green' },
  { state: 'MAYBE', label: 'Maybe', barColor: 'bg-gold', badgeBg: 'bg-gold/10 text-gold' },
  { state: 'ABSENT', label: 'Absent', barColor: 'bg-red', badgeBg: 'bg-red/10 text-red' },
  { state: 'NOT_RESPONDED', label: 'Awaiting', barColor: 'bg-muted-foreground', badgeBg: 'bg-muted text-muted-foreground' },
]

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const routes = useTeamRoutes()
  const { data: event, isLoading, isError, refetch } = useEvent(eventId)
  const currentUserId = useUserStore((s) => s.userId)
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'
  const { mutate, isPending } = useSetAttendance()
  const [activeAttendeeTab, setActiveAttendeeTab] = useState<AttendanceState>('ATTENDING')
  // Only load the full list to find series siblings when this event actually belongs to a group.
  const { data: allEvents } = useEvents(true, !!event?.recurringGroup)

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

  const attendeePanel = buildAttendeePanel(event)
  const filteredAttendees = attendeePanel[activeAttendeeTab].attendees
  const myAttribution = myAttendance ? attributionName(myAttendance, event.attendances) : null
  // The pips panel replaces RoleBreakdown only where a position carries a target; otherwise it has
  // nothing to show and RoleBreakdown stays as the fallback (⑥, same rule as the card).
  const hasPositionTargets = event.roster.positions.some((p) => p.required != null)

  // "Part of a series" peek: siblings are every event sharing this occurrence's recurring group.
  const siblings = event.recurringGroup
    ? (allEvents ?? []).filter((e) => e.recurringGroup === event.recurringGroup)
    : []
  const seriesPeek = event.recurringGroup ? buildSeriesPeek(siblings, event.id) : null

  return (
    <div>
      {/* Sticky sub-header — offset comes from --header-height via PageHeader, not a magic pixel */}
      <PageHeader title={event.title} backTo={routes.events} backLabel="Back to events" />

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
          <AttendanceToggle
            value={myState}
            disabled={isPending}
            onToggle={(state) => mutate({ eventId, userId: currentUserId, state })}
          />
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

      {/* Attendance list — tabbed */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
        {/* Tab bar */}
        <div className="flex border-b border-border/40">
          {ATTENDEE_TABS.map((tab) => {
            const isActive = activeAttendeeTab === tab.state
            const count = attendeePanel[tab.state].count
            return (
              <button
                key={tab.state}
                onClick={() => setActiveAttendeeTab(tab.state)}
                className={`relative flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${tab.badgeBg}`}>
                  {count}
                </span>
                {isActive && (
                  <span className={`absolute bottom-0 left-[10%] right-[10%] h-0.5 rounded-full ${tab.barColor}`} />
                )}
              </button>
            )
          })}
        </div>
        {/* Panel content */}
        <div className="p-1">
          {activeAttendeeTab === 'ATTENDING' &&
            (hasPositionTargets ? (
              <div className="border-b border-border/40 px-3 pb-3 pt-2">
                <RosterPips roster={event.roster} />
              </div>
            ) : (
              <RoleBreakdown breakdown={event.attendanceSummary.roleBreakdown} />
            ))}
          <AttendeeList
            attendees={filteredAttendees}
            allAttendees={event.attendances}
            roster={event.roster}
            grouped={activeAttendeeTab === 'ATTENDING'}
            onRespond={(userId, state) => mutate({ eventId, userId, state })}
            pending={isPending}
          />
        </div>
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
