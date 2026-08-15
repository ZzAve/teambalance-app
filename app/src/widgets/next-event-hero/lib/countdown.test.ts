import { describe, expect, it } from 'vitest'
import { heroCountdown } from './countdown'

const at = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min, 0, 0)

const NOW = at(2026, 8, 10, 9, 0)
const countdown = (start: Date) => heroCountdown(start.toISOString(), NOW)

describe('heroCountdown', () => {
  it('counts whole days once an event is a day or more out', () => {
    expect(countdown(at(2026, 8, 12, 9, 0))).toEqual({ value: '2d', unit: 'away' })
    expect(countdown(at(2026, 8, 17, 9, 0))).toEqual({ value: '7d', unit: 'away' })
  })

  it('rounds down, so a countdown never overstates how long you have', () => {
    // 35 hours out is "1d", not "2d"; 23 hours out has not earned a day yet.
    expect(countdown(at(2026, 8, 11, 20, 0))).toEqual({ value: '1d', unit: 'away' })
    expect(countdown(at(2026, 8, 11, 8, 0))).toEqual({ value: '23h', unit: 'away' })
  })

  it('switches to hours inside a day', () => {
    expect(countdown(at(2026, 8, 10, 20, 0))).toEqual({ value: '11h', unit: 'away' })
    expect(countdown(at(2026, 8, 10, 10, 30))).toEqual({ value: '1h', unit: 'away' })
  })

  it('switches to minutes inside an hour', () => {
    expect(countdown(at(2026, 8, 10, 9, 45))).toEqual({ value: '45m', unit: 'away' })
    expect(countdown(at(2026, 8, 10, 9, 1))).toEqual({ value: '1m', unit: 'away' })
  })

  it('says "Now" once the event has started, rather than counting backwards', () => {
    expect(countdown(at(2026, 8, 10, 9, 0))).toEqual({ value: 'Now', unit: 'on' })
    expect(countdown(at(2026, 8, 10, 8, 0))).toEqual({ value: 'Now', unit: 'on' })
  })
})
