/** Backend `code` (GlobalExceptionHandler) for a request whose act-as grant had run out. */
export const ACT_AS_EXPIRED_CODE = 'ACT_AS_EXPIRED'

/** Where a Platform Admin belongs once they are inside no Team: the console, never `/onboarding`. */
export const PLATFORM_CONSOLE_PATH = '/admin/teams'

/**
 * Survives the hard navigation below, which is why it is storage and not a toast call: the console
 * reads it once on arrival and clears it, so the operator learns *why* they were sent back.
 */
export const ACT_AS_EXPIRED_FLAG = 'actAsExpired'

/**
 * Whether an API response means the caller's act-as ran out. Kept pure (no window/router) so it is
 * unit-testable; the effectful redirect lives in [returnToConsole].
 *
 * The backend answers `ACT_AS_EXPIRED` rather than a generic 403 precisely so this can be told apart
 * from "you may not do this" — the first is a lapse to recover from, the second an error to read.
 */
export function isActAsExpired(params: { status: number; code: string | undefined }): boolean {
  return params.status === 403 && params.code === ACT_AS_EXPIRED_CODE
}

/**
 * Leaves the Team by leaving the page. A **full** navigation, not a router one: every cached read
 * belongs to a tenant the caller no longer has, and an in-app navigation would refetch those queries
 * on the way out — each answering 403 and bouncing the operator to the login screen.
 */
export function goToConsole() {
  if (window.location.pathname === PLATFORM_CONSOLE_PATH) return
  window.location.assign(PLATFORM_CONSOLE_PATH)
}

let returning = false

/** The lapse path into [goToConsole], leaving behind the reason. Loop-guarded. */
export function returnToConsole() {
  if (returning || window.location.pathname === PLATFORM_CONSOLE_PATH) return
  returning = true
  try {
    window.sessionStorage.setItem(ACT_AS_EXPIRED_FLAG, '1')
  } catch {
    // Private mode / storage disabled — the redirect still matters more than the explanation.
  }
  goToConsole()
}

/** Reads and clears the "you were sent back because it ran out" flag. */
export function consumeActAsExpiredFlag(): boolean {
  try {
    const flagged = window.sessionStorage.getItem(ACT_AS_EXPIRED_FLAG) !== null
    window.sessionStorage.removeItem(ACT_AS_EXPIRED_FLAG)
    return flagged
  } catch {
    return false
  }
}
