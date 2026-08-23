export const LOGIN_PATH = '/login'

/** Backend `code` (GlobalExceptionHandler) for a request that resolved to no tenant. */
export const NO_TEAM_MEMBERSHIP_CODE = 'NO_TEAM_MEMBERSHIP'

/**
 * Routes that already own the "you have no Active Team" question. The 403 no longer means only
 * "teamless" — a Member of several Teams gets it before choosing — so bouncing these to login would
 * log out a perfectly authenticated person.
 */
const TENANT_RESOLVING_PATHS = ['/select-team', '/onboarding', '/create-team']

/**
 * Whether an API response means we should bounce the user to the login screen. Kept pure (no
 * window/router) so it is unit-testable; the effectful redirect lives in [redirectToLogin].
 *
 * A 403 with the "no team membership" code means the request resolved to no tenant — a
 * session-shaped problem everywhere except on the screens that exist to fix it. Other 403s (e.g.
 * "not a team admin") are genuine permission errors and stay inline. The 401 case is the route
 * guard's, not this one's.
 */
export function shouldRedirectToLogin(params: {
  status: number
  code: string | undefined
  currentPath: string
}): boolean {
  const { status, code, currentPath } = params
  const path = currentPath.replace(/\/$/, '') || '/'
  if (path === LOGIN_PATH) return false
  if (TENANT_RESOLVING_PATHS.includes(path)) return false
  return status === 403 && code === NO_TEAM_MEMBERSHIP_CODE
}

let redirecting = false

/** Full-page redirect to login (a session bounce, so a hard nav is fine). Guarded against loops. */
export function redirectToLogin() {
  if (redirecting || window.location.pathname === LOGIN_PATH) return
  redirecting = true
  window.location.assign(LOGIN_PATH)
}
