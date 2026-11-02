import { describe, expect, it } from 'vitest'
import { shouldRetryWake, wakeRetryDelayMs } from './retry-policy'

describe('shouldRetryWake', () => {
  it('retries a network reject (no status) — the container is likely still waking', () => {
    expect(shouldRetryWake(0, new TypeError('Failed to fetch'))).toBe(true)
    expect(shouldRetryWake(0, new Error('network error'))).toBe(true)
  })

  it('retries gateway errors (502/503/504)', () => {
    expect(shouldRetryWake(0, { status: 502 })).toBe(true)
    expect(shouldRetryWake(0, { status: 503 })).toBe(true)
    expect(shouldRetryWake(0, { status: 504 })).toBe(true)
  })

  it('does NOT retry 4xx — real client errors must fail fast', () => {
    expect(shouldRetryWake(0, { status: 400 })).toBe(false)
    expect(shouldRetryWake(0, { status: 401 })).toBe(false)
    expect(shouldRetryWake(0, { status: 403 })).toBe(false)
    expect(shouldRetryWake(0, { status: 404 })).toBe(false)
  })

  it('does NOT retry a plain 500 (only gateway codes signal a waking backend)', () => {
    expect(shouldRetryWake(0, { status: 500 })).toBe(false)
  })

  it('retries a transient failure up to three times, then stops', () => {
    const err = { status: 503 }
    expect(shouldRetryWake(0, err)).toBe(true)
    expect(shouldRetryWake(2, err)).toBe(true)
    expect(shouldRetryWake(3, err)).toBe(false)
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
