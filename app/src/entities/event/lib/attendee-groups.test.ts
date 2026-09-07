import { describe, expect, it } from 'vitest'
import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { groupAttendeesByPosition } from './attendee-groups'

const attendee = (userId: string, role: string): AttendanceEntry => ({
  id: userId,
  userId,
  displayName: userId,
  role,
  state: 'ATTENDING',
  changedBy: undefined,
  updatedAt: undefined,
})

// makeRoster() default positions: Setter (2/2), Libero (1/1), Middle (1 of 2).
describe('groupAttendeesByPosition', () => {
  it('groups by position in the roster order, with Unassigned last', () => {
    const attendees = [
      attendee('u-mid', 'Middle'),
      attendee('u-set', 'Setter'),
      attendee('u-un', 'Unassigned'),
      attendee('u-lib', 'Libero'),
    ]

    const groups = groupAttendeesByPosition(attendees, makeRoster())

    expect(groups?.map((g) => g.positionLabel)).toEqual(['Setter', 'Libero', 'Middle', 'Unassigned'])
    // The fraction is the roster's own attending/required — the same fact the pips show.
    expect(groups?.map((g) => g.countLabel)).toEqual(['2/2', '1/1', '1/2', null])
    expect(groups?.find((g) => g.positionLabel === 'Setter')?.attendees.map((a) => a.userId)).toEqual(['u-set'])
  })

  it('omits positions that have no attendees', () => {
    const groups = groupAttendeesByPosition([attendee('u-set', 'Setter')], makeRoster())

    expect(groups?.map((g) => g.positionLabel)).toEqual(['Setter'])
  })

  it('collects roles that match no position into the Unassigned bucket', () => {
    // A stale role (its position was removed) still has a home rather than vanishing.
    const groups = groupAttendeesByPosition([attendee('u-x', 'Ghost'), attendee('u-un', 'Unassigned')], makeRoster())

    const unassigned = groups?.find((g) => g.positionLabel === 'Unassigned')
    expect(unassigned?.attendees.map((a) => a.userId)).toEqual(['u-x', 'u-un'])
  })

  it('returns null when the roster carries no positions (caller renders a flat list)', () => {
    expect(groupAttendeesByPosition([attendee('u-1', 'Unassigned')], NO_ROSTER)).toBeNull()
  })

  it('gives an untargeted position no fraction', () => {
    const roster: EventRoster = makeRoster({
      positions: [{ id: 'pos-coach', label: 'Coach', required: undefined, attending: 1 }],
      openSlots: 0,
      state: 'TALLY_ONLY',
    })

    const groups = groupAttendeesByPosition([attendee('u-coach', 'Coach')], roster)

    expect(groups).toEqual([{ positionLabel: 'Coach', countLabel: null, attendees: [expect.objectContaining({ userId: 'u-coach' })] }])
  })
})
