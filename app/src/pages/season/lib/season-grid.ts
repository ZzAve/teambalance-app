import type { Event } from '@shared/api/events'
import type { Season } from '@shared/api/season'
import { lineupRows, type LineupRow, type LineupState } from '@entities/event/lib/lineup'

/**
 * The season grid's view model: members down the side grouped by Position, the season's events
 * across, one Attendance State per cell. The grouping and the per-Position verdicts come from
 * `lineupRows`, the lineup panel's own model, so the grid and the panel cannot disagree.
 */

/** Null where the member is not on that event (they joined after it). */
export type CellState = LineupState | null

export interface SeasonColumn {
  event: Event
  isPast: boolean
  /** The lineup rows of this event's targeted Positions, by label. Empty for an event without targets. */
  verdicts: Record<string, LineupRow>
}

export interface SeasonMemberRow {
  userId: string
  displayName: string
  states: CellState[]
  /** Attending over the past events the member was on, 0..1; null before any has started. */
  attendedShare: number | null
}

export interface SeasonGrid {
  columns: SeasonColumn[]
  /** How many columns lie before now: the today marker goes after them. */
  pastCount: number
  groups: { label: string; members: SeasonMemberRow[] }[]
  /** Every Position some column has a target for, in the team's order. */
  verdictLabels: string[]
}

const localDay = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** The events whose start day falls in the Season (bounds inclusive; an open bound is no bound), oldest first. */
export function inSeason(events: Event[], season: Season): Event[] {
  return events
    .filter((e) => {
      const day = localDay(e.startTime)
      return (!season.start || day >= season.start) && (!season.end || day <= season.end)
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

/** [events] must be oldest first (see [inSeason]). */
export function seasonGrid(events: Event[], positionOrder: string[], now: Date): SeasonGrid {
  const columns = events.map((event) => ({
    event,
    isPast: new Date(event.startTime) < now,
    verdicts: Object.fromEntries(
      lineupRows(event.attendances, event.roster, null, event.substitutes, positionOrder)
        .filter((r) => r.required != null)
        .map((r) => [r.label, r]),
    ),
  }))
  const pastCount = columns.filter((c) => c.isPast).length

  // Every event lists every current member, so the latest one gives the roster and each Position.
  const latest = events.at(-1)
  const groups = latest
    ? lineupRows(latest.attendances, latest.roster, null, [], positionOrder)
        .filter((r) => r.members.length > 0)
        .map((r) => ({ label: r.label, members: r.members.map((m) => memberRow(m.userId, m.displayName, columns)) }))
    : []

  const targeted = new Set(columns.flatMap((c) => Object.keys(c.verdicts)))
  const rank = (label: string) => (positionOrder.includes(label) ? positionOrder.indexOf(label) : positionOrder.length)
  const verdictLabels = [...targeted].sort((a, b) => rank(a) - rank(b))

  return { columns, pastCount, groups, verdictLabels }
}

function memberRow(userId: string, displayName: string, columns: SeasonColumn[]): SeasonMemberRow {
  const states = columns.map((c) => c.event.attendances.find((a) => a.userId === userId)?.state ?? null)
  const past = states.filter((s, i) => s !== null && columns[i].isPast)
  return {
    userId,
    displayName,
    states,
    attendedShare: past.length === 0 ? null : past.filter((s) => s === 'ATTENDING').length / past.length,
  }
}

/** Click-to-cycle on a cell: attending, maybe, absent, round again. A blank starts at attending. */
export function nextState(state: LineupState): LineupState {
  return state === 'ATTENDING' ? 'MAYBE' : state === 'MAYBE' ? 'ABSENT' : 'ATTENDING'
}
