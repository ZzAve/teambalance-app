import type { AttendanceEntry } from '@shared/api/events'
import { i18n } from '@shared/i18n/i18n'

export type AttendanceState = AttendanceEntry['state']

/**
 * The four Attendance States in the member's own words — CONTEXT.md's "Attendance State" entry and
 * its UI words per language — and the one place surfaces read them from, so none can drift from
 * another (#335). The words themselves live in the `attendance` section of the catalogues.
 *
 * `word` is the answer as a control, a filter chip, a row or a lineup chip says it. `pill` is the
 * card's answer pill: three statements and one prompt. `status` is the same answer mid-sentence,
 * for the hero's "10 going · you're in" line.
 */
export const ATTENDANCE_WORDS: Record<AttendanceState, { readonly word: string; readonly pill: string; readonly status: string }> =
  {
    ATTENDING: words('ATTENDING'),
    MAYBE: words('MAYBE'),
    ABSENT: words('ABSENT'),
    NOT_RESPONDED: words('NOT_RESPONDED'),
  }

/** The `word` mid-sentence: "currently not responded", "2 maybe", "Show 3 more going". */
export const LOWER_WORD: Record<AttendanceState, string> = {
  get ATTENDING() { return ATTENDANCE_WORDS.ATTENDING.word.toLowerCase() },
  get MAYBE() { return ATTENDANCE_WORDS.MAYBE.word.toLowerCase() },
  get ABSENT() { return ATTENDANCE_WORDS.ABSENT.word.toLowerCase() },
  get NOT_RESPONDED() { return ATTENDANCE_WORDS.NOT_RESPONDED.word.toLowerCase() },
}

// Getters, read at render, so every surface keeps reading the map as it always has and still says the
// words in the current language (ADR-0043). A surface re-renders on a language change when it, or a
// parent, uses `useTranslation`.
function words(state: AttendanceState) {
  return {
    get word() { return i18n.t(`attendance.word.${state}`) },
    get pill() { return i18n.t(`attendance.pill.${state}`) },
    get status() { return i18n.t(`attendance.status.${state}`) },
  }
}
