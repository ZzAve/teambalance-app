import { describe, expect, it } from 'vitest'
import { makeAttendee, makeEvent, makeRoster } from '@shared/testing/event-fixtures'
import { inSeason, nextState, seasonGrid } from './season-grid'

const NOW = new Date('2026-10-15T12:00:00+02:00')
const ORDER = ['Setter', 'Libero']

const team = (states: Record<string, 'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'>) => [
  makeAttendee('u-anna', 'Anna', 'Setter', { state: states.anna ?? 'NOT_RESPONDED' }),
  makeAttendee('u-bram', 'Bram', 'Setter', { state: states.bram ?? 'NOT_RESPONDED' }),
  makeAttendee('u-nina', 'Nina', 'Libero', { state: states.nina ?? 'NOT_RESPONDED' }),
  makeAttendee('u-tom', 'Tom', 'Unassigned', { state: states.tom ?? 'NOT_RESPONDED' }),
]

const TARGETS = makeRoster({
  positions: [
    { id: 'p-setter', label: 'Setter', required: 1, attending: 0, kind: 'PLAYING' },
    { id: 'p-libero', label: 'Libero', required: 1, attending: 0, kind: 'PLAYING' },
  ],
  totalAttending: 0,
})

const PAST_1 = makeEvent({ id: 'e1', startTime: '2026-10-01T20:00:00+02:00', attendances: team({ anna: 'ATTENDING', bram: 'ABSENT' }) })
const PAST_2 = makeEvent({ id: 'e2', startTime: '2026-10-08T20:00:00+02:00', attendances: team({ anna: 'ATTENDING', bram: 'ATTENDING' }) })
const MATCH = makeEvent({
  id: 'e3',
  startTime: '2026-10-20T20:00:00+02:00',
  attendances: team({ anna: 'ATTENDING', bram: 'ATTENDING' }),
  roster: TARGETS,
})

describe('inSeason', () => {
  it('keeps the events inside the season dates, oldest first', () => {
    const events = [MATCH, makeEvent({ id: 'old', startTime: '2026-08-20T20:00:00+02:00' }), PAST_1]
    expect(inSeason(events, { start: '2026-09-01', end: '2026-10-31' }).map((e) => e.id)).toEqual(['e1', 'e3'])
  })

  it('treats both bounds as inclusive days', () => {
    const events = [PAST_1, MATCH]
    expect(inSeason(events, { start: '2026-10-01', end: '2026-10-20' }).map((e) => e.id)).toEqual(['e1', 'e3'])
  })

  it('keeps every event when no season is configured', () => {
    expect(inSeason([MATCH, PAST_1], { start: undefined, end: undefined }).map((e) => e.id)).toEqual(['e1', 'e3'])
  })
})

describe('seasonGrid', () => {
  const grid = seasonGrid([PAST_1, PAST_2, MATCH], ORDER, NOW)

  it('groups the members by Position in the team’s order, Unassigned last', () => {
    expect(grid.groups.map((g) => g.label)).toEqual(['Setter', 'Libero', 'Unassigned'])
    expect(grid.groups[0].members.map((m) => m.displayName)).toEqual(['Anna', 'Bram'])
  })

  it('gives each member their state per column', () => {
    const bram = grid.groups[0].members[1]
    expect(bram.states).toEqual(['ABSENT', 'ATTENDING', 'ATTENDING'])
  })

  it('splits past from upcoming at now', () => {
    expect(grid.pastCount).toBe(2)
    expect(grid.columns.map((c) => c.isPast)).toEqual([true, true, false])
  })

  it('counts the attended share over past events only', () => {
    const [anna, bram] = grid.groups[0].members
    expect(anna.attendedShare).toBe(1)
    expect(bram.attendedShare).toBe(0.5)
  })

  it('has no attended share before the first event has started', () => {
    expect(seasonGrid([MATCH], ORDER, NOW).groups[0].members[0].attendedShare).toBeNull()
  })

  it('leaves a cell empty for a member who is not on that event', () => {
    const late = makeEvent({ id: 'e0', startTime: '2026-09-20T20:00:00+02:00', attendances: [] })
    const anna = seasonGrid([late, PAST_1], ORDER, NOW).groups[0].members[0]
    expect(anna.states).toEqual([null, 'ATTENDING'])
    expect(anna.attendedShare).toBe(1)
  })

  it('takes each column’s Position verdicts from the lineup rows, targeted Positions only', () => {
    expect(grid.verdictLabels).toEqual(['Setter', 'Libero'])
    expect(grid.columns[0].verdicts).toEqual({})
    const { Setter, Libero } = grid.columns[2].verdicts
    expect(Setter).toMatchObject({ attending: 2, required: 1, tone: 'covered' })
    expect(Libero).toMatchObject({ attending: 0, required: 1, tone: 'critical' })
  })
})

describe('nextState', () => {
  it('cycles attending, maybe, absent, and starts a blank at attending', () => {
    expect(nextState('NOT_RESPONDED')).toBe('ATTENDING')
    expect(nextState('ATTENDING')).toBe('MAYBE')
    expect(nextState('MAYBE')).toBe('ABSENT')
    expect(nextState('ABSENT')).toBe('ATTENDING')
  })
})
