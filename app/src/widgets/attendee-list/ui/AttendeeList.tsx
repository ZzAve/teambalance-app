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
  /** The viewer, so their own row is marked. */
  currentUserId?: string | null
  /** An attendance write is in flight; every control is held. */
  pending?: boolean
}

// A subtle wash + left accent in the answer's colour, so the list reads at a glance without opening
// anything. Awaiting is deliberately neutral — the absence of an answer should look like absence.
const ROW_TINT: Record<AttendanceState, string> = {
  ATTENDING: 'border-l-green bg-green/5',
  MAYBE: 'border-l-gold bg-gold/5',
  ABSENT: 'border-l-red bg-red/5',
  NOT_RESPONDED: 'border-l-border bg-transparent',
}

/**
 * The event-detail attendance list: no tabs. Everyone is shown under their position (Unassigned
 * last), tinted by their answer, with the three-way control on every row so a member can set anyone's
 * answer in one tap (⑫, ADR-0003 trust-based). A row a teammate last changed carries a quiet
 * `set by …` line (⑪). Falls back to a flat list when the roster carries no positions.
 *
 * Prop-only (ADR-0017): grouping and name resolution are pure helpers; the mutation lives in the
 * route container. Rows keep their roster order — an answer changing must not make the list jump.
 */
export function AttendeeList({ attendees, roster, onRespond, currentUserId, pending = false }: AttendeeListProps) {
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
      pending={pending}
      onRespond={(state) => onRespond(attendance.userId, state)}
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
  pending,
  onRespond,
}: {
  attendance: AttendanceEntry
  attribution: string | null
  isSelf: boolean
  showRole: boolean
  pending: boolean
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
    <div className={`flex items-center gap-3 border-l-[3px] px-2.5 py-2 ${ROW_TINT[attendance.state]}`}>
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
      <div role="group" aria-label={`${attendance.displayName}'s answer`}>
        <AttendanceToggle compact value={attendance.state} disabled={pending} onToggle={onRespond} />
      </div>
    </div>
  )
}
