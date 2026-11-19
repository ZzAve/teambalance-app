import { describe, expect, it } from 'vitest'
import type { Member } from '@shared/api/members'
import { sortByShirtNumber, toggleRole } from './roster'

describe('toggleRole', () => {
  it('demotes an admin to a user', () => {
    expect(toggleRole('ADMIN')).toBe('USER')
  })

  it('promotes a user to an admin', () => {
    expect(toggleRole('USER')).toBe('ADMIN')
  })
})

describe('sortByShirtNumber', () => {
  const m = (userId: string, shirtNumber?: number): Member =>
    ({ userId, displayName: userId, role: 'USER', position: undefined, onboarded: true, shirtNumber, photoVersion: undefined })

  it('orders members by shirt number, members without one last in their original order', () => {
    const members = [m('none-a'), m('twelve', 12), m('one', 1), m('none-b'), m('hundred', 112)]
    expect(sortByShirtNumber(members).map((x) => x.userId)).toEqual(['one', 'twelve', 'hundred', 'none-a', 'none-b'])
  })
})
