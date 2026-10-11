import { describe, expect, it } from 'vitest'
import { TopUpUnavailableError, topUpUrlOf } from './top-up-link'

describe('topUpUrlOf', () => {
  it('returns a bunq.me url from a 200', () => {
    expect(topUpUrlOf({ status: 200, body: { url: 'https://bunq.me/setpointvt/20/x' } })).toBe('https://bunq.me/setpointvt/20/x')
  })

  it('reports a 404 as unavailable', () => {
    expect(() => topUpUrlOf({ status: 404 })).toThrow(TopUpUnavailableError)
  })

  it('throws on any other status instead of returning an undefined url', () => {
    for (const status of [400, 403, 500]) {
      expect(() => topUpUrlOf({ status, body: undefined }), String(status)).toThrow(Error)
      expect(() => topUpUrlOf({ status }), String(status)).not.toThrow(TopUpUnavailableError)
    }
  })

  it('refuses a url that is not a bunq.me page', () => {
    for (const url of ['https://evil.example/x', 'http://bunq.me/x', 'javascript:alert(1)', undefined]) {
      expect(() => topUpUrlOf({ status: 200, body: { url } }), String(url)).toThrow(Error)
    }
  })
})
