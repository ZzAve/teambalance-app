import type { AttendanceEntry } from '@shared/api/events'

export type AttendanceState = AttendanceEntry['state']

/**
 * The four Attendance States in the member's own words — CONTEXT.md's "Attendance State" entry,
 * and the one place the words live so no surface can drift from another (#335).
 *
 * `word` is the answer as a control, a filter chip, a row or a lineup chip says it. `pill` is the
 * card's answer pill: three statements and one prompt. `status` is the same answer mid-sentence,
 * for the hero's "10 going · you're in" line.
 */
export const ATTENDANCE_WORDS: Record<AttendanceState, { word: string; pill: string; status: string }> = {
  ATTENDING: { word: 'Going', pill: "You're in", status: "you're in" },
  MAYBE: { word: 'Maybe', pill: 'You said maybe', status: 'you said maybe' },
  ABSENT: { word: "Can't", pill: "You're out", status: "you're out" },
  NOT_RESPONDED: { word: 'Not responded', pill: 'Respond', status: "you haven't responded" },
}

/** The `word` mid-sentence: "currently not responded", "2 maybe", "Show 3 more going". */
export const LOWER_WORD: Record<AttendanceState, string> = {
  ATTENDING: ATTENDANCE_WORDS.ATTENDING.word.toLowerCase(),
  MAYBE: ATTENDANCE_WORDS.MAYBE.word.toLowerCase(),
  ABSENT: ATTENDANCE_WORDS.ABSENT.word.toLowerCase(),
  NOT_RESPONDED: ATTENDANCE_WORDS.NOT_RESPONDED.word.toLowerCase(),
}
