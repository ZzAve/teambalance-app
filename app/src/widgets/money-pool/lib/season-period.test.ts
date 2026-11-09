import { describe, expect, it } from 'vitest'
import { paymentsFollowSeason } from './season-period'

describe('paymentsFollowSeason', () => {
  it('is true when the season started in the past or today', () => {
    expect(paymentsFollowSeason('2026-09-01', '2026-11-07')).toBe(true)
    expect(paymentsFollowSeason('2026-11-07', '2026-11-07')).toBe(true)
  })

  it('is false without a season start, or with one that has not begun', () => {
    expect(paymentsFollowSeason(undefined, '2026-11-07')).toBe(false)
    expect(paymentsFollowSeason(null, '2026-11-07')).toBe(false)
    expect(paymentsFollowSeason('2026-12-01', '2026-11-07')).toBe(false)
  })
})
