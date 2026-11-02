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
  // ⑪: the answer is the same, the author is not. Named in the pill rather than marked beside it,
  // so the one thing a scanned list already reads carries the whole fact.
  it('names the teammate who gave the answer, in place of the first person', () => {
    expect(myAnswer('ATTENDING', 'Lisa Bakker').label).toBe("Lisa Bakker said you're in")
    expect(myAnswer('MAYBE', 'Lisa Bakker').label).toBe('Lisa Bakker said maybe')
    expect(myAnswer('ABSENT', 'Lisa Bakker').label).toBe("Lisa Bakker said you're out")
  })

  it('keeps the tone of the answer, not of who gave it', () => {
    expect(myAnswer('ABSENT', 'Lisa Bakker').tone).toBe('absent')
  })
})
