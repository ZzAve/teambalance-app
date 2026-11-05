import {afterEach, describe, expect, it} from 'vitest'
import {i18n} from '@shared/i18n/i18n'
import {STATE_CHIPS, TURNOUT_CHIPS} from './EventFiltersView'

// Gold at ~1.9:1 on the light card fails as ink (#336) — a bare `text-gold` on an inactive chip
// would put gold-as-text back in production without anyone noticing in a visual diff. Pinned here,
// at the class-table level, rather than only in a story: this is the one place both chip tables are
// enumerable data, so a future chip added straight to the table is covered without a render.
describe('inactive chip classes never use bare text-gold', () => {
  const NOT_INK_SAFE = /\btext-gold(?!-)/

  it.each([...STATE_CHIPS, ...TURNOUT_CHIPS])('$inactive', ({inactive}) => {
    expect(inactive).not.toMatch(NOT_INK_SAFE)
  })
})

// The tables are built once, at import; the labels must still follow a language change (ADR-0043).
describe('chip labels follow the language', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says the answer and turnout chips in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(STATE_CHIPS.map((c) => c.label)).toEqual(['Aanwezig', 'Misschien', 'Afwezig', 'Geen reactie'])
    expect(TURNOUT_CHIPS.map((c) => c.label)).toEqual(['Positie onbezet', 'Plekken open', 'Compleet', 'Geen doel ingesteld'])
  })
})
