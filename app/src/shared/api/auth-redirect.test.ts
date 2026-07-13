import { describe, expect, it } from 'vitest'
import { NO_TEAM_MEMBERSHIP_CODE, shouldRedirectToLogin } from './auth-redirect'

describe('shouldRedirectToLogin', () => {
  it('redirects a teamless authenticated user (403 with the no-team code)', () => {
    expect(
      shouldRedirectToLogin({ status: 403, code: NO_TEAM_MEMBERSHIP_CODE, currentPath: '/' }),
    ).toBe(true)
  })

  it('does NOT redirect a genuine permission error (403 without the no-team code)', () => {
    expect(
      shouldRedirectToLogin({ status: 403, code: 'NOT_TEAM_ADMIN', currentPath: '/' }),
    ).toBe(false)
  })

  it('does NOT redirect other statuses', () => {
    expect(shouldRedirectToLogin({ status: 404, code: undefined, currentPath: '/' })).toBe(false)
    expect(shouldRedirectToLogin({ status: 500, code: undefined, currentPath: '/' })).toBe(false)
  })

  it('does NOT redirect when already on the login page (avoids a loop)', () => {
    expect(
      shouldRedirectToLogin({ status: 403, code: NO_TEAM_MEMBERSHIP_CODE, currentPath: '/login' }),
    ).toBe(false)
  })
})
