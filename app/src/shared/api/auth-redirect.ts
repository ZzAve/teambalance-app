export const LOGIN_PATH = '/login'

/** Backend `code` (GlobalExceptionHandler) for an authenticated user who belongs to no team yet. */
export const NO_TEAM_MEMBERSHIP_CODE = 'NO_TEAM_MEMBERSHIP'

/**
 * Whether an API response means we should bounce the user to the login screen. Kept pure (no
 * window/router) so it is unit-testable; the effectful redirect lives in [redirectToLogin].
 *
 * A 403 with the "no team membership" code is a teamless authenticated user (send to login); other
 * 403s (e.g. "not a team admin") are genuine permission errors and stay inline. The unauthenticated
 * (401) case is handled by the route guard via the session probe, not here.
 */
export function shouldRedirectToLogin(params: {
  status: number
  code: string | undefined
  currentPath: string
}): boolean {
  const { status, code, currentPath } = params
  if (currentPath === LOGIN_PATH) return false
  return status === 403 && code === NO_TEAM_MEMBERSHIP_CODE
}

let redirecting = false

/** Full-page redirect to login (a session bounce, so a hard nav is fine). Guarded against loops. */
export function redirectToLogin() {
  if (redirecting || window.location.pathname === LOGIN_PATH) return
  redirecting = true
  window.location.assign(LOGIN_PATH)
}
