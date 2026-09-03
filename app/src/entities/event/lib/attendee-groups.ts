import type { AttendanceEntry, EventRoster } from '@shared/api/events'

export interface AttendeePositionGroup {
  /** The position's own label, or `Unassigned` for attendees with no position. */
  positionLabel: string
  /** `2/3` when the position carries a target; `null` for an untargeted position and Unassigned. */
  countLabel: string | null
  attendees: AttendanceEntry[]
}

const UNASSIGNED = 'Unassigned'

/**
 * Groups the given attendees by position, in the roster's own position order with the Unassigned
 * bucket last. Only positions that actually have someone are returned — an empty position is already
 * shown in the pips panel above, so a heading with no names beneath it would just be noise.
 *
 * The `countLabel` is the roster's own `attending/required` fraction, so the heading states the same
 * fact as the pips. Attendees whose `role` matches no current position (a stale label) fall into
 * Unassigned rather than vanishing.
 *
 * Returns `null` when the roster carries no positions at all — the caller renders the flat list.
 */
export function groupAttendeesByPosition(
  attendees: AttendanceEntry[],
  roster: EventRoster,
): AttendeePositionGroup[] | null {
  if (roster.positions.length === 0) return null

  const labels = new Set(roster.positions.map((p) => p.label))
  const groups: AttendeePositionGroup[] = []

  for (const position of roster.positions) {
    const members = attendees.filter((a) => a.role === position.label)
    if (members.length === 0) continue
    groups.push({
      positionLabel: position.label,
      countLabel: position.required == null ? null : `${position.attending}/${position.required}`,
      attendees: members,
    })
  }

  const unassigned = attendees.filter((a) => !labels.has(a.role))
  if (unassigned.length > 0) {
    groups.push({ positionLabel: UNASSIGNED, countLabel: null, attendees: unassigned })
  }

  return groups
}
