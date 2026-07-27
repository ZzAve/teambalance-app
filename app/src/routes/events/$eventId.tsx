import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useEvent, useEvents, type AttendanceEntry } from '@shared/api/events'
import { useSetAttendance } from '@shared/api/attendances'
import { useUserStore } from '@shared/stores/user-store'
import { Button } from '@shared/ui/button'
import { EventTypeBadge } from '@entities/event/ui/EventTypeBadge'
import { EventTypeIcon } from '@entities/event/ui/EventTypeIcon'
import { ReferenceChips } from '@entities/event/ui/ReferenceChips'
import { RoleBreakdown } from '@entities/event/ui/RoleBreakdown'
import { SeriesPeek } from '@entities/event/ui/SeriesPeek'
import { buildAttendeePanel } from '@entities/event/lib/attendee-panel'
import { buildSeriesPeek } from '@entities/event/lib/series-peek'
import { AttendanceToggle, type AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { EditEventDialog } from '@features/edit-event/ui/EditEventDialog'
import { DeleteEventDialog } from '@features/edit-event/ui/DeleteEventDialog'

export const Route = createFileRoute('/events/$eventId')({
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
  { state: 'ABSENT', label: 'Absent', barColor: 'bg-red-500', badgeBg: 'bg-red-500/10 text-red-500' },
  { state: 'NOT_RESPONDED', label: '?', barColor: 'bg-muted-foreground', badgeBg: 'bg-muted text-muted-foreground' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Stable color derived from name — cycles through a palette
const AVATAR_COLORS = [
  '#225C9C', // blue
  '#249E6C', // green
  '#F4B400', // gold
  '#E05252', // red
  '#7B5EA7', // purple
  '#E87C3E', // orange
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function AttendeeRow({ attendance }: { attendance: AttendanceEntry }) {
  const color = getAvatarColor(attendance.displayName)
  return (
    <div className="flex items-center gap-3 py-2 px-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {getInitials(attendance.displayName)}
      </div>
      <div className="min-w-0">
        <span className="block text-sm leading-tight">{attendance.displayName}</span>
        {attendance.role && (
          <span className="block text-xs text-muted-foreground">{attendance.role}</span>
        )}
      </div>
    </div>
  )
}

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const { data: event, isLoading } = useEvent(eventId)
  const currentUserId = useUserStore((s) => s.userId)
  const isAdmin = useUserStore((s) => s.role) === 'ADMIN'
  const { mutate, isPending } = useSetAttendance()
  const [activeAttendeeTab, setActiveAttendeeTab] = useState<AttendanceState>('ATTENDING')
  // Only load the full list to find series siblings when this event actually belongs to a group.
  const { data: allEvents } = useEvents(true, !!event?.recurringGroup)

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  if (!event) return <p>Event not found.</p>

  const date = new Date(event.startTime)
  const myAttendance = event.attendances.find((a) => a.userId === currentUserId)
  const myState: AttendanceState = (myAttendance?.state as AttendanceState) ?? 'NOT_RESPONDED'

  const attendeePanel = buildAttendeePanel(event)
  const filteredAttendees = attendeePanel[activeAttendeeTab].attendees

  // "Part of a series" peek: siblings are every event sharing this occurrence's recurring group.
  const siblings = event.recurringGroup
    ? (allEvents ?? []).filter((e) => e.recurringGroup === event.recurringGroup)
    : []
  const seriesPeek = event.recurringGroup ? buildSeriesPeek(siblings, event.id) : null

  return (
    <div>
      {/* Sticky sub-header with back navigation — sits below the app header */}
      <div className="sticky top-[57px] z-30 -mx-4 mb-2 flex items-center gap-2 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur-sm">
        <Link to="/" aria-label="Back to events">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h2 className="font-display truncate text-base font-semibold">{event.title}</h2>
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
          <AttendanceToggle
            value={myState}
            disabled={isPending}
            onToggle={(state) => mutate({ eventId, userId: currentUserId, state })}
          />
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
          {activeAttendeeTab === 'ATTENDING' && (
            <RoleBreakdown breakdown={event.attendanceSummary.roleBreakdown} />
          )}
          {filteredAttendees.map((a) => (
            <AttendeeRow key={a.userId} attendance={a} />
          ))}
          {filteredAttendees.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No one</p>
          )}
        </div>
      </div>

      {/* Part of a series peek */}
      {seriesPeek && <SeriesPeek peek={seriesPeek} />}

      {/* Admin Actions — single-event ("This event") edit/delete; bulk scopes are Phase 3 */}
      {isAdmin && (
        <div className="mt-6 flex gap-2.5 border-t border-border/40 pt-5">
          <EditEventDialog event={event} />
          <DeleteEventDialog eventId={event.id} title={event.title} partOfSeries={!!event.recurringGroup} />
        </div>
      )}
    </div>
  )
}
