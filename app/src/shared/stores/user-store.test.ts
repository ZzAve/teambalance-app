import { beforeEach, describe, expect, it } from 'vitest'
import type { AuthenticatedUser } from '@shared/api/auth'
import { useUserStore } from './user-store'

// Pure store logic — the setCurrentUser mapping from AuthenticatedUser onto the flat store shape.
// No rendering (that would be Storybook's job); this is the "stores" case the strategy assigns to
// Vitest. Reset to the initial snapshot between tests so ordering can't leak state.
const INITIAL = { userId: null, displayName: null, email: null, role: null, teamName: null, isPlatformAdmin: false }

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
      team: { id: 't-1', name: 'Heren 3', slug: 'heren-3' },
      isPlatformAdmin: true,
    }

    useUserStore.getState().setCurrentUser(user)

    expect(useUserStore.getState()).toMatchObject({
      userId: 'u-1',
      displayName: 'Alice',
      email: 'alice@example.com',
      role: 'ADMIN',
      teamName: 'Heren 3',
      isPlatformAdmin: true,
    })
  })

  it('defaults teamName to null when the user has no team', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-3',
      email: 'carol@example.com',
      displayName: 'Carol',
      role: undefined,
      team: undefined,
      isPlatformAdmin: false,
    })

    expect(useUserStore.getState().teamName).toBeNull()
  })

  it('defaults role to null when the user has none', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-2',
      email: 'bob@example.com',
      displayName: 'Bob',
      role: undefined,
      team: undefined,
      isPlatformAdmin: false,
    })

    expect(useUserStore.getState().role).toBeNull()
  })

  it('defaults isPlatformAdmin to false when the field is absent', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-4',
      email: 'dave@example.com',
      displayName: 'Dave',
      role: 'USER',
      team: undefined,
      isPlatformAdmin: false,
    })

    expect(useUserStore.getState().isPlatformAdmin).toBe(false)
  })

  it('resets every field to null on setCurrentUser(null)', () => {
    useUserStore.getState().setCurrentUser({
      id: 'u-1',
      email: 'alice@example.com',
      displayName: 'Alice',
      role: 'ADMIN',
      team: undefined,
      isPlatformAdmin: true,
    })

    useUserStore.getState().setCurrentUser(null)

    expect(useUserStore.getState()).toMatchObject(INITIAL)
  })
})
