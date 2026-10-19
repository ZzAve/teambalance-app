import { describe, expect, it } from 'vitest'
import { csrfHeaders } from './csrf'

describe('csrfHeaders', () => {
  const cookie = 'theme=dark; XSRF-TOKEN=abc-123; other=x'

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('echoes the XSRF-TOKEN cookie as X-XSRF-TOKEN on %s', (method) => {
    expect(csrfHeaders(method, cookie)).toEqual({ 'X-XSRF-TOKEN': 'abc-123' })
  })

  it.each(['GET', 'HEAD', 'get'])('sends nothing on %s, which the API does not check', (method) => {
    expect(csrfHeaders(method, cookie)).toEqual({})
  })

  it('sends nothing when the cookie has not been issued yet', () => {
    expect(csrfHeaders('POST', 'theme=dark')).toEqual({})
  })

  it('decodes a percent-encoded cookie value', () => {
    expect(csrfHeaders('POST', 'XSRF-TOKEN=a%2Bb')).toEqual({ 'X-XSRF-TOKEN': 'a+b' })
  })
})
