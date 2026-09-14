import type { AttendanceEntry, EventRoster, RosterPosition } from '@shared/api/events'

/**
 * PROTOTYPE — throwaway. See PrototypeLineupPanel.tsx for the question this is answering.
 *
 * The one view model all three variants share: a row per position, its members already sorted by
 * answer, with the position's requirement kept alongside. Merging the pips panel and the member
 * list means neither of the two existing models fits — `rosterRows` knows the targets but not the
 * people, `groupAttendeesByPosition` knows the people but drops every empty position. This joins
 * them and is the only thing the variants agree on; the layouts below disagree about everything else.
 */

export type LineupState = AttendanceEntry['state']

/**
 * Descending likelihood of actually standing on the court: settled yes, then a soft yes, then a
 * silence that could still become a yes, then a settled no. That is the ordering claim to argue
 * with — swapping Awaiting and Can't is the obvious alternative and is a one-line change here.
 */
const STATE_ORDER: Record<LineupState, number> = {
  ATTENDING: 0,
  MAYBE: 1,
  NOT_RESPONDED: 2,
  ABSENT: 3,
}

export interface LineupMember {
  userId: string
  displayName: string
  state: LineupState
  isSelf: boolean
}

export interface LineupRow {
  id: string
  label: string
  /** null for a position that is merely attended, not targeted — and for Unassigned. */
  required: number | null
  /** Server-owned, never re-derived here (#219). */
  attending: number
  /** Excluded from the headcount target — shown, not counted (#281). */
  isStaff: boolean
  /** Everyone whose position this is, whatever they answered, in STATE_ORDER then name order. */
  members: LineupMember[]
  /** Required slots with nobody in them. Zero when untargeted. */
  openSlots: number
  /** Attending beyond required. Zero when untargeted or short. */
  surplus: number
  tone: 'covered' | 'short' | 'critical' | null
}

const UNASSIGNED = 'Unassigned'

/**
 * One row per position, in the roster's own order, with Unassigned last.
 *
 * Wider than `rosterRows` on purpose: a position everybody declined carries no attendees, so the
 * server drops it from `roster.positions` — but this panel lists non-attendees too, and a Libero row
 * reading "0/1, Dana can't" is precisely the row worth seeing. So the rows are the union of the
 * server's positions and the positions the attendees actually name.
 */
export function lineupRows(
  attendees: AttendanceEntry[],
  roster: EventRoster,
  currentUserId?: string | null,
): LineupRow[] {
  const byLabel = new Map<string, RosterPosition>(roster.positions.map((p) => [p.label, p]))
  // Server order first, then any position only the attendees know about (a stale label, or one
  // whose whole group declined).
  const labels = [...byLabel.keys()]
  for (const a of attendees) {
    if (a.role && a.role !== UNASSIGNED && !byLabel.has(a.role) && !labels.includes(a.role)) {
      labels.push(a.role)
    }
  }

  const rows = labels.map((label) => {
    const position = byLabel.get(label)
    const members = sortMembers(attendees.filter((a) => a.role === label), currentUserId)
    const required = position?.required ?? null
    const attending = position?.attending ?? members.filter((m) => m.state === 'ATTENDING').length
    return {
      id: position?.id ?? `label:${label}`,
      label,
      required,
      attending,
      isStaff: position?.kind === 'STAFF',
      members,
      openSlots: required == null ? 0 : Math.max(0, required - attending),
      surplus: required == null ? 0 : Math.max(0, attending - required),
      tone: tone(required, attending),
    }
  })

  const unassigned = attendees.filter((a) => !a.role || a.role === UNASSIGNED || !labels.includes(a.role))
  if (unassigned.length > 0) {
    rows.push({
      id: 'unassigned',
      label: UNASSIGNED,
      required: null,
      attending: unassigned.filter((a) => a.state === 'ATTENDING').length,
      isStaff: false,
      members: sortMembers(unassigned, currentUserId),
      openSlots: 0,
      surplus: 0,
      tone: null,
    })
  }

  return rows
}

function sortMembers(entries: AttendanceEntry[], currentUserId?: string | null): LineupMember[] {
  return entries
    .map((a) => ({
      userId: a.userId,
      displayName: a.displayName,
      state: a.state,
      isSelf: a.userId === currentUserId,
    }))
    .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.displayName.localeCompare(b.displayName))
}

function tone(required: number | null, attending: number): LineupRow['tone'] {
  if (required == null) return null
  if (attending === 0) return 'critical'
  return attending >= required ? 'covered' : 'short'
}

/** "3 of 5 positions covered", or null when nothing is targeted. Same fact the old panel headed with. */
export function coveredLine(rows: LineupRow[]): string | null {
  const targeted = rows.filter((r) => r.required != null)
  if (targeted.length === 0) return null
  return `${targeted.filter((r) => r.openSlots === 0).length} of ${targeted.length} covered`
}

/** Short label under a name, for the states that are not "going". */
export const STATE_WORD: Record<LineupState, string> = {
  ATTENDING: 'Going',
  MAYBE: 'Maybe',
  ABSENT: "Can't",
  NOT_RESPONDED: 'Awaiting',
}

/**
 * The row's news in words, not a fraction — "nobody yet" lands before "0/1" does, and the second
 * round of variants leads with it. Null for an untargeted row, which has nothing to fall short of.
 */
export function verdictWord(row: LineupRow): string | null {
  if (row.required == null) return null
  if (row.attending === 0) return 'nobody yet'
  if (row.openSlots > 0) return `needs ${row.openSlots} more`
  if (row.surplus > 0) return `${row.surplus} spare`
  return 'covered'
}

/** The rows that still want somebody, worst first — what a triage view leads with. */
export function gaps(rows: LineupRow[]): LineupRow[] {
  return rows
    .filter((r) => r.openSlots > 0)
    .sort((a, b) => Number(b.tone === 'critical') - Number(a.tone === 'critical') || b.openSlots - a.openSlots)
}

/** Who is worth asking for a gap: this position's maybes and silents first, then the settled noes. */
export function chaseable(row: LineupRow): LineupMember[] {
  const rank: Record<LineupState, number> = { MAYBE: 0, NOT_RESPONDED: 1, ABSENT: 2, ATTENDING: 3 }
  return row.members.filter((m) => m.state !== 'ATTENDING').sort((a, b) => rank[a.state] - rank[b.state])
}
