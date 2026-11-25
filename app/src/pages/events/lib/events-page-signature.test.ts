import { describe, expect, it } from 'vitest'
import { makeEvent } from '@shared/testing/event-fixtures'
import { eventsPageSignature } from './events-page-signature'

const events = (...ids: string[]) => ids.map((id) => makeEvent({ id }))

describe('eventsPageSignature', () => {
  it('names the hero and the listed events in order', () => {
    expect(eventsPageSignature({ heroEventId: 'h', list: { events: events('a', 'b') } })).toBe('h|a,b')
  })

  it('is the same when only the contents of the events change', () => {
    const before = eventsPageSignature({ heroEventId: 'h', list: { events: [makeEvent({ id: 'a', myState: 'NOT_RESPONDED' })] } })
    const after = eventsPageSignature({ heroEventId: 'h', list: { events: [makeEvent({ id: 'a', myState: 'ATTENDING' })] } })

    expect(after).toBe(before)
  })

  it('differs when a card leaves, enters or moves', () => {
    const base = eventsPageSignature({ heroEventId: 'h', list: { events: events('a', 'b') } })

    expect(eventsPageSignature({ heroEventId: 'h', list: { events: events('b') } })).not.toBe(base)
    expect(eventsPageSignature({ heroEventId: 'h', list: { events: events('a', 'b', 'c') } })).not.toBe(base)
    expect(eventsPageSignature({ heroEventId: 'h', list: { events: events('b', 'a') } })).not.toBe(base)
  })

  it('differs when the hero changes or goes', () => {
    const base = eventsPageSignature({ heroEventId: 'h', list: { events: events('a') } })

    expect(eventsPageSignature({ heroEventId: 'a', list: { events: events('b') } })).not.toBe(base)
    expect(eventsPageSignature({ list: { events: events('a') } })).not.toBe(base)
  })

  it('has none while the list is loading or failed with nothing to show', () => {
    expect(eventsPageSignature({ list: { events: [], isLoading: true } })).toBeNull()
    expect(eventsPageSignature({ list: { events: [], error: new Error('boom') } })).toBeNull()
  })

  it('keeps showing events while a refetch loads or has failed', () => {
    expect(eventsPageSignature({ list: { events: events('a'), isLoading: true, error: new Error('boom') } })).toBe('|a')
  })

  it('names an empty list', () => {
    expect(eventsPageSignature({ list: { events: [] } })).toBe('|')
  })
})
