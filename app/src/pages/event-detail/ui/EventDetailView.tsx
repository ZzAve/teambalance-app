import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import type { EventDetail } from '@shared/api/events'
import { Button } from '@shared/ui/button'
import { QueryErrorState } from '@shared/ui/QueryErrorState'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { EventTypeBadge } from '@entities/event/ui/EventTypeBadge'
import { EventTypeIcon } from '@entities/event/ui/EventTypeIcon'
import { EventDetailSkeleton } from '@entities/event/ui/EventDetailSkeleton'
import { ReferenceChips } from '@entities/event/ui/ReferenceChips'
import { RoleBreakdown } from '@entities/event/ui/RoleBreakdown'
import { RosterBar } from '@entities/event/ui/RosterBar'
import { SeriesPeek } from '@entities/event/ui/SeriesPeek'
import type { SeriesPeek as SeriesPeekModel } from '@entities/event/lib/series-peek'
import { AttendeeList } from '@widgets/attendee-list/ui/AttendeeList'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { AttendanceToggle, type AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'

interface EventDetailViewProps {
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  /** Where "Back to events" goes. */
  backTo: string
  event: EventDetail | null
  currentUserId: string | null
  myState: AttendanceState
  /** Who last set the viewer's own answer, when it was a teammate (⑪). */
  myAttribution: string | null
  isPending?: boolean
  /** The viewer changing their own answer. */
  onToggleMine: (state: AttendanceState) => void
  /** Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream. */
  onRespond: (userId: string, state: AttendanceState) => void
  seriesPeek: SeriesPeekModel | null
  /** Scoped series edit/delete (ADR-0014 Phase 3); absent for members. */
  adminActions?: ReactNode
}

/**
 * The event-detail page laid out (ADR-0032 §3): load and error shells, then the header, roster
 * bar, the viewer's response, description, references, the attendance list, the series peek and
 * the admin actions. Prop-only — the mutation, its cross-member Undo toast and the sibling lookup
 * stay in the route; the story renders every section with zero network.
 */
export function EventDetailView({
  isLoading,
  isError,
  onRetry,
  backTo,
  event,
  currentUserId,
  myState,
  myAttribution,
  isPending = false,
  onToggleMine,
  onRespond,
  seriesPeek,
  adminActions,
}: EventDetailViewProps) {
  if (isLoading) return <EventDetailSkeleton />
  if (isError)
    return (
      <QueryErrorState
        title="Couldn't load this event"
        description="Something went wrong on our end. Give it another try."
        onRetry={() => onRetry?.()}
      >
        <Button asChild variant="ghost">
          <Link to={backTo}>Back to events</Link>
        </Button>
      </QueryErrorState>
    )
  if (!event) return <p>Event not found.</p>

  const date = new Date(event.startTime)
  // Two independent questions, and conflating them is what used to lose the headcount here (#271 ⑥).
  // The bar shows for ANY tracked roster — with position targets it counts slots, without them it
  // counts people (a target fraction, or a plain tally). RoleBreakdown is the per-role fallback and
  // still turns on the narrower question: it survives only where no position carries a target, since
  // there the bar states a total but nothing about who plays where.
  const hasPositionTargets = event.roster.positions.some((p) => p.required != null)
  const showRosterBar = hasPositionTargets || event.roster.trackRoster

  return (
    <div>
      {/* Sticky sub-header — offset comes from --header-height via PageHeader, not a magic pixel. */}
      <PageHeader title={event.title} backTo={backTo} backLabel="Back to events" />

      {/* Event header */}
      <div className="mt-2 flex items-start gap-4">
        <EventTypeIcon type={event.eventType} size="md" />
        <div className="min-w-0">
          <EventTypeBadge type={event.eventType} />
          <h1 className="font-display text-title font-bold leading-tight">{event.title}</h1>
          <p className="mt-1 text-small text-muted-foreground">
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
              className="mt-0.5 flex items-center gap-1 text-small text-muted-foreground hover:text-blue hover:underline"
            >
              <MapPin size={13} className="shrink-0" />
              {event.location}
            </a>
          )}
        </div>
      </div>

      {/* Roster overview — sits high, right under the event identity, so completeness reads before
          the response/info sections rather than being buried below them. It scrolls with the page:
          pinning it made it float over the sections beneath and clip them.
          Shows for any tracked roster (#317): position targets count slots, otherwise a headcount
          or plain tally; RoleBreakdown stays the per-role fallback where no position is targeted (⑥). */}
      {showRosterBar && (
        <div className="mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
          <RosterBar roster={event.roster} />
        </div>
      )}

      {/* Your Response */}
      {currentUserId && (
        <div className="mt-6">
          <SectionLabel as="p" className="mb-3">
            Your response
          </SectionLabel>
          {/* Named group so this primary control is distinct from the per-row controls in the list
              below — the viewer now has a row of their own there too. */}
          <div role="group" aria-label="Your response">
            <AttendanceToggle value={myState} disabled={isPending} onToggle={onToggleMine} />
          </div>
          {/* You learn a teammate changed your answer right where you would change it back (⑪). */}
          {myAttribution && <p className="mt-2 text-caption text-muted-foreground">set by {myAttribution}</p>}
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="mt-6 rounded-lg border border-border/40 bg-card p-4 shadow-sm">
          <SectionLabel as="p" className="mb-2">
            Description
          </SectionLabel>
          <p className="text-small leading-relaxed text-muted-foreground">{event.description}</p>
        </div>
      )}

      {/* Additional info — the event's References (Nevobo, match form, …), shown in full */}
      {event.references.length > 0 && (
        <div className="mt-6 rounded-lg border border-border/40 bg-card p-4 shadow-sm">
          <SectionLabel as="p" className="mb-3">
            Additional info
          </SectionLabel>
          <ReferenceChips references={event.references} max={event.references.length} />
        </div>
      )}

      {/* Attendance — one list by position, no tabs. The roster bar (above) shows for any
          tracked roster; where no position carries a target RoleBreakdown stays as the per-role
          fallback (⑥). */}
      <div className="mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
        {!hasPositionTargets && <RoleBreakdown breakdown={event.attendanceSummary.roleBreakdown} />}
        <AttendeeList
          attendees={event.attendances}
          roster={event.roster}
          currentUserId={currentUserId}
          onRespond={onRespond}
          pending={isPending}
        />
      </div>

      {/* Part of a series peek */}
      {seriesPeek && <SeriesPeek peek={seriesPeek} />}

      {/* Admin Actions — scoped series edit/delete (ADR-0014 Phase 3); standalone events skip the prompt */}
      {adminActions && (
        <div className="mt-6 flex gap-2.5 border-t border-border/40 pt-5">{adminActions}</div>
      )}
    </div>
  )
}
