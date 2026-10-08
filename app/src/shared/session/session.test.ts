import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUser } from '@shared/api/auth'
import { authMeQueryOptions } from '@shared/api/auth'
import { afterTenantChange, enterTeam, endSession, hasClearableSession } from './session'
import { queryClient } from '@shared/api/query-client'

const USER: AuthenticatedUser = {
  id: 'u1',
  email: 'alex@example.com',
  displayName: 'Alex',
  role: undefined,
  teams: [],
  activeTeam: undefined,
  isPlatformAdmin: false,
  actAs: undefined,
  personalPhotoVersion: undefined,
}

describe('endSession', () => {
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
    queryClient.setQueryData(authMeQueryOptions.queryKey, USER)
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('nulls the cached /auth/me', () => {
    endSession()
    expect(queryClient.getQueryData(authMeQueryOptions.queryKey)).toBeNull()
  })

  it('hard-redirects to /login', () => {
    endSession()
    expect(assign).toHaveBeenCalledWith('/login')
  })

  it('makes no network call', () => {
    endSession()
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

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status })

describe('afterTenantChange', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('drops tenant-scoped cache and reads /auth/me again', async () => {
    const switched = { ...USER, activeTeam: { id: 't2', name: 'Beta', slug: 'beta' } }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json(200, switched))
    queryClient.setQueryData(['events'], ['stale'])
    queryClient.setQueryData(authMeQueryOptions.queryKey, USER)

    const user = await afterTenantChange()

    expect(user?.activeTeam?.slug).toBe('beta')
    expect(queryClient.getQueryData(authMeQueryOptions.queryKey)).toEqual(switched)
    expect(queryClient.getQueryData(['events'])).toBeUndefined()
  })
})

describe('enterTeam', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('is null, and leaves the cache alone, when the team cannot be activated', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(json(404, {}))
    queryClient.setQueryData(['events'], ['kept'])

    expect(await enterTeam('nope')).toBeNull()

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(queryClient.getQueryData(['events'])).toEqual(['kept'])
  })

  it('activates, resets the cache and returns the refreshed user', async () => {
    const beta = { id: 't2', name: 'Beta', slug: 'beta' }
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(json(200, beta))
      .mockResolvedValueOnce(json(200, { ...USER, activeTeam: beta }))
    queryClient.setQueryData(['events'], ['stale'])

    const entered = await enterTeam('beta')

    expect(entered?.user?.activeTeam?.slug).toBe('beta')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(queryClient.getQueryData(['events'])).toBeUndefined()
  })
})
