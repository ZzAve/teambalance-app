import type { AttendanceEntry, EventRoster, RosterPosition, SubstituteEntry } from '@shared/api/events'

/**
 * The lineup panel's view model: one row per position, each carrying the people who play it.
 *
 * Neither existing model fits, which is why this one exists. `roster-view` knows the *targets* but
 * not the people; `attendee-groups` knows the people but drops every position nobody attends. The
 * panel needs both at once — a Libero row reading "0/1, Nina can't" is precisely the row worth
 * seeing — so this joins them.
 *
 * **Where each number comes from matters.** `required` and `kind` are configuration and come from
 * the server's positions. `attending`, though, is counted from the very members this row renders,
 * rather than read off `RosterPosition.attending`. That is not a second implementation of the roster
 * status the backend owns (#219) — the panel never derives `RosterState` or the event-level
 * `openSlots`, which stay the server's and drive the readiness badge. It is the narrower rule that a
 * row must not contradict itself: the chips beside the fraction are the same people the fraction
 * counts, so an optimistic answer moves both together instead of turning a chip green next to a
 * count that still reads 1/2 (see `attendance-cache`, which deliberately leaves `roster` stale).
 */

export type LineupState = AttendanceEntry['state']

/**
 * Descending likelihood of actually standing on the court: a settled yes, a soft yes, a silence that
 * could still become a yes, then a settled no.
 */
const STATE_ORDER: Record<LineupState, number> = {
  ATTENDING: 0,
  MAYBE: 1,
  NOT_RESPONDED: 2,
  ABSENT: 3,
}

export interface LineupMember {
  /** A Member's user id; for a Substitute, who has no account, their substitute id. */
  userId: string
  displayName: string
  /**
   * What a chip prints: the first name, or the whole name when the first name alone would not say
   * who this is. See [withDistinctNames].
   */
  chipName: string
  state: LineupState
  /** The viewer, so the panel can mark their own chip and never squeeze it. */
  isSelf: boolean
  /** Called in from outside the Team (ADR-0033): shown with a "Sub" tag, and never the viewer. */
  isSubstitute: boolean
}

export interface LineupRow {
  id: string
  label: string
  /** Null for a position that is merely attended, not targeted — and for Unassigned. */
  required: number | null
  /** Counted from `members`, so the row can never disagree with the chips it draws. */
  attending: number
  /** A STAFF position is shown but excluded from the headcount target (#281). */
  isStaff: boolean
  /** Everyone whose position this is, whatever they answered, in STATE_ORDER then name order. */
  members: LineupMember[]
  /** Required slots with nobody in them. Zero when untargeted. */
  openSlots: number
  /** Attending beyond required. Zero when untargeted or short. */
  surplus: number
  tone: 'covered' | 'short' | 'critical' | null
}

export const UNASSIGNED = 'Unassigned'

/**
 * One row per position, in the roster's own order, with Unassigned last.
 *
 * Wider than `rosterRows` on purpose: the server drops a position nobody attends, but this panel
 * lists non-attendees too, so the rows are the union of the server's positions and the positions the
 * attendees actually name. A stale label nobody has cleaned up therefore still shows its people
 * rather than silently moving them to Unassigned.
 *
 * [substitutes] join the row of their Position, in whatever state they are, and an attending one
 * counts toward it like an attending Member (ADR-0033).
 */
export function lineupRows(
  attendees: AttendanceEntry[],
  roster: EventRoster,
  currentUserId?: string | null,
  substitutes: SubstituteEntry[] = [],
): LineupRow[] {
  const people = [
    ...attendees.map((a) => ({ entry: toMember(a, currentUserId), role: a.role })),
    ...substitutes.map((s) => ({ entry: substituteMember(s), role: s.position?.label })),
  ]
  const byLabel = new Map<string, RosterPosition>(roster.positions.map((p) => [p.label, p]))
  const labels = [...byLabel.keys()]
  for (const { role } of people) {
    if (role && role !== UNASSIGNED && !labels.includes(role)) labels.push(role)
  }

  const rows = labels.map((label) => {
    const position = byLabel.get(label)
    return row({
      id: position?.id ?? `label:${label}`,
      label,
      required: position?.required ?? null,
      isStaff: position?.kind === 'STAFF',
      members: sortMembers(people.filter((p) => p.role === label).map((p) => p.entry)),
    })
  })

  const unassigned = people.filter((p) => !p.role || !labels.includes(p.role)).map((p) => p.entry)
  if (unassigned.length > 0) {
    rows.push(
      row({
        id: 'unassigned',
        label: UNASSIGNED,
        required: null,
        isStaff: false,
        members: sortMembers(unassigned),
      }),
    )
  }

  return withDistinctNames(rows)
}

