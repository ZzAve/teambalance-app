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

  it('takes the first event of the list', () => {
    const events = [event('first', at(2026, 8, 11)), event('second', at(2026, 8, 13))]
    expect(selectHeroEvent(events, NOW)?.id).toBe('first')
  })

  it('takes a first event that has started: the upcoming list decides how long it stays', () => {
    const events = [event('running', at(2026, 8, 10, 8, 0)), event('next', at(2026, 8, 10, 20, 0))]
    expect(selectHeroEvent(events, NOW)?.id).toBe('running')
  })

  it('takes an event on the far edge of the window', () => {
    // 7 calendar days out — the last day RELATIVE_WINDOW_DAYS admits.
    expect(selectHeroEvent([event('edge', at(2026, 8, 17))], NOW)?.id).toBe('edge')
  })

  it('returns nothing when the first event is beyond the window — no hero, no placeholder', () => {
    expect(selectHeroEvent([event('far', at(2026, 8, 18))], NOW)).toBeNull()
    expect(selectHeroEvent([event('very-far', at(2026, 12, 1))], NOW)).toBeNull()
  })
})
