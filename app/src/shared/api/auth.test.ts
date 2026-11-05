import { afterEach, describe, expect, it, vi } from 'vitest'
import { authMeQueryOptions, logOut } from './auth'
import { queryClient } from './query-client'

// Logout is only done when the server says so: the UI clears the client session on success, and a
// refused request (a 403 from the CSRF check, a 5xx) must not look like a logout while the server
// session is still valid.
describe('logOut', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function stubStatus(status: number) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status, headers: new Headers(), text: vi.fn().mockResolvedValue('') }),
    )
  }

  it('resolves when the server ended the session (204)', async () => {
    stubStatus(204)

    await expect(logOut()).resolves.toBeUndefined()
  })

  it.each([403, 500])('rejects when the server answered %i, so the session is not cleared client-side', async (status) => {
    stubStatus(status)

    await expect(logOut()).rejects.toThrow()
  })
})

describe('session probe retry', () => {
  const retry = queryClient.getQueryDefaults(authMeQueryOptions.queryKey).retry as (
    failureCount: number,
    error: unknown,
  ) => boolean

  it('keeps retrying a failed session probe for six retries, then stops', () => {
    const coldBoot = new TypeError('Failed to fetch')
    expect(retry(5, coldBoot)).toBe(true)
    expect(retry(6, coldBoot)).toBe(false)
  })
})
