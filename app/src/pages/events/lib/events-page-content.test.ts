import { describe, expect, it } from 'vitest'
import { makeEvent, makeRoster } from '@shared/testing/event-fixtures'
import type { Event } from '@shared/api/events'
import { ALL_ATTENDANCE_STATES } from '@entities/event/lib/attendance-states'
import { ALL_TURNOUT_BUCKETS } from '@features/filter-event-types/model/turnout'
import { eventsPageContent, type EventsPageInput } from './events-page-content'

const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const at = (day: number, hour = 20) => new Date(2026, 7, day, hour, 0).toISOString()
const TRAINING = { id: 'et-training', name: 'Training', color: '#249E6C' }
const MATCH = { id: 'et-match', name: 'Match', color: '#225C9C' }
const ALL_TYPE_IDS = [TRAINING.id, MATCH.id]

const event = (id: string, day: number, overrides: Partial<Event> = {}) =>
  makeEvent({ id, startTime: at(day), eventType: TRAINING, myState: 'NOT_RESPONDED', ...overrides })

const page = (events: Event[], overrides: Partial<EventsPageInput> = {}) =>
  eventsPageContent({
    events,
    allTypeIds: ALL_TYPE_IDS,
    activeTypeIds: new Set(ALL_TYPE_IDS),
    activeStates: new Set(ALL_ATTENDANCE_STATES),
    activeTurnouts: new Set(ALL_TURNOUT_BUCKETS),
    showPast: false,
    now: NOW,
    isLoading: false,
    error: undefined,
    ...overrides,
  })

const ids = (events: Event[]) => events.map((e) => e.id)

describe('eventsPageContent', () => {
  it('promotes the first event to the hero and lists the rest, in chronological order', () => {
    const content = page([event('later', 14), event('first', 11), event('last', 16)])

    expect(content.heroEvent?.id).toBe('first')
    expect(ids(content.listEvents)).toEqual(['later', 'last'])
  })

  describe('everything follows the filter (ADR-0029 §6)', () => {
    const events = [
      event('going-soon', 11, { myState: 'ATTENDING' }),
      event('open-soon', 12),
      event('open-match', 13, { eventType: MATCH }),
    ]

    it('picks the hero, the list and the count from the filtered events only', () => {
      const content = page(events, { activeStates: new Set(['NOT_RESPONDED']) })

      expect(content.heroEvent?.id).toBe('open-soon')
      expect(ids(content.listEvents)).toEqual(['open-match'])
      expect(content.resultCount).toBe(2)
    })

    it('follows the type dimension too', () => {
      const content = page(events, { activeTypeIds: new Set([MATCH.id]) })

      expect(content.heroEvent?.id).toBe('open-match')
      expect(content.listEvents).toEqual([])
      expect(content.resultCount).toBe(1)
    })

    it('leaves no Bulk Attend events when the filter is an answered status', () => {
      const content = page(events, { activeStates: new Set(['ATTENDING', 'MAYBE', 'ABSENT']) })

      expect(content.resultCount).toBe(1)
      expect(content.bulkAttendEvents).toEqual([])
    })

    it('offers Bulk Attend the unanswered future events below the hero', () => {
      expect(ids(page(events).bulkAttendEvents)).toEqual(['open-soon', 'open-match'])
    })
  })

  describe('the hero is not in the list or in Bulk Attend (#386)', () => {
    it('drops an unanswered hero from both', () => {
      const content = page([event('hero', 11), event('other', 12)])

      expect(content.heroEvent?.id).toBe('hero')
      expect(ids(content.listEvents)).toEqual(['other'])
      expect(ids(content.bulkAttendEvents)).toEqual(['other'])
    })

    it('keeps a started event that is still in the list as the hero, outside Bulk Attend', () => {
      const started = event('started', 10, { startTime: at(10, 8) })
      const content = page([started, event('next', 12)])

      expect(content.heroEvent?.id).toBe('started')
      expect(ids(content.listEvents)).toEqual(['next'])
      expect(ids(content.bulkAttendEvents)).toEqual(['next'])
    })

    it('leaves a started event that is not the hero out of Bulk Attend', () => {
      const content = page([event('hero', 10, { startTime: at(10, 8), myState: 'ATTENDING' }), event('next', 12)])

      expect(content.heroEvent?.id).toBe('hero')
      expect(ids(content.bulkAttendEvents)).toEqual(['next'])
    })
  })

  it('has no hero while past events are shown, and lists everything oldest first', () => {
    const content = page([event('b', 12), event('a', 3)], { showPast: true })

    expect(content.heroEvent).toBeNull()
    expect(ids(content.listEvents)).toEqual(['a', 'b'])
  })

  it('has no hero when the first event is beyond the hero window', () => {
    const content = page([event('far', 28)])

    expect(content.heroEvent).toBeNull()
    expect(ids(content.listEvents)).toEqual(['far'])
  })

  describe('Turnout group', () => {
    it('is read off the unfiltered events, so narrowing another dimension cannot hide it', () => {
      const targeted = event('targeted', 11, { myState: 'ATTENDING', roster: makeRoster({ state: 'SPOTS_OPEN' }) })
      const content = page([targeted, event('plain', 12)], { activeStates: new Set(['NOT_RESPONDED']) })

      expect(content.showTurnout).toBe(true)
    })

    it('is hidden when no event has a target', () => {
      expect(page([event('plain', 12)]).showTurnout).toBe(false)
    })
  })

  describe('empty message', () => {
    it('says nothing else is there when a hero is on screen', () => {
      const withHero = page([event('only', 11)])
      const withoutHero = page([])

      expect(withHero.emptyMessage).not.toBe(withoutHero.emptyMessage)
    })

    it('reads the filter that emptied the list', () => {
      const unfiltered = page([]).emptyMessage
      const narrowed = page([event('a', 11)], { activeTypeIds: new Set([MATCH.id]) }).emptyMessage

      expect(narrowed).not.toBe(unfiltered)
    })
  })

  describe('loading and error', () => {
    it('are passed on when there is no hero', () => {
      const failure = new Error('boom')
      const content = page([], { isLoading: true, error: failure })

      expect(content.isLoading).toBe(true)
      expect(content.error).toBe(failure)
    })

    it('are withheld when a hero is on screen: an empty list beneath it means nothing else', () => {
      const content = page([event('only', 11)], { isLoading: true, error: new Error('boom') })

      expect(content.isLoading).toBe(false)
      expect(content.error).toBeUndefined()
    })
  })

  it('withholds filtering until the event types are known', () => {
    const content = page([event('a', 11), event('b', 12, { eventType: MATCH })], {
      allTypeIds: undefined,
      activeTypeIds: new Set(),
    })

    expect(content.resultCount).toBe(2)
    expect(content.bulkAttendEvents).toEqual([])
  })
})
