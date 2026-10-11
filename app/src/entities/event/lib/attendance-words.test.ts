import { describe, expect, it } from 'vitest'
import { ATTENDANCE_WORDS } from './attendance-words'

// The expected table is CONTEXT.md's "Attendance State" entry, verbatim: controls, filters, rows
// and chips say the `word`; the card's answer pill says the `pill`; the hero's status line says the
// `status` clause mid-sentence.
describe('ATTENDANCE_WORDS', () => {
  it('says the four states in the words CONTEXT.md fixes', () => {
    expect(ATTENDANCE_WORDS).toEqual({
      ATTENDING: { word: 'Going', pill: "You're in", status: "you're in" },
      MAYBE: { word: 'Maybe', pill: 'You said maybe', status: 'you said maybe' },
      ABSENT: { word: "Can't", pill: "You're out", status: "you're out" },
      NOT_RESPONDED: { word: 'Not responded', pill: 'Respond', status: "you haven't responded" },
    })
  })
})
