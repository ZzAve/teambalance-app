import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import { Avatar } from '@shared/ui/avatar'
import { AttendanceToggle, type AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { groupAttendeesByPosition, type AttendeePositionGroup } from '@entities/event/lib/attendee-groups'
import { attributionName } from '@entities/event/lib/attribution'

interface AttendeeListProps {
  /** The rows to show — the people in the active tab's state. */
  attendees: AttendanceEntry[]
  /** The whole event roster, so a `changedBy` id resolves to a name from any tab, not just this one. */
  allAttendees: AttendanceEntry[]
  roster: EventRoster
  /** Group by position (the Going tab). Other tabs pass `false` and render flat. */
  grouped: boolean
  /** Fires with the *target* member's id — trust-based editing lets a member set a teammate's answer. */
  onRespond: (userId: string, state: AttendanceState) => void
  /** An attendance write is in flight; the open control is held. */
  pending?: boolean
}

/**
 * The event-detail attendance list. The Going tab is grouped by position (Unassigned last), so a
 * heading's `2/3` and the names beneath it are one fact at two altitudes (⑩); the other tabs render
 * flat. Every row taps open to the same three-way control for *that* member (⑫) — the write targets
 * the row's own id — and a row a teammate last changed carries a quiet `set by …` line (⑪).
 *
 * Prop-only apart from which row is expanded (ADR-0017): the grouping and name resolution are pure
 * helpers, and the mutation lives in the route container.
 */
export function AttendeeList({ attendees, allAttendees, roster, grouped, onRespond, pending = false }: AttendeeListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const groups = grouped ? groupAttendeesByPosition(attendees, roster) : null

  if (attendees.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No one</p>
  }

  const renderRow = (attendance: AttendanceEntry) => (
    <AttendeeRow
      key={attendance.userId}
      attendance={attendance}
      attribution={attributionName(attendance, allAttendees)}
      // Grouped rows sit under a position heading, so repeating the role on the row is noise.
      showRole={groups === null}
      expanded={expandedId === attendance.userId}
      pending={pending}
      onToggle={() => setExpandedId((current) => (current === attendance.userId ? null : attendance.userId))}
      onRespond={(state) => {
        onRespond(attendance.userId, state)
        setExpandedId(null)
      }}
    />
  )

  if (groups) {
    return (
      <div>
        {groups.map((group) => (
          <PositionGroup key={group.positionLabel} group={group} renderRow={renderRow} />
        ))}
      </div>
    )
  }

  return <div>{attendees.map(renderRow)}</div>
}

function PositionGroup({
  group,
  renderRow,
}: {
  group: AttendeePositionGroup
  renderRow: (a: AttendanceEntry) => React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 pb-1 pt-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">{group.positionLabel}</h3>
        {group.countLabel && (
          <span className="text-[11px] font-bold tabular-nums text-foreground/70">{group.countLabel}</span>
        )}
      </div>
      {group.attendees.map(renderRow)}
    </div>
  )
}

function AttendeeRow({
  attendance,
  attribution,
  showRole,
  expanded,
  pending,
  onToggle,
  onRespond,
}: {
  attendance: AttendanceEntry
  attribution: string | null
  showRole: boolean
  expanded: boolean
  pending: boolean
  onToggle: () => void
  onRespond: (state: AttendanceState) => void
}) {
  // Attribution takes the subtitle when present; otherwise, in the flat list only, the member's own
  // position — unless it is the non-informative "Unassigned".
  const subtitle = attribution
    ? `set by ${attribution}`
    : showRole && attendance.role && attendance.role !== 'Unassigned'
      ? attendance.role
      : null

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar userId={attendance.userId} name={attendance.displayName} />
        <div className="min-w-0 flex-1">
          <span className="block text-sm leading-tight">{attendance.displayName}</span>
          {subtitle && <span className="block text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        <ChevronDown
          size={16}
          aria-hidden
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
        <span className="sr-only">{expanded ? 'Hide answer options' : `Change ${attendance.displayName}'s answer`}</span>
      </button>

      {/* The three-way control — a sibling of the row button, never nested (no <button> in <button>).
          The group names whose answer this is, so it stays distinct from the viewer's own control. */}
      {expanded && (
        <div className="px-3 pb-3 pt-1" role="group" aria-label={`${attendance.displayName}'s answer`}>
          <AttendanceToggle value={attendance.state} disabled={pending} onToggle={onRespond} />
        </div>
      )}
    </div>
  )
}
