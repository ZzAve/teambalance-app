import { describe, expect, it } from 'vitest'
import { cleanReferences, normalizeUrl, toReferenceRows } from './references'

describe('normalizeUrl', () => {
  it('prepends https:// to a schemeless URL', () => {
    expect(normalizeUrl('volleybal.nl/x')).toBe('https://volleybal.nl/x')
  })
  it('leaves an explicit scheme untouched', () => {
    expect(normalizeUrl('http://a.nl')).toBe('http://a.nl')
    expect(normalizeUrl('https://a.nl')).toBe('https://a.nl')
  })
  it('normalizes blank input to an empty string', () => {
    expect(normalizeUrl('   ')).toBe('')
  })
})

describe('toReferenceRows', () => {
  it('maps stored references to rows, defaulting a missing title to empty', () => {
    expect(toReferenceRows([{ title: 'Nevobo', url: 'https://a.nl' }, { title: undefined, url: 'https://b.nl' }])).toEqual([
      { title: 'Nevobo', url: 'https://a.nl' },
      { title: '', url: 'https://b.nl' },
    ])
  })
  it('treats undefined as no rows', () => {
    expect(toReferenceRows(undefined)).toEqual([])
  })
})

describe('cleanReferences', () => {
  it('drops blank-URL rows, normalizes URLs, and blanks empty titles to undefined', () => {
    expect(
      cleanReferences([
        { title: 'Nevobo', url: 'volleybal.nl/page' },
        { title: '  ', url: 'https://form.nl' },
        { title: 'ignored', url: '   ' },
      ]),
    ).toEqual([
      { title: 'Nevobo', url: 'https://volleybal.nl/page' },
      { title: undefined, url: 'https://form.nl' },
    ])
  })
})
