import { describe, expect, it } from 'vitest'
import type { Event } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { selectHeroEvent } from './next-event'

const at = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min, 0, 0)

const event = (id: string, start: Date): Event =>
  makeEvent({ id, startTime: start.toISOString() })

// 2026-08-10, a Monday, is "now" throughout.
const NOW = at(2026, 8, 10, 9, 0)

describe('selectHeroEvent', () => {
  it('returns nothing for an empty list', () => {
    expect(selectHeroEvent([], NOW)).toBeNull()
  })

  it('returns nothing when every event is in the past', () => {
    const events = [event('a', at(2026, 8, 3)), event('b', at(2026, 8, 9))]
    expect(selectHeroEvent(events, NOW)).toBeNull()
  })

  it('picks the most imminent upcoming event', () => {
    const events = [event('later', at(2026, 8, 13)), event('sooner', at(2026, 8, 11))]
    expect(selectHeroEvent(events, NOW)?.id).toBe('sooner')
  })

  it('picks the earliest future event regardless of list order or past entries', () => {
    // "Show past events" hands the list back newest-first with history mixed in.
    const events = [
      event('past-recent', at(2026, 8, 9)),
      event('future-far', at(2026, 8, 14)),
      event('past-old', at(2026, 7, 1)),
      event('future-near', at(2026, 8, 12)),
    ]
    expect(selectHeroEvent(events, NOW)?.id).toBe('future-near')
  })

  it('takes an event still to start today', () => {
    expect(selectHeroEvent([event('tonight', at(2026, 8, 10, 20, 0))], NOW)?.id).toBe('tonight')
  })

  it('takes an event on the far edge of the window', () => {
    // 7 calendar days out — the last day RELATIVE_WINDOW_DAYS admits.
    expect(selectHeroEvent([event('edge', at(2026, 8, 17))], NOW)?.id).toBe('edge')
  })

  it('returns nothing when the next event is beyond the window — no hero, no placeholder', () => {
    expect(selectHeroEvent([event('far', at(2026, 8, 18))], NOW)).toBeNull()
    expect(selectHeroEvent([event('very-far', at(2026, 12, 1))], NOW)).toBeNull()
  })

  it('does not fall through to a later event when the nearest one is out of the window', () => {
    // The nearest event decides. A hero is never "the next event that happens to qualify".
    const events = [event('far', at(2026, 8, 18)), event('further', at(2026, 8, 25))]
    expect(selectHeroEvent(events, NOW)).toBeNull()
  })
})
