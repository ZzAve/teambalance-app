import type { Event } from '@shared/api/events'

type AttendanceState = Event['myState']

/** The viewer's own answer, in words, plus which semantic tone the pill carries. */
export interface MyAnswer {
  label: string
  /** `prompt` is the unanswered state — the one that asks for something, drawn as an invitation. */
  tone: 'attending' | 'maybe' | 'absent' | 'prompt'
}

/**
 * The viewer's own attendance, said in the first person for the card's answer pill.
 *
 * The three settled answers are statements. `NOT_RESPONDED` is the single state that asks the viewer
 * to act, so it is drawn as a `prompt` — a loud, neutral call to action ("Respond") rather than a
 * soft coloured status, so "we still need your answer" cannot be mistaken for a fourth answer.
 */
export function myAnswer(state: AttendanceState): MyAnswer {
  switch (state) {
    case 'ATTENDING':
      return { label: "You're in", tone: 'attending' }
    case 'MAYBE':
      return { label: 'You said maybe', tone: 'maybe' }
    case 'ABSENT':
      return { label: "You're out", tone: 'absent' }
    case 'NOT_RESPONDED':
      return { label: 'Respond', tone: 'prompt' }
  }
}
