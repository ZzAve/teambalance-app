import { describe, expect, it } from 'vitest'
import type { AuthenticatedUser } from '@shared/api/auth'
import { accountSections } from './account-sections'

const TEAM = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }
const OTHER_TEAM = { id: 't2', name: 'Tovo Heren', slug: 'tovo-heren' }

function user(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 'u1',
    email: 'alex@example.com',
    displayName: 'Alex',
    role: undefined,
    teams: [],
    activeTeam: undefined,
    isPlatformAdmin: false,
    actAs: undefined,
    personalPhotoVersion: undefined,
    moneyPoolEnabled: undefined,
    language: undefined,
    passkeyCount: 0,
    ...overrides,
  }
}

describe('accountSections', () => {
  // The invariant the whole ADR turns on: Log out is present no matter the context.
  it.each([
    ['teamless', user()],
    ['single team', user({ teams: [TEAM], activeTeam: TEAM, role: 'USER' })],
    ['multi team, one active', user({ teams: [TEAM, OTHER_TEAM], activeTeam: TEAM, role: 'USER' })],
    ['multi team, none active', user({ teams: [TEAM, OTHER_TEAM] })],
    ['platform admin', user({ isPlatformAdmin: true })],
    ['act-as', user({ isPlatformAdmin: true, activeTeam: TEAM, role: 'ADMIN', actAs: { team: TEAM, expiresAt: 'x' } })],
  ])('always includes log out (%s)', (_label, u) => {
    expect(accountSections(u)).toContain('logout')
  })

  it('teamless: sign-in, teams, preferences, log out — no team profile, no admin', () => {
    expect(accountSections(user())).toEqual(['signIn', 'teams', 'preferences', 'logout'])
  })

  it('single team: adds the link to my profile in that team', () => {
    const sections = accountSections(user({ teams: [TEAM], activeTeam: TEAM, role: 'USER' }))
    expect(sections).toEqual(['signIn', 'teamProfile', 'teams', 'preferences', 'logout'])
  })

  it('multi team with one active is the same as single team (the switcher lives in Teams)', () => {
    const sections = accountSections(user({ teams: [TEAM, OTHER_TEAM], activeTeam: TEAM, role: 'USER' }))
    expect(sections).toEqual(['signIn', 'teamProfile', 'teams', 'preferences', 'logout'])
  })

  it('multi team with none active has no team profile (no Active Team yet)', () => {
    expect(accountSections(user({ teams: [TEAM, OTHER_TEAM] }))).toEqual(['signIn', 'teams', 'preferences', 'logout'])
  })

  it('platform admin adds the platform-admin section', () => {
    expect(accountSections(user({ isPlatformAdmin: true }))).toEqual(['signIn', 'teams', 'preferences', 'platformAdmin', 'logout'])
  })

  // Act-as: an Active Team through a Virtual Member, never a written one (ADR-0024 §2), so there is
  // no own member page to link to.
  it('act-as: platform admin, but no team profile', () => {
    const sections = accountSections(
      user({ isPlatformAdmin: true, activeTeam: TEAM, role: 'ADMIN', actAs: { team: TEAM, expiresAt: 'x' } }),
    )
    expect(sections).toEqual(['signIn', 'teams', 'preferences', 'platformAdmin', 'logout'])
  })
})
