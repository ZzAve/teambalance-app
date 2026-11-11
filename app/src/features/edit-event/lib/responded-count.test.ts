import { describe, expect, it } from 'vitest'
import { respondedCount } from './responded-count'

describe('respondedCount', () => {
  it('counts going, maybe and can’t, and not the members who did not respond', () => {
    const attendanceSummary = { attending: 3, maybe: 2, absent: 1, notResponded: 7, roleBreakdown: [] }
    expect(respondedCount({ attendanceSummary })).toBe(6)
  })

  it('is zero when nobody responded', () => {
    const attendanceSummary = { attending: 0, maybe: 0, absent: 0, notResponded: 7, roleBreakdown: [] }
    expect(respondedCount({ attendanceSummary })).toBe(0)
  })
})
