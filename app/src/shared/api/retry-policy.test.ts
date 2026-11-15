import { describe, expect, it } from 'vitest'
import { ApiError, apiErrorOf } from './api-error'
import { shouldRetryWake, wakeRetryDelayMs } from './retry-policy'

describe('shouldRetryWake', () => {
  it('retries a network reject (no status) — the container is likely still waking', () => {
    expect(shouldRetryWake(0, new TypeError('Failed to fetch'))).toBe(true)
    expect(shouldRetryWake(0, new Error('network error'))).toBe(true)
  })

  it('retries gateway errors (502/503/504)', () => {
    expect(shouldRetryWake(0, new ApiError(502))).toBe(true)
    expect(shouldRetryWake(0, new ApiError(503))).toBe(true)
    expect(shouldRetryWake(0, new ApiError(504))).toBe(true)
  })

  it('does NOT retry 4xx — real client errors must fail fast', () => {
    expect(shouldRetryWake(0, new ApiError(400))).toBe(false)
    expect(shouldRetryWake(0, new ApiError(401))).toBe(false)
    expect(shouldRetryWake(0, new ApiError(403))).toBe(false)
    expect(shouldRetryWake(0, new ApiError(404))).toBe(false)
  })

  it('judges the error built from a response by that response status', () => {
    for (const status of [403, 404, 500]) expect(shouldRetryWake(0, apiErrorOf({ status }))).toBe(false)
    expect(shouldRetryWake(0, apiErrorOf({ status: 503 }))).toBe(true)
  })

  it('does NOT retry a plain 500 (only gateway codes signal a waking backend)', () => {
    expect(shouldRetryWake(0, new ApiError(500))).toBe(false)
  })

  it('retries a transient failure up to three times by default, then stops', () => {
    const err = new ApiError(503)
    expect(shouldRetryWake(0, err)).toBe(true)
    expect(shouldRetryWake(2, err)).toBe(true)
    expect(shouldRetryWake(3, err)).toBe(false)
  })

  it('retries up to a caller-given limit', () => {
    const err = new ApiError(504)
    expect(shouldRetryWake(5, err, 6)).toBe(true)
    expect(shouldRetryWake(6, err, 6)).toBe(false)
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
