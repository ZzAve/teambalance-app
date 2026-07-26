import { describe, it, expect } from 'vitest'
import { referenceLabel } from './reference-label'

describe('referenceLabel', () => {
  it('uses the title when present', () => {
    expect(referenceLabel({ title: 'Nevobo', url: 'https://api.nevobo.nl/x' })).toBe('Nevobo')
  })

  it('falls back to the host when the title is absent', () => {
    expect(referenceLabel({ title: undefined, url: 'https://dwf.volleybal.nl/match/42' })).toBe(
      'dwf.volleybal.nl',
    )
  })

  it('falls back to the host when the title is blank', () => {
    expect(referenceLabel({ title: '   ', url: 'https://example.com/a' })).toBe('example.com')
  })

  it('returns the raw url when it cannot be parsed', () => {
    expect(referenceLabel({ title: undefined, url: 'not-a-url' })).toBe('not-a-url')
  })
})
