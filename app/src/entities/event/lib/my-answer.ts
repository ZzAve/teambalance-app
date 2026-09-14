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
 *
 * `setBy` names a teammate who set this answer instead of the viewer (ADR-0003 trust-based editing,
 * resolved by `attributionName`, which is already silent for a self-set row). It changes the subject
 * of the sentence and nothing else: the tone still reports the answer, because the answer stands
 * whoever entered it. Folding it into the label rather than appending `set by …` underneath is what
 * keeps the correction where the claim is — an unattributed "You're in" credits the viewer with a
 * sentence they never said, and a caption below cannot unsay it.
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
      // Deliberately unattributed. Clearing an answer back to NOT_RESPONDED leaves a row whose
      // `changedBy` is the clearer, so `setBy` can arrive here — but the prompt asks for something,
      // and naming who cleared it blunts the ask without helping anyone act on it.
      return { label: 'Respond', tone: 'prompt' }
  }
}
