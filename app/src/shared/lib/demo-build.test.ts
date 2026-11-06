import { describe, expect, it } from 'vitest'
import { isDemoFlag } from './demo-build'

describe('isDemoFlag', () => {
  it('is on only for the exact string "true"', () => {
    expect(isDemoFlag('true')).toBe(true)
    expect(isDemoFlag('false')).toBe(false)
    expect(isDemoFlag('')).toBe(false)
    expect(isDemoFlag(undefined)).toBe(false)
  })
})
