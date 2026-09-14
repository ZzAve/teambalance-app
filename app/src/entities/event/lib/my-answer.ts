import type { Event } from '@shared/api/events'

type AttendanceState = Event['myState']

/** The viewer's own answer, in words, plus which semantic tone the pill carries. */
export interface MyAnswer {
  label: string
  /** `prompt` is the unanswered state — the one that asks for something, drawn as an invitation. */
  tone: 'attending' | 'maybe' | 'absent' | 'prompt'
}

/**
 * The viewer's own attendance, said in words for the card's answer pill.
 *
 * The three settled answers are statements. `NOT_RESPONDED` is the single state that asks the viewer
 * to act, so it is drawn as a `prompt` — a loud, neutral call to action ("Respond") rather than a
 * soft coloured status, so "we still need your answer" cannot be mistaken for a fourth answer.
 *
 * [setBy] names whoever gave the answer when that was not the viewer (⑪). It changes the *subject*
 * of the sentence rather than adding a footnote to it — "Lisa Bakker said you're in" is the whole
 * fact in the place the viewer already reads, which is why the card needs no separate marker for it.
 * It never applies to `NOT_RESPONDED`: an answer nobody gave has no author (see `attributionName`).
 */
export function myAnswer(state: AttendanceState, setBy?: string | null): MyAnswer {
  switch (state) {
    case 'ATTENDING':
      return { label: setBy ? `${setBy} said you're in` : "You're in", tone: 'attending' }
    case 'MAYBE':
      return { label: setBy ? `${setBy} said maybe` : 'You said maybe', tone: 'maybe' }
    case 'ABSENT':
      return { label: setBy ? `${setBy} said you're out` : "You're out", tone: 'absent' }
    case 'NOT_RESPONDED':
      return { label: 'Respond', tone: 'prompt' }
  }
}
