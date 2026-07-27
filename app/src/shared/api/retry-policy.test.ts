import { describe, expect, it } from 'vitest'
import {
  MAX_WAKE_RETRIES,
  isTransientWakeError,
  shouldRetryWake,
  wakeRetryDelayMs,
} from './retry-policy'

describe('isTransientWakeError', () => {
  it('treats a network reject (no status) as transient — the container is likely still waking', () => {
    expect(isTransientWakeError(new TypeError('Failed to fetch'))).toBe(true)
    expect(isTransientWakeError(new Error('network error'))).toBe(true)
  })

  it('treats gateway errors (502/503/504) as transient', () => {
    expect(isTransientWakeError({ status: 502 })).toBe(true)
    expect(isTransientWakeError({ status: 503 })).toBe(true)
    expect(isTransientWakeError({ status: 504 })).toBe(true)
  })

  it('does NOT treat 4xx as transient — real client errors must fail fast', () => {
    expect(isTransientWakeError({ status: 400 })).toBe(false)
    expect(isTransientWakeError({ status: 401 })).toBe(false)
    expect(isTransientWakeError({ status: 403 })).toBe(false)
    expect(isTransientWakeError({ status: 404 })).toBe(false)
  })

  it('does NOT treat a plain 500 as transient (only gateway codes signal a waking backend)', () => {
    expect(isTransientWakeError({ status: 500 })).toBe(false)
  })
})

describe('shouldRetryWake', () => {
  it('retries a transient failure until the cap, then stops', () => {
    const err = { status: 503 }
    expect(shouldRetryWake(0, err)).toBe(true)
    expect(shouldRetryWake(MAX_WAKE_RETRIES - 1, err)).toBe(true)
    expect(shouldRetryWake(MAX_WAKE_RETRIES, err)).toBe(false)
  })

  it('never retries a non-transient failure, even on the first attempt', () => {
    expect(shouldRetryWake(0, { status: 401 })).toBe(false)
  })
})

describe('wakeRetryDelayMs', () => {
  it('backs off exponentially: 1s, 2s, 4s', () => {
    expect(wakeRetryDelayMs(0)).toBe(1000)
    expect(wakeRetryDelayMs(1)).toBe(2000)
    expect(wakeRetryDelayMs(2)).toBe(4000)
  })

  it('caps the delay so a down backend does not stall indefinitely', () => {
    expect(wakeRetryDelayMs(10)).toBe(8000)
  })
})
