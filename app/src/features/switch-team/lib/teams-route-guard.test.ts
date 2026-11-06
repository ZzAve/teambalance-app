import { describe, expect, it } from 'vitest'
import { LOGIN_PATH } from '@shared/api/auth-redirect'
import { teamsRouteRedirect } from './teams-route-guard'

const TEAM = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }

describe('teamsRouteRedirect', () => {
  it('no session → the login path', () => {
    expect(teamsRouteRedirect(null)).toBe(LOGIN_PATH)
  })

  it('truly teamless (no memberships) → /onboarding', () => {
    expect(teamsRouteRedirect({ teams: [] })).toBe('/onboarding')
  })

  // The Slice 2 relaxation: a member reaches the Teams view instead of bouncing to `/`, whether or
  // not one of their teams is already active.
  it('a member with one team stays (no redirect)', () => {
    expect(teamsRouteRedirect({ teams: [TEAM] })).toBeNull()
  })

  it('a member with several teams stays (no redirect)', () => {
    expect(teamsRouteRedirect({ teams: [TEAM, { ...TEAM, id: 't2', slug: 'tovo' }] })).toBeNull()
  })
})
