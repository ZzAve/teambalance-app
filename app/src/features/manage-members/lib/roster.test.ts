import { describe, expect, it } from 'vitest'
import type { Member } from '@shared/api/members'
import { isLastAdmin, toggleRole } from './roster'

describe('toggleRole', () => {
  it('demotes an admin to a user', () => {
    expect(toggleRole('ADMIN')).toBe('USER')
  })

  it('promotes a user to an admin', () => {
    expect(toggleRole('USER')).toBe('ADMIN')
  })
})

describe('isLastAdmin', () => {
  const m = (userId: string, role: string): Member => ({ userId, displayName: userId, role })

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
