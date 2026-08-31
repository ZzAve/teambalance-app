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
    ...overrides,
  }
}

describe('accountSections', () => {
  // The invariant the whole ADR turns on: Log out is present no matter the context.
  it.each([
    ['teamless', user()],
    ['single team', user({ teams: [TEAM], activeTeam: TEAM, role: 'MEMBER' })],
    ['multi team, one active', user({ teams: [TEAM, OTHER_TEAM], activeTeam: TEAM, role: 'MEMBER' })],
    ['multi team, none active', user({ teams: [TEAM, OTHER_TEAM] })],
    ['platform admin', user({ isPlatformAdmin: true })],
    ['act-as', user({ isPlatformAdmin: true, activeTeam: TEAM, role: 'ADMIN', actAs: { team: TEAM, expiresAt: 'x' } })],
  ])('always includes log out (%s)', (_label, u) => {
    expect(accountSections(u)).toContain('logout')
  })

  it('teamless: email, appearance, teams, log out — no name/position, no admin', () => {
    expect(accountSections(user())).toEqual(['email', 'appearance', 'teams', 'logout'])
  })

  it('single team: adds display name + position', () => {
    const sections = accountSections(user({ teams: [TEAM], activeTeam: TEAM, role: 'MEMBER' }))
    expect(sections).toEqual(['email', 'displayName', 'position', 'appearance', 'teams', 'logout'])
  })

  it('multi team with one active is the same as single team (the switcher lives in Teams)', () => {
    const sections = accountSections(user({ teams: [TEAM, OTHER_TEAM], activeTeam: TEAM, role: 'MEMBER' }))
    expect(sections).toEqual(['email', 'displayName', 'position', 'appearance', 'teams', 'logout'])
  })

  it('multi team with none active hides name/position (no Active Team yet)', () => {
    const sections = accountSections(user({ teams: [TEAM, OTHER_TEAM] }))
    expect(sections).toEqual(['email', 'appearance', 'teams', 'logout'])
  })

  it('platform admin adds the platform-admin section', () => {
    expect(accountSections(user({ isPlatformAdmin: true }))).toContain('platformAdmin')
  })

  // Act-as: an Active Team without a membership (teams empty). Name + position still show — they
  // read the session tenant — and admin shows too. (ADR-0024 / ADR-0027 consequences.)
  it('act-as: shows name/position (via the session tenant) and platform admin', () => {
    const sections = accountSections(
      user({ isPlatformAdmin: true, activeTeam: TEAM, role: 'ADMIN', actAs: { team: TEAM, expiresAt: 'x' } }),
    )
    expect(sections).toEqual([
      'email',
      'displayName',
      'position',
      'appearance',
      'teams',
      'platformAdmin',
      'logout',
    ])
  })
})
