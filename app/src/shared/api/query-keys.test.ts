import { partialMatchKey } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { queryKeys } from './query-keys'

describe('queryKeys', () => {
  it('keeps every events query under the events prefix, so invalidating events refreshes them all', () => {
    expect(partialMatchKey(queryKeys.events.list(true), queryKeys.events.all)).toBe(true)
    expect(partialMatchKey(queryKeys.events.list(false), queryKeys.events.all)).toBe(true)
    expect(partialMatchKey(queryKeys.events.detail('e1'), queryKeys.events.all)).toBe(true)
  })

  it('lets invalidating one event leave other events and the lists alone', () => {
    expect(partialMatchKey(queryKeys.events.detail('e2'), queryKeys.events.detail('e1'))).toBe(false)
    expect(partialMatchKey(queryKeys.events.list(true), queryKeys.events.detail('e1'))).toBe(false)
  })

  it('keeps the current member under the members prefix', () => {
    expect(partialMatchKey(queryKeys.members.me, queryKeys.members.all)).toBe(true)
  })

  it('keeps usage queries under their entity prefix', () => {
    expect(partialMatchKey(queryKeys.positions.usage('p1'), queryKeys.positions.all)).toBe(true)
    expect(partialMatchKey(queryKeys.substitutes.usage('s1'), queryKeys.substitutes.all)).toBe(true)
  })

  it('keeps both event-type lists under the event-types prefix', () => {
    expect(partialMatchKey(queryKeys.eventTypes.list(true), queryKeys.eventTypes.all)).toBe(true)
    expect(partialMatchKey(queryKeys.eventTypes.list(false), queryKeys.eventTypes.all)).toBe(true)
  })

  it('keeps the literal key values existing callers and caches rely on', () => {
    expect(queryKeys.events.list(false)).toEqual(['events', { includePast: false }])
    expect(queryKeys.events.detail('e1')).toEqual(['events', 'e1'])
    expect(queryKeys.eventTypes.list(true)).toEqual(['event-types', { includeArchived: true }])
    expect(queryKeys.members.me).toEqual(['members', 'me'])
    expect(queryKeys.positions.usage('p1')).toEqual(['positions', 'p1', 'usage'])
    expect(queryKeys.substitutes.usage('s1')).toEqual(['substitutes', 's1', 'usage'])
    expect(queryKeys.platformTeams).toEqual(['platform', 'teams'])
    expect(queryKeys.calendarLinks).toEqual(['calendar-links'])
    expect(queryKeys.authMe).toEqual(['auth', 'me'])
  })
})
