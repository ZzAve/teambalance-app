import { describe, expect, it } from 'vitest'
import { makeAttendee, makeRoster } from '@shared/testing/event-fixtures'
import { coveredLine, lineupRows, verdictWord } from './lineup'

// Pure mapping, so a plain unit is the lowest layer that proves it (CLAUDE.md testing table). What
// the panel *looks* like in each of these shapes is a story; what the numbers are is here.

const POSITIONS = [
  { id: 'p-setter', label: 'Setter', required: 2, attending: 0, kind: 'PLAYING' as const },
  { id: 'p-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' as const },
  { id: 'p-coach', label: 'Coach', required: undefined, attending: 0, kind: 'STAFF' as const },
]

// No explicit `openSlots`: the fixture derives it from the positions and throws on a contradiction.
const roster = (positions = POSITIONS) => makeRoster({ positions, totalAttending: 0 })

describe('lineupRows', () => {
  it('gives every configured position a row, in the roster’s own order', () => {
    const rows = lineupRows([], roster())
    expect(rows.map((r) => r.label)).toEqual(['Setter', 'Libero', 'Coach'])
  })

  it('counts attending from the members it renders, not from the server’s position count', () => {
    // The panel draws these chips beside the fraction, so the two must come from one source — this
    // is what lets an optimistic answer move the chip and the count together (see lineup.ts).
    const stale = [{ ...POSITIONS[0], attending: 99 }, ...POSITIONS.slice(1)]
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Anna', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u2', 'Bram', 'Setter', { state: 'ABSENT' }),
      ],
      roster(stale),
    )
    expect(rows[0]).toMatchObject({ attending: 1, openSlots: 1, surplus: 0, tone: 'short' })
  })

  it('orders members by answer, then by name', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Zoë', 'Setter', { state: 'ABSENT' }),
        makeAttendee('u2', 'Bram', 'Setter', { state: 'NOT_RESPONDED' }),
        makeAttendee('u3', 'Yara', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u4', 'Anna', 'Setter', { state: 'ATTENDING' }),
      ],
      roster(),
    )
    expect(rows[0].members.map((m) => m.displayName)).toEqual(['Anna', 'Yara', 'Bram', 'Zoë'])
  })

  it('keeps a position whose whole group declined — the row worth seeing', () => {
    // The server drops a position nobody ATTENDS, so without this the people who said no would
    // vanish into Unassigned and "Libero 0/1, Nina can't" — the row the old pips panel could never
    // show — would be unreachable. The attendees' own label is what brings the row back.
    const rows = lineupRows(
      [makeAttendee('u1', 'Nina', 'Libero', { state: 'ABSENT' })],
      roster([POSITIONS[0], POSITIONS[2]]),
    )
    expect(rows.map((r) => r.label)).toEqual(['Setter', 'Coach', 'Libero'])
    expect(rows.find((r) => r.label === 'Libero')).toMatchObject({
      attending: 0,
      // Untargeted, because the target only exists on the position the server dropped.
      required: null,
      members: [expect.objectContaining({ displayName: 'Nina', state: 'ABSENT' })],
    })
  })

  it('takes the target from the server when it does send the position', () => {
    const rows = lineupRows([makeAttendee('u1', 'Nina', 'Libero', { state: 'ABSENT' })], roster())
    expect(rows.find((r) => r.label === 'Libero')).toMatchObject({ required: 1, attending: 0, tone: 'critical' })
  })

  it('gives a position only the attendees know about a row of its own, not Unassigned', () => {
    const rows = lineupRows(
      [makeAttendee('u1', 'Ida', 'Passer', { state: 'ATTENDING' })],
      roster(),
    )
    expect(rows.map((r) => r.label)).toEqual(['Setter', 'Libero', 'Coach', 'Passer'])
    expect(rows.find((r) => r.label === 'Passer')).toMatchObject({ required: null, tone: null })
  })

  it('collects members with no position into an Unassigned row, last', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Ida', 'Unassigned', { state: 'MAYBE' }),
        makeAttendee('u2', 'Joop', '', { state: 'ATTENDING' }),
      ],
      roster(),
    )
    expect(rows.at(-1)).toMatchObject({ label: 'Unassigned', attending: 1, required: null })
  })

  it('prints first names while they identify somebody', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Anna Bakker', 'Setter'),
        makeAttendee('u2', 'Bram de Vries', 'Setter'),
      ],
      roster(),
    )
    expect(rows[0].members.map((m) => m.chipName)).toEqual(['Anna', 'Bram'])
  })

  it('falls back to the whole name when a first name would name two people', () => {
    // The risk this design was validated against, and the first real squad hit it: the seeded team
    // has an "E2E Tester" beside an "E2E Teammate", which rendered two identical "E2E" chips.
    const rows = lineupRows(
      [
        makeAttendee('u1', 'E2E Tester', 'Setter'),
        makeAttendee('u2', 'E2E Teammate', 'Setter'),
        makeAttendee('u3', 'Nina Hendriks', 'Libero'),
      ],
      roster(),
    )
    expect(rows[0].members.map((m) => m.chipName)).toEqual(['E2E Teammate', 'E2E Tester'])
    // Everyone else keeps the short form — one collision does not cost the whole panel its brevity.
    expect(rows[1].members.map((m) => m.chipName)).toEqual(['Nina'])
  })

  it('judges the collision across the whole panel, not within one row', () => {
    // A member must not change how they are written by moving position.
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Jan Bakker', 'Setter'),
        makeAttendee('u2', 'Jan de Vries', 'Libero'),
      ],
      roster(),
    )
    expect(rows[0].members[0].chipName).toBe('Jan Bakker')
    expect(rows[1].members[0].chipName).toBe('Jan de Vries')
  })

  it('marks the viewer', () => {
    const rows = lineupRows(
      [makeAttendee('me', 'Eva', 'Setter', { state: 'ATTENDING' })],
      roster(),
      'me',
    )
    expect(rows[0].members[0].isSelf).toBe(true)
  })

  it('flags a staff row, which is shown but not counted toward the headcount', () => {
    expect(lineupRows([], roster()).find((r) => r.label === 'Coach')).toMatchObject({
      isStaff: true,
      required: null,
    })
  })
})

describe('verdictWord', () => {
  const rowFor = (n: number) =>
    lineupRows(
      Array.from({ length: n }, (_, i) => makeAttendee(`u${i}`, `M${i}`, 'Setter')),
      roster(),
    )[0]

  it('names the gap before it names the number', () => {
    expect(verdictWord(rowFor(0))).toBe('nobody yet')
    expect(verdictWord(rowFor(1))).toBe('needs 1 more')
    expect(verdictWord(rowFor(2))).toBe('covered')
    expect(verdictWord(rowFor(4))).toBe('2 spare')
  })

  it('withholds a verdict from an untargeted row — nothing to fall short of', () => {
    const coach = lineupRows([], roster()).find((r) => r.label === 'Coach')!
    expect(verdictWord(coach)).toBeNull()
  })
})

describe('coveredLine', () => {
  it('counts covered positions against targeted ones, ignoring untargeted rows', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'A', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u2', 'B', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u3', 'C', 'Coach', { state: 'ATTENDING' }),
      ],
      roster(),
    )
    expect(coveredLine(rows)).toBe('1 of 2 covered')
  })

  it('is null when nothing is targeted, so the caller can fall back to a headcount', () => {
    expect(coveredLine(lineupRows([], roster([POSITIONS[2]])))).toBeNull()
  })
})
