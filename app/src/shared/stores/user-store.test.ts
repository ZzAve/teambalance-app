import { beforeEach, describe, expect, it } from 'vitest'
import type { AuthenticatedUser } from '@shared/api/auth'
import { useUserStore } from './user-store'

// Pure store logic — the setCurrentUser mapping from AuthenticatedUser onto the flat store shape.
// No rendering (that would be Storybook's job); this is the "stores" case the strategy assigns to
// Vitest. Reset to the initial snapshot between tests so ordering can't leak state.
const INITIAL = {
  userId: null,
  displayName: null,
  email: null,
  role: null,
  teamName: null,
  teamSlug: null,
  isPlatformAdmin: false,
  actAs: undefined,
}

const HEREN_3 = { id: 't-1', name: 'Heren 3', slug: 'heren-3' }
const DAMES_2 = { id: 't-2', name: 'Dames 2', slug: 'dames-2' }

describe('user-store', () => {
  beforeEach(() => {
    useUserStore.setState(INITIAL)
  })

  it('maps an AuthenticatedUser onto the store', () => {
    const user: AuthenticatedUser = {
      id: 'u-1',
      email: 'alice@example.com',
      displayName: 'Alice',
      role: 'ADMIN',
      teams: [HEREN_3],
      activeTeam: HEREN_3,
      isPlatformAdmin: true,
      actAs: undefined,
    }

    useUserStore.getState().setCurrentUser(user)

    expect(useUserStore.getState()).toMatchObject({
      userId: 'u-1',
      displayName: 'Alice',
      email: 'alice@example.com',
      role: 'ADMIN',
      teamName: 'Heren 3',
      teamSlug: 'heren-3',
      isPlatformAdmin: true,
      actAs: undefined,
    })
  })

  it('names the Active Team, not the first of several memberships', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-1',
      email: 'alice@example.com',
      displayName: 'Alice',
      role: 'USER',
      teams: [HEREN_3, DAMES_2],
      activeTeam: DAMES_2,
      isPlatformAdmin: false,
      actAs: undefined,
    })

    expect(useUserStore.getState()).toMatchObject({ teamName: 'Dames 2', teamSlug: 'dames-2' })
  })

  // Reading the list's first entry here would be the old misrouting wearing frontend clothes.
  it('names no Team when memberships exist but none is active', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-1',
      email: 'alice@example.com',
      displayName: 'Alice',
      role: undefined,
      teams: [HEREN_3, DAMES_2],
      activeTeam: undefined,
      isPlatformAdmin: false,
      actAs: undefined,
    })

    expect(useUserStore.getState()).toMatchObject({ teamName: null, teamSlug: null, role: null })
  })

  it('defaults teamName to null for a teamless user', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-3',
      email: 'carol@example.com',
      displayName: 'Carol',
      role: undefined,
      teams: [],
      activeTeam: undefined,
      isPlatformAdmin: false,
      actAs: undefined,
    })

    expect(useUserStore.getState().teamName).toBeNull()
  })

  it('defaults role to null when the user has none', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-2',
      email: 'bob@example.com',
      displayName: 'Bob',
      role: undefined,
      teams: [],
      activeTeam: undefined,
      isPlatformAdmin: false,
      actAs: undefined,
    })

    expect(useUserStore.getState().role).toBeNull()
  })

  it('defaults isPlatformAdmin to false when the field is absent', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-4',
      email: 'dave@example.com',
      displayName: 'Dave',
      role: 'USER',
      teams: [],
      activeTeam: undefined,
      isPlatformAdmin: false,
      actAs: undefined,
    })

    expect(useUserStore.getState().isPlatformAdmin).toBe(false)
  })

  it('resets every field to null on setCurrentUser(null)', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-1',
      email: 'alice@example.com',
      displayName: 'Alice',
      role: 'ADMIN',
      teams: [HEREN_3],
      activeTeam: HEREN_3,
      isPlatformAdmin: true,
      actAs: undefined,
    })

    useUserStore.getState().setCurrentUser(null)

    expect(useUserStore.getState()).toMatchObject(INITIAL)
  })
})
