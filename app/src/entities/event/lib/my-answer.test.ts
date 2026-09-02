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
    expect(myAnswer('NOT_RESPONDED')).toEqual({ label: 'Going?', tone: 'prompt' })
  })
})
