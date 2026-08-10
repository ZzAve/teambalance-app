import { describe, expect, it } from 'vitest'
import { parseInviteToken } from './parse-invite-token'

describe('parseInviteToken', () => {
  it('passes a bare token through unchanged', () => {
    expect(parseInviteToken('abc123')).toBe('abc123')
  })

  it('extracts the token from a full invite URL', () => {
    expect(parseInviteToken('https://app.teambalance.nl/invite/abc123')).toBe('abc123')
  })

  it('strips a query string after the token', () => {
    expect(parseInviteToken('https://app.teambalance.nl/invite/abc123?utm=share')).toBe('abc123')
  })

  it('strips a hash fragment after the token', () => {
    expect(parseInviteToken('https://app.teambalance.nl/invite/abc123#section')).toBe('abc123')
  })

  it('strips a trailing slash', () => {
    expect(parseInviteToken('https://app.teambalance.nl/invite/abc123/')).toBe('abc123')
  })

  it('trims surrounding whitespace on a bare token', () => {
    expect(parseInviteToken('  abc123  ')).toBe('abc123')
  })

  it('trims surrounding whitespace on a full URL', () => {
    expect(parseInviteToken('  https://app.teambalance.nl/invite/abc123  ')).toBe('abc123')
  })

  it('returns an empty string for junk input', () => {
    expect(parseInviteToken('   ')).toBe('')
    expect(parseInviteToken('')).toBe('')
  })
})
