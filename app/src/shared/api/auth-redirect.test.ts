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

  // Since #143 this 403 no longer means "teamless" alone — it is also what a Member of several
  // Teams gets before one is Active (ADR-0023 §1). The screens that exist to resolve that must not
  // be bounced off it, or picking a Team would log you out on the way to picking it.
  it.each(['/select-team', '/select-team/', '/onboarding', '/create-team'])(
    'does NOT redirect from %s, which owns the no-Active-Team question itself',
    (currentPath) => {
      expect(shouldRedirectToLogin({ status: 403, code: NO_TEAM_MEMBERSHIP_CODE, currentPath })).toBe(false)
    },
  )

  it('still redirects from a team-scoped screen whose tenant could not be resolved', () => {
    expect(
      shouldRedirectToLogin({
        status: 403,
        code: NO_TEAM_MEMBERSHIP_CODE,
        currentPath: '/t/setpoint-vt/team',
      }),
    ).toBe(true)
  })
})
