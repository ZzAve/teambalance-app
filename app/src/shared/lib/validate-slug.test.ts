import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { MAX_SLUG_LENGTH, validateSlug } from './validate-slug'

describe('validateSlug', () => {
  it('accepts a lowercase, hyphen-separated slug', () => {
    expect(validateSlug('tovo-heren-4')).toBeNull()
  })

  it('accepts a single-segment slug', () => {
    expect(validateSlug('setpoint')).toBeNull()
  })

  it('rejects an empty slug', () => {
    expect(validateSlug('')).toMatch(/choose/i)
  })

  it('rejects uppercase, spaces, underscores, and other non-slug characters', () => {
    expect(validateSlug('Tovo')).toMatch(/lowercase/i)
    expect(validateSlug('tovo heren')).toMatch(/lowercase/i)
    expect(validateSlug('tovo_heren')).toMatch(/lowercase/i)
    expect(validateSlug('tovo!')).toMatch(/lowercase/i)
  })

  it('rejects leading, trailing, and doubled hyphens', () => {
    expect(validateSlug('-tovo')).toMatch(/lowercase/i)
    expect(validateSlug('tovo-')).toMatch(/lowercase/i)
    expect(validateSlug('tovo--heren')).toMatch(/lowercase/i)
  })

  it(`accepts a ${MAX_SLUG_LENGTH}-character slug but rejects one character more`, () => {
    expect(validateSlug('a'.repeat(MAX_SLUG_LENGTH))).toBeNull()
    expect(validateSlug('a'.repeat(MAX_SLUG_LENGTH + 1))).toMatch(/or fewer/i)
  })
})

describe('validateSlug in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says what is wrong in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(validateSlug('')).toBe('Kies een teamadres.')
    expect(validateSlug('a'.repeat(MAX_SLUG_LENGTH + 1))).toBe(`Gebruik ${MAX_SLUG_LENGTH} tekens of minder.`)
    expect(validateSlug('Tovo')).toBe('Gebruik kleine letters, cijfers en koppeltekens.')
  })
})
