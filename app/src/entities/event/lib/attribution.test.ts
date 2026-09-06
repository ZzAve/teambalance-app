import { describe, expect, it } from 'vitest'
import type { AttendanceEntry } from '@shared/api/events'
import { attributionName } from './attribution'

const attendee = (overrides: Partial<AttendanceEntry> = {}): AttendanceEntry => ({
  id: 'att',
  userId: 'user-self',
  displayName: 'Me',
  role: 'Unassigned',
  state: 'ATTENDING',
  changedBy: undefined,
  updatedAt: undefined,
  ...overrides,
})

const tim = attendee({ id: 'a-tim', userId: 'user-tim', displayName: 'Tim de Vries' })

describe('attributionName', () => {
  it('is null when the row was set by its own member (the normal case)', () => {
    expect(attributionName(attendee({ changedBy: 'user-self' }), [tim])).toBeNull()
  })

  it('is null when there is no attribution (a member who never answered)', () => {
    expect(attributionName(attendee({ changedBy: undefined }), [tim])).toBeNull()
  })

  it('resolves a teammate id to their display name', () => {
    expect(attributionName(attendee({ changedBy: 'user-tim' }), [tim])).toBe('Tim de Vries')
  })

  it('falls back to a neutral label when the setter is no longer in the list', () => {
    expect(attributionName(attendee({ changedBy: 'user-gone' }), [tim])).toBe('a teammate')
  })
})
