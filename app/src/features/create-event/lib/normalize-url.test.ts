import { describe, it, expect } from 'vitest'
import { normalizeUrl } from './normalize-url'

describe('normalizeUrl', () => {
  it('prepends https:// to a scheme-less url', () => {
    expect(normalizeUrl('volleybal.nl/match/42')).toBe('https://volleybal.nl/match/42')
  })

  it('leaves an https url untouched', () => {
    expect(normalizeUrl('https://api.nevobo.nl/x')).toBe('https://api.nevobo.nl/x')
  })

  it('leaves an http url untouched', () => {
    expect(normalizeUrl('http://example.com/x')).toBe('http://example.com/x')
  })

  it('does not prepend to a url that already has a (non-http) scheme', () => {
    // We never mangle an existing scheme into https://ftp://… — the backend rejects ftp later.
    expect(normalizeUrl('ftp://host/file')).toBe('ftp://host/file')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeUrl('  example.com/x  ')).toBe('https://example.com/x')
  })

  it('normalizes blank input to an empty string so the row can be dropped', () => {
    expect(normalizeUrl('   ')).toBe('')
    expect(normalizeUrl('')).toBe('')
  })
})
