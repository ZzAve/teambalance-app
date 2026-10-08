import { describe, expect, it } from 'vitest'
import type { AuthenticatedUser } from '@shared/api/auth'
import { decideLanding, decideTeamEntry, teamlessDestination } from './team-entry'

const ALPHA = { id: 't1', name: 'Alpha', slug: 'alpha' }
const BETA = { id: 't2', name: 'Beta', slug: 'beta' }

const user = (overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser => ({
  id: 'u1',
  email: 'alex@example.com',
  displayName: 'Alex',
  role: 'USER',
  teams: [ALPHA, BETA],
  activeTeam: ALPHA,
  isPlatformAdmin: false,
  actAs: undefined,
  personalPhotoVersion: undefined,
  ...overrides,
})

const actingAs = (overrides: Partial<AuthenticatedUser> = {}) =>
  user({ actAs: { team: ALPHA } as AuthenticatedUser['actAs'], ...overrides })

describe('decideTeamEntry', () => {
  it('sends a missing session to login', () => {
    expect(decideTeamEntry(null, 'alpha', '/t/alpha')).toBe('login')
  })

  it('activates the team when the URL names a team other than the active one', () => {
    expect(decideTeamEntry(user({ activeTeam: BETA }), 'alpha', '/t/alpha')).toBe('activate')
  })

  it('activates when no team is active', () => {
    expect(decideTeamEntry(user({ activeTeam: undefined }), 'alpha', '/t/alpha')).toBe('activate')
  })

  it('lets a platform admin acting-as through without an onboarding check', () => {
    expect(decideTeamEntry(actingAs(), 'alpha', '/t/alpha')).toBe('ok')
  })

  it('does not check onboarding on the get-started page itself', () => {
    expect(decideTeamEntry(user(), 'alpha', '/t/alpha/get-started/')).toBe('ok')
  })

  it('asks for the member before deciding on onboarding', () => {
    expect(decideTeamEntry(user(), 'alpha', '/t/alpha')).toBe('check-onboarding')
  })

  it('sends a member who is not onboarded to get-started', () => {
    expect(decideTeamEntry(user(), 'alpha', '/t/alpha', { onboarded: false })).toBe('get-started')
  })

  it('lets an onboarded member through', () => {
    expect(decideTeamEntry(user(), 'alpha', '/t/alpha', { onboarded: true })).toBe('ok')
  })

  it('fails open when the member could not be read', () => {
    expect(decideTeamEntry(user(), 'alpha', '/t/alpha', null)).toBe('ok')
  })
})

describe('teamlessDestination', () => {
  it('is null for a user with teams', () => {
    expect(teamlessDestination(user())).toBeNull()
  })

  it('sends a teamless player to onboarding', () => {
    expect(teamlessDestination(user({ teams: [], activeTeam: undefined }))).toBe('/onboarding')
  })

  it('sends a teamless platform admin to the console', () => {
    expect(teamlessDestination(user({ teams: [], activeTeam: undefined, isPlatformAdmin: true }))).toBe('/admin/teams')
  })

  it('is null for a platform admin acting-as, who has no membership', () => {
    expect(teamlessDestination(actingAs({ teams: [] }))).toBeNull()
  })
})

describe('decideLanding', () => {
  it('goes to the active team events', () => {
    expect(decideLanding(user())).toBe('/t/alpha')
  })

  it('asks a user with teams but no active team to select one', () => {
    expect(decideLanding(user({ activeTeam: undefined }))).toBe('/select-team')
  })

  it('goes to the teamless destination before looking at the active team', () => {
    expect(decideLanding(user({ teams: [], activeTeam: undefined }))).toBe('/onboarding')
  })
})
