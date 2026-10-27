import { describe, expect, it } from 'vitest'
import { TopUpUnavailableError, topUpUrlOf } from './top-up-link'

describe('topUpUrlOf', () => {
  it('returns a bunq.me url from a 200', () => {
    expect(topUpUrlOf({ status: 200, body: { url: 'https://bunq.me/setpointvt/20/x' } })).toBe('https://bunq.me/setpointvt/20/x')
  })

  it('reports a 404 as unavailable', () => {
    expect(() => topUpUrlOf({ status: 404 })).toThrow(TopUpUnavailableError)
  })

  it('throws on a 403 (acting as the team) instead of returning an undefined url', () => {
    let error: unknown
    try {
      topUpUrlOf({ status: 403, body: undefined })
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(Error)
    expect(error).not.toBeInstanceOf(TopUpUnavailableError)
    expect((error as Error).message).toContain('403')
  })

  it('refuses a url that is not a bunq.me page', () => {
    for (const url of ['https://evil.example/x', 'http://bunq.me/x', 'javascript:alert(1)', undefined]) {
      expect(() => topUpUrlOf({ status: 200, body: { url } }), String(url)).toThrow(Error)
    }
  })
})
