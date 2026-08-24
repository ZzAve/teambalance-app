import { describe, expect, it } from 'vitest'
import { INTEREST_ANCHOR_MS, interestCount } from './interest-count'

const at = (msAfterAnchor: number) => new Date(INTEREST_ANCHOR_MS + msAfterAnchor)
const HOUR = 3_600_000
const DAY = 24 * HOUR

describe('interestCount', () => {
  it('sits on the base at (and before) the deploy anchor', () => {
    const base = interestCount(at(0))
    expect(base).toBeGreaterThan(0)
    // A clock skewed to before deploy must not produce a negative or shrinking count.
    expect(interestCount(at(-HOUR))).toBe(base)
    expect(interestCount(at(-DAY))).toBe(base)
  })

  it('is deterministic — same instant, same number', () => {
    const when = at(3 * DAY + 17 * HOUR + 42 * 60_000)
    expect(interestCount(when)).toBe(interestCount(when))
    // And independent of how the Date object was constructed.
    expect(interestCount(new Date(when.getTime()))).toBe(interestCount(when))
  })

  it('never decreases as time moves forward', () => {
    // Sample every 7 minutes across a fortnight — a counter that ever ticked down would read as broken.
    let prev = -Infinity
    for (let t = 0; t <= 14 * DAY; t += 7 * 60_000) {
      const n = interestCount(at(t))
      expect(n).toBeGreaterThanOrEqual(prev)
      prev = n
    }
  })

  it('climbs meaningfully over days', () => {
    expect(interestCount(at(DAY))).toBeGreaterThan(interestCount(at(0)))
    expect(interestCount(at(7 * DAY))).toBeGreaterThan(interestCount(at(DAY)))
  })

  it('visibly ticks up within a single hour (the gradual reveal)', () => {
    // Across one hour the number must move at least once, so an open page is not frozen for 60 min.
    expect(interestCount(at(50 * DAY + 59 * 60_000))).toBeGreaterThan(interestCount(at(50 * DAY)))
  })

  it('does not look like a straight linear ramp (hour to hour varies)', () => {
    // Consecutive hourly deltas should not all be identical — that is the pseudo-random wobble.
    const deltas: number[] = []
    for (let h = 100; h < 120; h++) {
      deltas.push(interestCount(at((h + 1) * HOUR)) - interestCount(at(h * HOUR)))
    }
    expect(new Set(deltas).size).toBeGreaterThan(1)
  })

  it('follows the injected anchor', () => {
    const customAnchor = INTEREST_ANCHOR_MS + 100 * DAY
    // At its own anchor the custom-anchored count is the base again, below the default's here-and-now.
    expect(interestCount(new Date(customAnchor), customAnchor)).toBe(interestCount(at(0)))
  })
})
