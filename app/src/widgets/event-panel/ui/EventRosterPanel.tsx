import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { Event } from '@shared/api/events'
import { RosterPips } from '@entities/event/ui/RosterPips'
import { AttendeeList } from '@widgets/attendee-list/ui/AttendeeList'
import { PanelPreferencesBar } from '@features/event-panel-view/ui/PanelPreferencesBar'
import type { PanelView } from '@features/event-panel-view/model/panel-preferences'

/**
 * How many members the card's panel lists before handing the rest to the detail page (ADR-0030 §7).
 * Uncapped, one card on the member view is a screenful and the list stops being a list.
 */
export const MEMBER_CAP = 15

interface EventRosterPanelProps {
  event: Event
  view: PanelView
  onViewChange: (view: PanelView) => void
  defaultExpanded: boolean
  onDefaultExpandedChange: (defaultExpanded: boolean) => void
  /** The viewer, so their own row is marked `You`. */
  currentUserId?: string | null
  /** Where the capped remainder lives — this event's own detail page. */
  detailHref: string
}

/**
 * What the card's roster disclosure opens onto: the position pips, or the team, the member's choice
 * (ADR-0030 §5). Composed here rather than in `EventAnswerRow` because the member list is
 * `AttendeeList` — a widget — and the card is an entity; the events route injects this whole panel
 * as a node, which is also what keeps the card prop-only.
 *
 * The member list is `AttendeeList` itself, reused verbatim from the detail page and rendered
 * **read-only** (no `onRespond`): editing a teammate's attendance stays on detail-page rows (#271
 * ⑫), and the card's own answer row already handles the viewer's own answer.
 *
 * An event with roster tracking off has no pips to draw, so it always shows its members — which is
 * what finally gives a social something to expand to (#324 cause 3) and why it offers no view
 * switch: the other view would be blank.
 */
export function EventRosterPanel({
  event,
  view,
  onViewChange,
  defaultExpanded,
  onDefaultExpandedChange,
  currentUserId,
  detailHref,
}: EventRosterPanelProps) {
  const tracked = event.roster.trackRoster
  const showMembers = view === 'members' || !tracked
  const hidden = event.attendances.length - MEMBER_CAP

  return (
    <div>
      {showMembers ? (
        <>
          {/* Read-only on purpose — see the component note above (#271 ⑫). */}
          <AttendeeList
            attendees={event.attendances.slice(0, MEMBER_CAP)}
            roster={event.roster}
            currentUserId={currentUserId}
          />
          {hidden > 0 && (
            <Link
              to={detailHref}
              className="mt-2 flex items-center gap-1 px-2.5 text-xs font-semibold text-blue"
            >
              See all {event.attendances.length}
              <ArrowRight size={12} aria-hidden />
            </Link>
          )}
        </>
      ) : (
        <RosterPips roster={event.roster} />
      )}

      <PanelPreferencesBar
        view={tracked ? view : null}
        onViewChange={onViewChange}
        defaultExpanded={defaultExpanded}
        onDefaultExpandedChange={onDefaultExpandedChange}
      />
    </div>
  )
}
