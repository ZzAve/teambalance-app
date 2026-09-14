import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import type { LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway. A full volleyball squad, in memory, never persisted.
 *
 * The dev database seeds two members and no position targets, which is not enough to judge any of
 * these layouts: the whole question is how ~14 people across 6 positions read on a card. Off by
 * default (`?demo=1` turns it on) so the same variants can also be looked at against whatever real
 * data the viewer has.
 *
 * Deliberately awkward: one position over-subscribed, one covered exactly, one short, one with
 * nobody at all, an untargeted staff row, and two people with no position — every row shape the
 * variants have to survive, on one card.
 */

interface Seed {
  name: string
  role: string
  state: LineupState
}

const SQUAD: Seed[] = [
  { name: 'Anna Bakker', role: 'Setter', state: 'ATTENDING' },
  { name: 'Bram de Vries', role: 'Setter', state: 'ATTENDING' },
  { name: 'Carmen Jansen', role: 'Setter', state: 'ABSENT' },

  { name: 'Daan Willems', role: 'Outside Hitter', state: 'ATTENDING' },
  { name: 'Eva Smit', role: 'Outside Hitter', state: 'ATTENDING' },
  { name: 'Femke Koning', role: 'Outside Hitter', state: 'ATTENDING' },
  { name: 'Gijs Mulder', role: 'Outside Hitter', state: 'ATTENDING' },
  { name: 'Hanna Vos', role: 'Outside Hitter', state: 'ATTENDING' },
  { name: 'Ivo Peters', role: 'Outside Hitter', state: 'MAYBE' },
  { name: 'Julia Meijer', role: 'Outside Hitter', state: 'NOT_RESPONDED' },

  { name: 'Koen Bos', role: 'Middle Blocker', state: 'ATTENDING' },
  { name: 'Lotte Dijkstra', role: 'Middle Blocker', state: 'MAYBE' },
  { name: 'Mees van Dam', role: 'Middle Blocker', state: 'NOT_RESPONDED' },

  { name: 'Nina Hendriks', role: 'Libero', state: 'ABSENT' },

  { name: 'Olivier Sanders', role: 'Opposite', state: 'ATTENDING' },

  { name: 'Pien Groot', role: 'Coach', state: 'ATTENDING' },

  { name: 'Quinn Aalders', role: 'Unassigned', state: 'MAYBE' },
  { name: 'Roos Timmer', role: 'Unassigned', state: 'NOT_RESPONDED' },
]

const POSITIONS: { label: string; required?: number; staff?: boolean }[] = [
  { label: 'Setter', required: 2 },
  { label: 'Outside Hitter', required: 4 },
  { label: 'Middle Blocker', required: 2 },
  { label: 'Libero', required: 1 },
  { label: 'Opposite', required: 1 },
  { label: 'Coach', staff: true },
]

/** Stable ids, so avatar colours stay put across renders and answer changes. */
const id = (name: string) => `demo-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`

/** The viewer, in demo mode — Eva is an Outside Hitter, so `You` lands inside a busy row. */
export const DEMO_SELF_ID = id('Eva Smit')

export function demoAttendances(): AttendanceEntry[] {
  return SQUAD.map((m) => ({
    id: id(m.name),
    userId: id(m.name),
    displayName: m.name,
    role: m.role,
    state: m.state,
    changedBy: undefined,
    updatedAt: undefined,
  }))
}

/** The roster the server would have computed for [attendances] — recomputed so demo edits move it. */
export function demoRoster(attendances: AttendanceEntry[]): EventRoster {
  const attendingIn = (label: string) =>
    attendances.filter((a) => a.role === label && a.state === 'ATTENDING').length

  const positions = POSITIONS.map((p) => ({
    id: `demo-pos-${p.label.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    label: p.label,
    required: p.required,
    attending: attendingIn(p.label),
    kind: (p.staff ? 'STAFF' : 'PLAYING') as EventRoster['positions'][number]['kind'],
  }))

  const attending = attendances.filter((a) => a.state === 'ATTENDING')
  const staffLabels = new Set(POSITIONS.filter((p) => p.staff).map((p) => p.label))
  const staffAttending = attending.filter((a) => staffLabels.has(a.role)).length
  const openSlots = positions.reduce(
    (sum, p) => sum + (p.required == null ? 0 : Math.max(0, p.required - p.attending)),
    0,
  )
  const anyEmpty = positions.some((p) => p.required != null && p.attending === 0)

  return {
    trackRoster: true,
    totalTarget: 10,
    totalAttending: attending.length,
    playingAttending: attending.length - staffAttending,
    staffAttending,
    positions,
    unassignedAttending: attending.filter((a) => a.role === 'Unassigned').length,
    openSlots,
    state: anyEmpty ? 'CRITICAL' : openSlots > 0 ? 'SPOTS_OPEN' : 'LINEUP_SET',
  }
}
