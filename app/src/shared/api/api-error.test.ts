import { describe, expect, it } from 'vitest'
import { ApiError, apiErrorOf } from './api-error'

describe('apiErrorOf', () => {
  it('carries the response status and the { code } of its body', () => {
    const error = apiErrorOf({ status: 409, body: { code: 'NAME_TAKEN' } })
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(409)
    expect(error.code).toBe('NAME_TAKEN')
  })

  it('falls back to FAILED when the body has no code', () => {
    expect(apiErrorOf({ status: 500 }).code).toBe('FAILED')
    expect(apiErrorOf({ status: 500, body: 'oops' }).code).toBe('FAILED')
    expect(apiErrorOf({ status: 500, body: { code: 7 } }).code).toBe('FAILED')
  })

  it('uses the given message, or names the status', () => {
    expect(apiErrorOf({ status: 403 }, 'You are not allowed.').message).toBe('You are not allowed.')
    expect(apiErrorOf({ status: 403 }).message).toBe('Request failed with status 403')
  })
})
