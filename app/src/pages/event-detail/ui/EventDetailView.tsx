import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { AlignLeft, CalendarDays, CalendarPlus, ChevronRight, Clock, ExternalLink, Link2, MapPin } from 'lucide-react'
import type { EventDetail } from '@shared/api/events'
import { Button } from '@shared/ui/button'
import { InfoRow } from '@shared/ui/InfoRow'
import { MapsLink } from '@shared/ui/MapsLink'
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
import type { PositionRef } from '@entities/event/lib/lineup'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { AttendanceToggle, type AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { SubstitutesBlock, type SubstituteState } from '@features/call-in-substitutes/ui/SubstitutesBlock'
import { SubstituteSheet } from '@features/call-in-substitutes/ui/SubstituteSheet'
import { setByName } from '@entities/event/lib/attribution'

interface EventDetailViewProps {
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  /** Where "Back to events" goes. */
  backTo: string
  /** The member's calendar-links page; omitted for a Platform Admin acting as the team (ADR-0024). */
  calendarHref?: string
  event: EventDetail | null
  currentUserId: string | null
  myState: AttendanceState
  /** Who last set the viewer's own answer, when it was a teammate (⑪). */
  myAttribution: string | null
  isPending?: boolean
  /** A Substitute write is in flight; the Substitute controls are held. */
  isSubstitutePending?: boolean
  /** The viewer changing their own answer. */
  onToggleMine: (state: AttendanceState) => void
  /** Any row in the list, the viewer's included — a teammate's change raises the Undo toast upstream. */
  onRespond: (userId: string, state: AttendanceState) => void
  /** Any Member changing a Substitute's state on this event (ADR-0033). */
  onSetSubstituteState: (substituteId: string, state: SubstituteState) => void
  /** Takes a Substitute off this event; they stay on the Team's list. */
  onTakeOffSubstitute: (substituteId: string) => void
  /** Opens the picker for calling Substitutes in: for one Position from its nudge, else unfiltered. */
  onCallInSubstitutes: (position: PositionRef | null) => void
  seriesPeek: SeriesPeekModel | null
  /** Scoped series edit/delete (ADR-0014 Phase 3); absent for members. */
  adminActions?: ReactNode
}

/**
 * The event-detail page laid out (ADR-0032 §3): load and error shells, then one card with the
 * event's identity, description and references, the roster bar, the viewer's response, the
 * attendance list, the series peek and the admin actions. Prop-only — the mutation, its
 * cross-member Undo toast and the sibling lookup stay in the route; the story renders every
 * section with zero network.
 */
export function EventDetailView({
  isLoading,
  isError,
  onRetry,
  backTo,
  calendarHref,
  event,
  currentUserId,
  myState,
  myAttribution,
  isPending = false,
  isSubstitutePending = false,
  onToggleMine,
  onRespond,
  onSetSubstituteState,
  onTakeOffSubstitute,
  onCallInSubstitutes,
  seriesPeek,
  adminActions,
}: EventDetailViewProps) {
  // Which Substitute's sheet is open. Both their Position-group row and the block open it.
  const [openSubstituteId, setOpenSubstituteId] = useState<string | null>(null)

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
  const openSubstitute = event.substitutes.find((s) => s.substituteId === openSubstituteId)
  const showRosterBar = hasPositionTargets || event.roster.trackRoster

  return (
    <div>
      {/* Sticky sub-header — offset comes from --header-height via PageHeader, not a magic pixel. */}
      <PageHeader title={event.title} backTo={backTo} backLabel="Back to events" />

      {/* Event info — identity, then one icon-marked row per detail */}
      <div className="mt-2 rounded-lg border border-border/40 bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <EventTypeIcon type={event.eventType} size="md" />
          <div className="min-w-0">
            <EventTypeBadge type={event.eventType} />
            <h1 className="mt-1 font-display text-title font-bold leading-tight">{event.title}</h1>
          </div>
        </div>

        <dl className="mt-5 space-y-4 border-t border-border/40 pt-5 text-body">
          <InfoRow icon={CalendarDays} label="Date">
            {date.toLocaleDateString('nl-NL', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </InfoRow>
          <InfoRow icon={Clock} label="Time">
            {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </InfoRow>
          {event.location && (
            <InfoRow icon={MapPin} label="Location">
              <MapsLink
                location={event.location}
                className="inline-flex items-center gap-1.5 font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
              >
                {event.location}
                <ExternalLink size={14} className="shrink-0" aria-hidden />
              </MapsLink>
            </InfoRow>
          )}
          {event.description && (
            <InfoRow icon={AlignLeft} label="Description">
              <p className="leading-relaxed text-muted-foreground">{event.description}</p>
            </InfoRow>
          )}
          {/* The event's References (Nevobo, match form, …), shown in full */}
          {event.references.length > 0 && (
            <InfoRow icon={Link2} label="Additional info">
              <ReferenceChips references={event.references} max={event.references.length} />
            </InfoRow>
          )}
        </dl>

        {calendarHref && (
          <Link
            to={calendarHref}
            className="mt-5 flex items-center gap-2 border-t border-border/40 pt-4 text-small font-medium text-blue"
          >
            <CalendarPlus size={16} className="shrink-0" aria-hidden />
            Add your team's events to your calendar
            <ChevronRight size={16} className="ml-auto shrink-0" aria-hidden />
          </Link>
        )}
      </div>

      {/* Roster overview — sits high, right under the event identity, so completeness reads before
          the response section rather than being buried below it. It scrolls with the page:
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
          substitutes={event.substitutes}
          onOpenSubstitute={setOpenSubstituteId}
          onFindSubstitute={onCallInSubstitutes}
        />
      </div>

      {/* Substitutes — directly under the Position groups (ADR-0033). */}
      <SubstitutesBlock
        substitutes={event.substitutes}
        members={event.attendances}
        onSetState={onSetSubstituteState}
        onOpen={setOpenSubstituteId}
        onCallIn={() => onCallInSubstitutes(null)}
        pending={isSubstitutePending}
      />
      <SubstituteSheet
        substitute={openSubstitute ?? null}
        setBy={openSubstitute ? setByName(openSubstitute.changedBy, event.attendances) : null}
        onSetState={onSetSubstituteState}
        onTakeOff={onTakeOffSubstitute}
        onClose={() => setOpenSubstituteId(null)}
        pending={isSubstitutePending}
      />

      {/* Part of a series peek */}
      {seriesPeek && <SeriesPeek peek={seriesPeek} />}

      {/* Admin Actions — scoped series edit/delete (ADR-0014 Phase 3); standalone events skip the prompt */}
      {adminActions && (
        <div className="mt-6 flex gap-2.5 border-t border-border/40 pt-5">{adminActions}</div>
      )}
    </div>
  )
}

