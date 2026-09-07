import type { AttendanceEntry } from '@shared/api/events'

type AttendanceState = AttendanceEntry['state']

const LABEL: Record<AttendanceState, string> = {
  ATTENDING: 'Going',
  MAYBE: 'Maybe',
  ABSENT: "Can't go",
  NOT_RESPONDED: 'Awaiting',
}

export interface CrossMemberToast {
  message: string
  /**
   * The state to restore on Undo, or null when it can't be restored: NOT_RESPONDED *is* the absence
   * of a row (ADR-0009/0020), and the write API has no way to recreate that — so a change that added
   * an answer for someone who hadn't responded gets a plain confirmation, no Undo.
   */
  undoState: AttendanceState | null
}

/**
 * The toast shown after a member changes *someone else's* answer (⑫). ADR-0003 makes this trust-based,
 * so the toast is the awareness and the safety net, never a gate. Undo restores the prior answer when
 * that answer was a stored one; see `undoState`.
 */
export function crossMemberToast(name: string, next: AttendanceState, prior: AttendanceState): CrossMemberToast {
  return {
    message: `Set ${name} to ${LABEL[next]}`,
    undoState: prior === 'NOT_RESPONDED' ? null : prior,
  }
}
