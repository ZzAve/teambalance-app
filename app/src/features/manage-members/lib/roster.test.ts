import { describe, expect, it } from 'vitest'
import type { Member } from '@shared/api/members'
import { isLastAdmin, sortByShirtNumber, toggleRole } from './roster'

describe('toggleRole', () => {
  it('demotes an admin to a user', () => {
    expect(toggleRole('ADMIN')).toBe('USER')
  })

  it('promotes a user to an admin', () => {
    expect(toggleRole('USER')).toBe('ADMIN')
  })
})

describe('isLastAdmin', () => {
  const m = (userId: string, role: string): Member =>
    ({ userId, displayName: userId, role, position: undefined, onboarded: true, shirtNumber: undefined, photoVersion: undefined })

  it('is true for the only admin', () => {
    const members = [m('a', 'ADMIN'), m('b', 'USER')]
    expect(isLastAdmin(members, 'a')).toBe(true)
  })

  it('is false when another admin remains', () => {
    const members = [m('a', 'ADMIN'), m('b', 'ADMIN')]
    expect(isLastAdmin(members, 'a')).toBe(false)
  })

  it('is false for a non-admin even when there is one admin', () => {
    const members = [m('a', 'ADMIN'), m('b', 'USER')]
    expect(isLastAdmin(members, 'b')).toBe(false)
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
