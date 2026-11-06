import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { ATTENDANCE_WORDS, LOWER_WORD } from './attendance-words'

// The expected tables are CONTEXT.md's "Attendance State" entry and its "UI words per language"
// table, verbatim: controls, filters, rows and chips say the `word`; the card's answer pill says the
// `pill`; the hero's status line says the `status` clause mid-sentence.
describe('ATTENDANCE_WORDS', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says the four states in the words CONTEXT.md fixes', () => {
    expect(ATTENDANCE_WORDS).toEqual({
      ATTENDING: { word: 'Going', pill: "You're in", status: "you're in" },
      MAYBE: { word: 'Maybe', pill: 'You said maybe', status: 'you said maybe' },
      ABSENT: { word: "Can't", pill: "You're out", status: "you're out" },
      NOT_RESPONDED: { word: 'Not responded', pill: 'Respond', status: "you haven't responded" },
    })
  })

  it('says them in the Dutch UI words when the language is Dutch', async () => {
    await i18n.changeLanguage('nl')

    expect(ATTENDANCE_WORDS).toEqual({
      ATTENDING: { word: 'Aanwezig', pill: 'Je bent erbij', status: 'je bent erbij' },
      MAYBE: { word: 'Misschien', pill: 'Je zei misschien', status: 'je zei misschien' },
      ABSENT: { word: 'Afwezig', pill: 'Je bent er niet bij', status: 'je bent er niet bij' },
      NOT_RESPONDED: { word: 'Geen reactie', pill: 'Reageer', status: 'je hebt nog niet gereageerd' },
    })
    expect(LOWER_WORD.ATTENDING).toBe('aanwezig')
  })
})
