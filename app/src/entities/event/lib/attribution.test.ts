import { describe, expect, it } from 'vitest'
import type { AttendanceEntry } from '@shared/api/events'
import { attributionName, myAttributionName } from './attribution'

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

describe('myAttributionName', () => {
  const setByTim = attendee({ changedBy: 'user-tim' })
  const roster = [setByTim, tim]

  it('names the teammate who answered for the viewer', () => {
    expect(myAttributionName(roster, 'user-self', false)).toBe('Tim de Vries')
  })

  it('is null for a viewer whose own row is self-set', () => {
    expect(myAttributionName([attendee({ changedBy: 'user-self' }), tim], 'user-self', false)).toBeNull()
  })

  it('is null when the viewer has no row at all', () => {
    expect(myAttributionName([tim], 'user-self', false)).toBeNull()
  })

  // Nobody to attribute to, and nobody to attribute for.
  it('is null without a viewer', () => {
    expect(myAttributionName(roster, null, false)).toBeNull()
    expect(myAttributionName(roster, undefined, false)).toBeNull()
  })

  // The trap this exists for: mid-write, `myState` is already the viewer's own optimistic pick while
  // `attendances` still holds the row Tim set. Reading both would credit Tim with the answer the
  // viewer just gave — and would do it at the moment the viewer is looking at the card.
  it('says nothing while the viewer own write is still settling', () => {
    expect(myAttributionName(roster, 'user-self', true)).toBeNull()
  })
})
