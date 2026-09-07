import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import { Avatar } from '@shared/ui/avatar'
import { AttendanceToggle, type AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { groupAttendeesByPosition, type AttendeePositionGroup } from '@entities/event/lib/attendee-groups'
import { attributionName } from '@entities/event/lib/attribution'

interface AttendeeListProps {
  /** Everyone on the event — every position section lists all its members, whatever their answer. */
  attendees: AttendanceEntry[]
  roster: EventRoster
  /** Fires with the *target* member's id — trust-based editing lets a member set a teammate's answer. */
  onRespond: (userId: string, state: AttendanceState) => void
  /** The viewer, so their own row is marked and its edit skips the "changing …" notice. */
  currentUserId?: string | null
  /** An attendance write is in flight; the open control is held. */
  pending?: boolean
}

// A subtle wash + left accent in the answer's colour, so the list reads at a glance while collapsed.
const ROW_TINT: Record<AttendanceState, string> = {
  ATTENDING: 'border-l-green bg-green/5',
  MAYBE: 'border-l-gold bg-gold/5',
  ABSENT: 'border-l-red bg-red/5',
  NOT_RESPONDED: 'border-l-border bg-transparent',
}

// The collapsed answer pill. Awaiting is a quiet neutral — in this list it is a fact about a teammate,
// not the loud call-to-act the viewer's own "Your response" prompt carries.
const ANSWER_PILL: Record<AttendanceState, { label: string; className: string }> = {
  ATTENDING: { label: 'Going', className: 'bg-green/10 text-green' },
  MAYBE: { label: 'Maybe', className: 'bg-gold/20 text-gold-dark' },
  ABSENT: { label: "Can't", className: 'bg-red/10 text-red' },
  NOT_RESPONDED: { label: 'Awaiting', className: 'bg-muted text-muted-foreground' },
}

/**
 * The event-detail attendance list: no tabs. Everyone is shown under their position (Unassigned last),
 * tinted by their answer, each row a collapsed answer pill that expands to the three-way control —
 * the same disclosure the event card uses, so the interaction is one thing app-wide. Editing anyone
 * is a deliberate two steps; the viewer's own fast path is the "Your response" control above the list.
 * Opening a teammate's control carries a quiet "Changing …" notice (a member may set a teammate's
 * answer — ADR-0003 — but should know they are). A row a teammate last changed reads `set by …` (⑪).
 *
 * Prop-only apart from which row is open (ADR-0017): grouping and name resolution are pure helpers,
 * and the mutation (and its Undo toast) live in the route container. Rows keep their roster order —
 * an answer changing must not make the list jump.
 */
export function AttendeeList({ attendees, roster, onRespond, currentUserId, pending = false }: AttendeeListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (attendees.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No one</p>
  }

  const groups = groupAttendeesByPosition(attendees, roster)

  const renderRow = (attendance: AttendanceEntry, showRole: boolean) => (
    <AttendeeRow
      key={attendance.userId}
      attendance={attendance}
      attribution={attributionName(attendance, attendees)}
      isSelf={attendance.userId === currentUserId}
      showRole={showRole}
      expanded={expandedId === attendance.userId}
      pending={pending}
      onToggle={() => setExpandedId((id) => (id === attendance.userId ? null : attendance.userId))}
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
          <PositionGroup key={group.positionLabel} group={group} renderRow={(a) => renderRow(a, false)} />
        ))}
      </div>
    )
  }

  return <div className="py-1">{attendees.map((a) => renderRow(a, true))}</div>
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
  isSelf,
  showRole,
  expanded,
  pending,
  onToggle,
  onRespond,
}: {
  attendance: AttendanceEntry
  attribution: string | null
  isSelf: boolean
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
  const pill = ANSWER_PILL[attendance.state]

  return (
    <div>
      <div className={`flex items-center gap-3 border-l-[3px] px-2.5 py-1.5 ${ROW_TINT[attendance.state]}`}>
        <Avatar userId={attendance.userId} name={attendance.displayName} />
        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm leading-tight">
            {attendance.displayName}
            {isSelf && (
              <span className="ml-1.5 rounded-full bg-blue/10 px-1.5 py-0.5 align-[1px] text-[10px] font-bold tracking-wide text-blue">
                You
              </span>
            )}
          </span>
          {subtitle && <span className="block text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        {/* The collapsed answer pill is the disclosure trigger — same interaction as the event card. */}
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggle}
          className="flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-1 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pill.className}`}>{pill.label}</span>
          <ChevronDown
            size={14}
            aria-hidden
            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
          <span className="sr-only">
            {expanded ? 'Hide answer options' : `Change ${attendance.displayName}'s answer`}
          </span>
        </button>
      </div>

      {expanded && (
        <div
          className="border-t border-dashed border-border px-2.5 pb-3 pt-2.5"
          role="group"
          aria-label={`${attendance.displayName}'s answer`}
        >
          {/* You may set a teammate's answer (ADR-0003), but you should know you're doing it. */}
          {!isSelf && (
            <p className="mb-2 text-xs text-muted-foreground">
              Changing <span className="font-semibold text-foreground">{attendance.displayName}</span>’s answer
            </p>
          )}
          <AttendanceToggle value={attendance.state} disabled={pending} onToggle={onRespond} />
        </div>
      )}
    </div>
  )
}
