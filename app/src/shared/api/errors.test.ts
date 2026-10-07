import { describe, expect, it } from 'vitest'
import { throwOnStatus } from './errors'

class TestError extends Error {}

describe('throwOnStatus', () => {
  const table = {
    403: () => new TestError('forbidden'),
    409: (body: unknown) => new TestError(`conflict ${(body as { code?: string } | undefined)?.code}`),
  }

  it('throws the error built for the response status', () => {
    expect(() => throwOnStatus({ status: 403, body: undefined }, table)).toThrow(new TestError('forbidden'))
  })

  it('hands the response body to the error builder', () => {
    expect(() => throwOnStatus({ status: 409, body: { code: 'LAST_ADMIN' } }, table)).toThrow('conflict LAST_ADMIN')
  })

  it('returns without throwing for a status not in the table', () => {
    expect(() => throwOnStatus({ status: 201, body: {} }, table)).not.toThrow()
    expect(() => throwOnStatus({ status: 500, body: undefined }, table)).not.toThrow()
  })
})