/**
 * Give every member a chip name that actually names them: the first name where that is unambiguous,
 * the whole name where it is not.
 *
 * A first name is the right default — it is what a teammate is called, and it is short enough for
 * chips to overlap without ever clipping. But it is only an identifier while it is unique, and a
 * roster with two Jans (or, in the seeded test team, an "E2E Tester" beside an "E2E Teammate")
 * renders two identical chips for two different people. That was the named risk when this design was
 * validated, and the first real squad it met hit it.
 *
 * Uniqueness is judged across the **whole panel**, not per row: a reader compares names down the
 * panel, and a member must not change how they are written by moving position. Falling all the way
 * back to the full name rather than adding a surname initial is deliberate — an initial does not
 * always disambiguate either ("E2E Tester" and "E2E Teammate" share one), and a rule that sometimes
 * works is worse than one that always does.
 */
function withDistinctNames(rows: LineupRow[]): LineupRow[] {
  const seen = new Map<string, number>()
  for (const member of rows.flatMap((r) => r.members)) {
    const first = firstNameOf(member.displayName)
    seen.set(first, (seen.get(first) ?? 0) + 1)
  }

  return rows.map((r) => ({
    ...r,
    members: r.members.map((m) => {
      const first = firstNameOf(m.displayName)
      return { ...m, chipName: (seen.get(first) ?? 0) > 1 ? m.displayName : first }
    }),
  }))
}

const firstNameOf = (displayName: string) => displayName.split(' ')[0]

function row(base: Omit<LineupRow, 'attending' | 'openSlots' | 'surplus' | 'tone'>): LineupRow {
  const attending = base.members.filter((m) => m.state === 'ATTENDING').length
  const { required } = base
  return {
    ...base,
    attending,
    openSlots: required == null ? 0 : Math.max(0, required - attending),
    surplus: required == null ? 0 : Math.max(0, attending - required),
    tone: required == null ? null : attending === 0 ? 'critical' : attending >= required ? 'covered' : 'short',
  }
}

function toMember(a: AttendanceEntry, currentUserId?: string | null): LineupMember {
  return {
    userId: a.userId,
    displayName: a.displayName,
    // Replaced by `withDistinctNames` once the whole panel is known.
    chipName: a.displayName,
    state: a.state,
    isSelf: a.userId === currentUserId,
    isSubstitute: false,
  }
}

function substituteMember(s: SubstituteEntry): LineupMember {
  return {
    userId: s.substituteId,
    displayName: s.name,
    chipName: s.name,
    state: s.state,
    isSelf: false,
    isSubstitute: true,
  }
}

function sortMembers(members: LineupMember[]): LineupMember[] {
  return members.sort(
    (a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.displayName.localeCompare(b.displayName),
  )
}

/**
 * The row's news in words — "nobody yet" lands before "0/1" does, which is the whole reason the
 * fraction is demoted to the edge. Null for an untargeted row, which has nothing to fall short of.
 */
export function verdictWord(row: LineupRow): string | null {
  if (row.required == null) return null
  if (row.attending === 0) return 'nobody yet'
  if (row.openSlots > 0) return `needs ${row.openSlots} more`
  if (row.surplus > 0) return `${row.surplus} spare`
  return 'covered'
}

/**
 * "3 of 5 covered" for the panel header, or null when no position carries a target — a tally or a
 * headcount-only roster has nothing to be a fraction of, and the caller falls back to a headcount.
 */
export function coveredLine(rows: LineupRow[]): string | null {
  const targeted = rows.filter((r) => r.required != null)
  if (targeted.length === 0) return null
  return `${targeted.filter((r) => r.openSlots === 0).length} of ${targeted.length} covered`
}

/**
 * "1 sub" for the panel header, beside the covered line: how many Substitutes are going, wherever
 * they sit — the same count as the Roster bar's "+ N substitutes" (ADR-0033). Null when none is.
 */
export function substituteLine(rows: LineupRow[]): string | null {
  const going = rows.flatMap((r) => r.members).filter((m) => m.isSubstitute && m.state === 'ATTENDING').length
  if (going === 0) return null
  return `${going} ${going === 1 ? 'sub' : 'subs'}`
}

/** Short label for a member's answer, used on chips and in the answer sheet. */
export const STATE_WORD: Record<LineupState, string> = {
  ATTENDING: 'Going',
  MAYBE: 'Maybe',
  ABSENT: "Can't",
  NOT_RESPONDED: 'Awaiting',
}

/** A Position as the Substitute picker is aimed at it: from an open spot, or a short group. */
export interface PositionRef {
  id: string
  label: string
}

/**
 * "Find a Libero": the words on every way into the picker for one Position. The label is the team's
 * own, so it keeps its casing; only the article follows it.
 */
export function findSomeone(positionLabel: string): string {
  return `Find ${/^[aeiou]/i.test(positionLabel) ? 'an' : 'a'} ${positionLabel}`
}
