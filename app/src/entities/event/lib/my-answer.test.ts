import { describe, expect, it } from 'vitest'
import { myAnswer } from './my-answer'

describe('myAnswer', () => {
  it('states a settled answer in words', () => {
    expect(myAnswer('ATTENDING')).toEqual({ label: "You're in", tone: 'attending' })
    expect(myAnswer('MAYBE')).toEqual({ label: 'You said maybe', tone: 'maybe' })
    expect(myAnswer('ABSENT')).toEqual({ label: "You're out", tone: 'absent' })
  })

  // The one state that asks for something is drawn as a prompt, not a statement.
  it('asks the question when unanswered', () => {
    expect(myAnswer('NOT_RESPONDED')).toEqual({ label: 'Respond', tone: 'prompt' })
  })

  // A teammate may set your answer (ADR-0003). Saying "You're in" then credits you with a sentence
  // you never said, so the setter takes the subject — same tone, because the answer itself stands.
  it('names the teammate who set the answer', () => {
    expect(myAnswer('ATTENDING', 'Lisa')).toEqual({ label: "Lisa said you're in", tone: 'attending' })
    expect(myAnswer('MAYBE', 'Lisa')).toEqual({ label: 'Lisa said maybe', tone: 'maybe' })
    expect(myAnswer('ABSENT', 'Lisa')).toEqual({ label: "Lisa said you're out", tone: 'absent' })
  })

  // `attributionName` already returns null for a self-set row, so this is the normal case arriving.
  it('stays first-person when nobody else set it', () => {
    expect(myAnswer('ATTENDING', null)).toEqual({ label: "You're in", tone: 'attending' })
    expect(myAnswer('ATTENDING', undefined)).toEqual({ label: "You're in", tone: 'attending' })
  })

  // Clearing someone's answer back to NOT_RESPONDED leaves a row whose `changedBy` is the clearer.
  // "Lisa said respond" is nonsense — the prompt is a call to act, and attribution would only blunt
  // it. The ask survives intact.
  it('keeps the prompt unattributed', () => {
    expect(myAnswer('NOT_RESPONDED', 'Lisa')).toEqual({ label: 'Respond', tone: 'prompt' })
  })
})
