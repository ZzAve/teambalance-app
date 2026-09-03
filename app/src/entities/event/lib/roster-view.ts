import type { EventRoster, RosterPosition } from '@shared/api/events'

/**
 * The roster panel's whole view model, derived from the server-computed roster.
 *
 * The backend owns the *status* (#219): it decides `state` and `openSlots`, and this module never
 * re-derives them — it only turns those numbers into the words, tone and pips the card draws. Keep
 * it that way; a second status implementation here would be free to drift from the tested one.
 */

/** Which semantic colour a chip or row carries. Mirrors the attendance palette: green / gold / red. */
export type RosterTone = 'covered' | 'short' | 'critical'

export interface RosterChip {
  text: string
  tone: RosterTone
}

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

/**
 * The collapsed status chip, or null when the event shows none.
 *
 * Two states deliberately have no chip: tracking off is not a roster event at all, and a tally has
 * nothing to fall short of, so a chip would invent a judgement the team never asked for. Both still
 * differ from each other — the tally opens to a panel, the off event has none.
 */
export function rosterChip(roster: EventRoster): RosterChip | null {
  switch (roster.state) {
    case 'OFF':
    case 'TALLY_ONLY':
      return null
    case 'LINEUP_SET':
      return { text: 'Lineup set', tone: 'covered' }
    // Same words either way — the count is the news. The tone is what says whether somebody is
    // merely short or missing entirely, which is the difference between "chase later" and "chase now".
    case 'SPOTS_OPEN':
      return { text: `${roster.openSlots} ${plural(roster.openSlots, 'spot', 'spots')} open`, tone: 'short' }
    case 'CRITICAL':
      return { text: `${roster.openSlots} ${plural(roster.openSlots, 'spot', 'spots')} open`, tone: 'critical' }
    case 'HEADCOUNT_FULL':
      return { text: 'Full', tone: 'covered' }
    case 'HEADCOUNT_SHORT':
      return { text: `${roster.openSlots} more needed`, tone: 'short' }
  }
}

/** True when there is a panel to open — everything except a roster that isn't tracked at all. */
export function hasRosterPanel(roster: EventRoster): boolean {
  return roster.trackRoster
}

/**
 * "3 of 5 covered" for the panel header, or null when no position carries a target — a tally has
 * nothing to be a fraction of.
 */
export function coveredSummary(roster: EventRoster): string | null {
  const targeted = roster.positions.filter((p) => p.required != null)
  if (targeted.length === 0) return null
  const covered = targeted.filter((p) => p.attending >= (p.required ?? 0)).length
  return `${covered} of ${targeted.length} covered`
}

/** One slot's dot. `missing` is an open slot at a position with nobody at all — drawn in alarm. */
export type PipState = 'filled' | 'open' | 'missing'

export interface RosterRow {
  id: string
  label: string
  /** One entry per required slot. Empty for an untargeted position, which shows a plain count. */
  pips: PipState[]
  /** `2/3` for a targeted position, `2` for an untargeted one. */
  countLabel: string
  /** Attending beyond required, rendered as "+N". Zero when untargeted or short. */
  surplus: number
  tone: RosterTone | null
}

/**
 * One row per position the server sent, in the order it sent them (the team's own vocabulary order).
 * The server already dropped the positions that are neither targeted nor attended, so no filtering
 * happens here — what arrives is what shows.
 */
export function rosterRows(roster: EventRoster): RosterRow[] {
  return roster.positions.map((position) => ({
    id: position.id,
    label: position.label,
    pips: pipsFor(position),
    countLabel: position.required == null ? `${position.attending}` : `${position.attending}/${position.required}`,
    surplus: position.required == null ? 0 : Math.max(0, position.attending - position.required),
    tone: rowTone(position),
  }))
}

function pipsFor(position: RosterPosition): PipState[] {
  if (position.required == null) return []
  // A pip per required slot, filled left to right. Surplus attendees get no pip of their own — they
  // are the "+N", not an extra slot the team asked for.
  return Array.from({ length: position.required }, (_, i) =>
    i < position.attending ? 'filled' : position.attending === 0 ? 'missing' : 'open',
  )
}

function rowTone(position: RosterPosition): RosterTone | null {
  if (position.required == null) return null
  if (position.attending === 0) return 'critical'
  return position.attending >= position.required ? 'covered' : 'short'
}

/** The chase callout, split so the caller can bold the subject without owning any of the copy. */
export interface ChaseNudge {
  /** The subject — position names, or a count once naming them would be an inventory. */
  lead: string
  /** The rest of the sentence, already agreeing in number with `lead`. */
  rest: string
}

/**
 * The callout under the rows for targeted positions with nobody at all.
 *
 * It scales with how many are empty, because one shape cannot honestly cover all three. Naming a
 * single position and calling it "the one to chase" is the useful case and stays. Naming two is
 * still a nudge. From three on it becomes an inventory the rows above already print, so the count
 * carries it instead.
 *
 * What must not happen is the old behaviour: naming the *first* empty position and calling it "the
 * one to chase" regardless of how many others were also empty. On an event nobody has answered yet
 * that singled out one position and implied every other was covered.
 */
export function chaseNudge(roster: EventRoster): ChaseNudge | null {
  const empty = rosterRows(roster).filter((row) => row.pips.length > 0 && row.pips.every((p) => p === 'missing'))

  if (empty.length === 0) return null
  if (empty.length === 1) return { lead: empty[0].label, rest: 'still has no one — the one to chase.' }
  if (empty.length === 2) return { lead: `${empty[0].label} and ${empty[1].label}`, rest: 'still have no one.' }
  return { lead: `${empty.length} positions`, rest: 'still have no one.' }
}

/**
 * The soft nudge under the rows when attendees have no position set. Null when everyone coming has
 * one — this is a prompt, not a permanent label.
 */
export function unassignedNudge(roster: EventRoster): string | null {
  const n = roster.unassignedAttending
  if (n <= 0) return null
  return `${n} going ${plural(n, "hasn't", "haven't")} set a position`
}

/**
 * "7/12 going" whenever a headcount target exists at all.
 *
 * Where it lands depends on whether positions are also targeted: with them, the panel header belongs
 * to the covered fraction and this becomes a secondary line beneath the rows; without them, the
 * header is free and this fills it. Either way the chip already said "4 more needed" — the absolute
 * numbers are what the panel adds.
 */
export function headcountLine(roster: EventRoster): string | null {
  if (roster.totalTarget == null) return null
  return `${roster.totalAttending}/${roster.totalTarget} going`
}
