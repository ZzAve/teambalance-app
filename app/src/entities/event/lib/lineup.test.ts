import { describe, expect, it } from 'vitest'
import { makeAttendee, makeRoster, makeSubstitute } from '@shared/testing/event-fixtures'
import { comingLine, findSomeone, lineupRows, openLine, verdictWord } from './lineup'

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

  it('orders members by name, whatever they answered, so nobody moves when an answer changes', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Zoë', 'Setter', { state: 'ABSENT' }),
        makeAttendee('u2', 'Bram', 'Setter', { state: 'NOT_RESPONDED' }),
        makeAttendee('u3', 'Yara', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u4', 'Anna', 'Setter', { state: 'ATTENDING' }),
      ],
      roster(),
    )
    expect(rows[0].members.map((m) => m.displayName)).toEqual(['Anna', 'Bram', 'Yara', 'Zoë'])
  })

  it('orders rows by the team’s positions, so a row the server starts sending does not move', () => {
    // The server sent only Coach; Libero comes from an attendee and would otherwise be appended last.
    const rows = lineupRows(
      [makeAttendee('u1', 'Nina', 'Libero', { state: 'ATTENDING' })],
      roster([POSITIONS[2]]),
      null,
      [],
      ['Setter', 'Libero', 'Coach'],
    )
    expect(rows.map((r) => r.label)).toEqual(['Libero', 'Coach'])
  })

  it('lists members before substitutes, each in name order', () => {
    const rows = lineupRows([makeAttendee('u1', 'Zoë', 'Setter')], roster(), null, [
      makeSubstitute('s1', 'Anna', { position: { id: 'p-setter', label: 'Setter' } }),
    ])
    expect(rows[0].members.map((m) => m.displayName)).toEqual(['Zoë', 'Anna'])
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

  // ADR-0033: a Substitute sits in their Position group in any state, and an attending one fills a
  // spot there exactly like a Member, so the row's fraction agrees with the Roster bar.
  it('puts substitutes in their position row, counting the attending ones', () => {
    const rows = lineupRows([makeAttendee('u1', 'Anna', 'Setter')], roster(), null, [
      makeSubstitute('s1', 'Jan de Vries', { position: { id: 'p-setter', label: 'Setter' } }),
      makeSubstitute('s2', 'Mila Jansen', { position: { id: 'p-libero', label: 'Libero' }, state: 'MAYBE' }),
    ])
    expect(rows[0]).toMatchObject({ label: 'Setter', attending: 2, openSlots: 0 })
    expect(rows[0].members.map((m) => [m.displayName, m.isSubstitute])).toEqual([
      ['Anna', false],
      ['Jan de Vries', true],
    ])
    expect(rows[1]).toMatchObject({ label: 'Libero', attending: 0 })
    expect(rows[1].members[0]).toMatchObject({ userId: 's2', isSubstitute: true, state: 'MAYBE' })
  })

  it('puts a substitute without a position under Unassigned', () => {
    const rows = lineupRows([], roster(), null, [makeSubstitute('s1', 'Floater')])
    expect(rows.at(-1)).toMatchObject({ label: 'Unassigned', attending: 1 })
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

describe('openLine', () => {
  it('names the targeted positions still short, ignoring untargeted rows', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'A', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u2', 'B', 'Setter', { state: 'ATTENDING' }),
        makeAttendee('u3', 'C', 'Coach', { state: 'ATTENDING' }),
      ],
      roster(),
    )
    expect(openLine(rows)).toBe('Still open: Libero')
  })

  it('gives a count past two names', () => {
    const three = [...POSITIONS.slice(0, 2), { id: 'p-mid', label: 'Middle', required: 2, attending: 0, kind: 'PLAYING' as const }]
    expect(openLine(lineupRows([], roster(three)))).toBe('3 positions still open')
  })

  it('is null when every targeted position is covered, or nothing is targeted', () => {
    expect(openLine(lineupRows([makeAttendee('u1', 'A', 'Coach')], roster([POSITIONS[2]])))).toBeNull()
  })
})
describe('findSomeone', () => {
  it('uses "a" before a consonant and "an" before a vowel', () => {
    expect(findSomeone('Libero')).toBe('Find a Libero')
    expect(findSomeone('Outside')).toBe('Find an Outside')
  })

  it('keeps the label as the team wrote it, so an acronym stays one', () => {
    expect(findSomeone('DS')).toBe('Find a DS')
  })
})

describe('comingLine', () => {
  const LIBERO = { id: 'p-libero', label: 'Libero' }

  it('counts who is going as players, subs and each staff role', () => {
    const rows = lineupRows(
      [
        makeAttendee('u1', 'Anna', 'Setter'),
        makeAttendee('u2', 'Bram', 'Libero'),
        makeAttendee('u3', 'Cor', 'Coach'),
        makeAttendee('u4', 'Dirk', 'Setter', { state: 'MAYBE' }),
      ],
      roster(),
      null,
      [makeSubstitute('s1', 'Jan', { position: LIBERO }), makeSubstitute('s2', 'Mila', { state: 'MAYBE' })],
    )
    expect(comingLine(rows)).toBe('2 players · 1 sub · 1 Coach')
  })

  it('leaves out the subs when no Substitute is going', () => {
    const rows = lineupRows([makeAttendee('u1', 'Anna', 'Setter'), makeAttendee('u2', 'Cor', 'Coach')], roster())
    expect(comingLine(rows)).toBe('1 player · 1 Coach')
  })

  it('still counts the players when nobody else is going', () => {
    const rows = lineupRows([makeAttendee('u1', 'Anna', 'Setter'), makeAttendee('u2', 'Bram', 'Setter')], roster())
    expect(comingLine(rows)).toBe('2 players')
  })

  it('is null when nobody is going', () => {
    expect(comingLine(lineupRows([makeAttendee('u1', 'Anna', 'Setter', { state: 'ABSENT' })], roster()))).toBeNull()
  })
})
