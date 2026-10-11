import { describe, expect, it } from 'vitest'
import { isMoneyPoolOff } from './money-pool-visibility'

describe('isMoneyPoolOff', () => {
  it('is true only when the active team switched the money pool off', () => {
    expect(isMoneyPoolOff({ moneyPoolEnabled: false })).toBe(true)
  })

  it('is false when the money pool is on', () => {
    expect(isMoneyPoolOff({ moneyPoolEnabled: true })).toBe(false)
  })

  it('is false when the setting is unknown or there is no session', () => {
    expect(isMoneyPoolOff({ moneyPoolEnabled: undefined })).toBe(false)
    expect(isMoneyPoolOff(null)).toBe(false)
    expect(isMoneyPoolOff(undefined)).toBe(false)
  })
})
