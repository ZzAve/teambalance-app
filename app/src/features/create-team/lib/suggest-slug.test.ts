import { describe, expect, it } from 'vitest'
import { suggestSlug } from './suggest-slug'
import { MAX_SLUG_LENGTH, validateSlug } from './validate-slug'

describe('suggestSlug', () => {
  it('lowercases and hyphenates a simple name', () => {
    expect(suggestSlug('Tovo Heren 4')).toBe('tovo-heren-4')
  })

  it('collapses runs of non-alphanumerics into a single hyphen', () => {
    expect(suggestSlug('  Ajax  //  Amsterdam!! ')).toBe('ajax-amsterdam')
  })

  it('trims leading and trailing separators', () => {
    expect(suggestSlug('--Rockets--')).toBe('rockets')
  })

  it('drops accented characters through the separator rather than into the slug', () => {
    expect(suggestSlug('Café Zürich')).toBe('caf-z-rich')
  })

  it('returns an empty string for a name with no usable characters', () => {
    expect(suggestSlug('!!! @#$')).toBe('')
  })

  it('caps the suggestion at the max slug length with no trailing hyphen', () => {
    const suggestion = suggestSlug('a '.repeat(80))
    expect(suggestion.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH)
    expect(suggestion.endsWith('-')).toBe(false)
  })

  it('always produces a slug that passes validateSlug (or is empty)', () => {
    for (const name of ['Tovo Heren 4', 'Ajax // Amsterdam', 'Café Zürich', '2024 Squad']) {
      expect(validateSlug(suggestSlug(name))).toBeNull()
    }
  })
})
