import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from './i18n'
import { applyUserLanguage, resolveLanguage } from './language'

// ADR-0043 §3: the user's stored choice, then the device's, then the browser, then English.
describe('resolveLanguage', () => {
  it("takes the signed-in user's choice over everything else", () => {
    expect(resolveLanguage({ user: 'NL', stored: 'en', browser: ['en-GB'] })).toBe('nl')
    expect(resolveLanguage({ user: 'EN', stored: 'nl', browser: ['nl-NL'] })).toBe('en')
  })

  it('takes the device value when the user has not chosen', () => {
    expect(resolveLanguage({ user: null, stored: 'nl', browser: ['en-GB'] })).toBe('nl')
  })

  it('takes the first browser language that is Dutch or English, in any region', () => {
    expect(resolveLanguage({ user: null, stored: null, browser: ['de-DE', 'nl-BE', 'en-US'] })).toBe('nl')
    expect(resolveLanguage({ user: null, stored: null, browser: ['fr', 'en-US', 'nl'] })).toBe('en')
  })

  it('falls back to English when nothing else names nl or en', () => {
    expect(resolveLanguage({ user: null, stored: null, browser: ['de-DE'] })).toBe('en')
    expect(resolveLanguage({ user: undefined, stored: null, browser: [] })).toBe('en')
  })
})

// What /api/auth/me does with the user's choice: show it, and keep it on this device for the next
// logged-out page (login, invite).
describe('applyUserLanguage', () => {
  afterEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it("switches to the user's language and remembers it on this device", () => {
    applyUserLanguage('NL')

    expect(i18n.language).toBe('nl')
    expect(localStorage.getItem('tb.pref.language')).toBe('"nl"')
  })

  it('leaves the language and the device alone for a user who never chose', () => {
    localStorage.setItem('tb.pref.language', '"nl"')

    applyUserLanguage(null)

    expect(i18n.language).toBe('en')
    expect(localStorage.getItem('tb.pref.language')).toBe('"nl"')
  })
})
