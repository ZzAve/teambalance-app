import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUser } from './auth'
import { authMeQueryOptions } from './auth'
import { clearSession, hasClearableSession } from './clear-session'
import { queryClient } from './query-client'
import { useUserStore } from '@shared/stores/user-store'

const USER: AuthenticatedUser = {
  id: 'u1',
  email: 'alex@example.com',
  displayName: 'Alex',
  role: undefined,
  teams: [],
  activeTeam: undefined,
  isPlatformAdmin: false,
  actAs: undefined,
}

describe('clearSession', () => {
  const originalLocation = window.location
  let assign: ReturnType<typeof vi.fn>
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // jsdom's real location.assign is non-configurable and throws "Not implemented", so swap the
    // whole location object for a stub carrying a spy — restored in afterEach.
    assign = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign },
    })
    // A real fetch would prove a network call slipped in; there is no api client on this path.
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null))
    // Start from a signed-in state so the clear is observable.
    useUserStore.getState().setCurrentUser(USER)
    queryClient.setQueryData(authMeQueryOptions.queryKey, USER)
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('nulls the user store', () => {
    clearSession()
    expect(useUserStore.getState().userId).toBeNull()
  })

  it('nulls the cached /auth/me', () => {
    clearSession()
    expect(queryClient.getQueryData(authMeQueryOptions.queryKey)).toBeNull()
  })

  it('hard-redirects to /login', () => {
    clearSession()
    expect(assign).toHaveBeenCalledWith('/login')
  })

  it('makes no network call', () => {
    clearSession()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('hasClearableSession', () => {
  afterEach(() => queryClient.clear())

  it('shows the hatch when a session is present', () => {
    queryClient.setQueryData(authMeQueryOptions.queryKey, USER)
    expect(hasClearableSession()).toBe(true)
  })

  it('hides the hatch once the probe resolves to no user', () => {
    queryClient.setQueryData(authMeQueryOptions.queryKey, null)
    expect(hasClearableSession()).toBe(false)
  })

  it('fails open: shows the hatch while the session is indeterminate', () => {
    // Cache never populated — the probe has not resolved, so we cannot rule out a session.
    expect(hasClearableSession()).toBe(true)
  })
})
