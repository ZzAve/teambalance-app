import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from './wirespec-client'

// Pure-adapter units for the wirespec-client (the fetch handler behind `api`). Storybook owns
// anything that renders; Vitest owns pure, non-rendering logic like this request/response adapter.
// We drive the real public surface (`api`) with a stubbed `fetch`, asserting the behaviours the
// adapter is responsible for: CSRF header injection and 204-No-Content body handling.

interface FakeResponseInit {
  status: number
  body?: string
  headers?: Record<string, string>
}

function fakeResponse({ status, body = '', headers = {} }: FakeResponseInit) {
  return {
    status,
    headers: new Headers(headers),
    text: vi.fn().mockResolvedValue(body),
  }
}

function stubFetch(response: ReturnType<typeof fakeResponse>) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function headerOf(fetchMock: ReturnType<typeof stubFetch>, name: string): string {
  const init = fetchMock.mock.calls[0][1] as RequestInit
  return (init.headers as Record<string, string>)[name]
}

function urlOf(fetchMock: ReturnType<typeof stubFetch>): string {
  return fetchMock.mock.calls[0][0] as string
}

function initOf(fetchMock: ReturnType<typeof stubFetch>): RequestInit {
  return fetchMock.mock.calls[0][1] as RequestInit
}

describe('wirespec-client adapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  describe('CSRF token', () => {
    afterEach(() => {
      document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    })

    it('echoes the XSRF-TOKEN cookie as X-XSRF-TOKEN on a mutating request', async () => {
      document.cookie = 'XSRF-TOKEN=token-from-api; path=/'
      const fetchMock = stubFetch(fakeResponse({ status: 204 }))

      await api.Logout()

      expect(headerOf(fetchMock, 'X-XSRF-TOKEN')).toBe('token-from-api')
    })

    it('does not send it on a GET', async () => {
      document.cookie = 'XSRF-TOKEN=token-from-api; path=/'
      const fetchMock = stubFetch(fakeResponse({ status: 200, body: JSON.stringify({ events: [] }) }))

      await api.ListEvents({ 'include-past': false })

      expect(headerOf(fetchMock, 'X-XSRF-TOKEN')).toBeUndefined()
    })
  })

  describe('split-origin base URL (VITE_API_URL)', () => {
    it('keeps a relative URL (the Vite proxy path) when VITE_API_URL is unset in dev', async () => {
      const fetchMock = stubFetch(fakeResponse({ status: 200, body: JSON.stringify({ events: [] }) }))

      await api.ListEvents({ 'include-past': false })

      const url = urlOf(fetchMock)
      // Dev/e2e must stay same-origin so the Vite proxy (/api → :8080) keeps handling the call.
      expect(url.startsWith('/')).toBe(true)
      expect(url.startsWith('http')).toBe(false)
    })

    it('prefixes the request URL with VITE_API_URL for a split-origin prod build', async () => {
      vi.stubEnv('VITE_API_URL', 'https://api.teambalance.nl')
      const fetchMock = stubFetch(fakeResponse({ status: 200, body: JSON.stringify({ events: [] }) }))

      await api.ListEvents({ 'include-past': false })

      const url = urlOf(fetchMock)
      expect(url.startsWith('https://api.teambalance.nl/')).toBe(true)
      // No double slash where the base meets the path.
      expect(url).not.toContain('teambalance.nl//')
    })
  })

  describe('cross-subdomain session cookie', () => {
    it('sends credentials so the cross-origin session cookie rides along', async () => {
      const fetchMock = stubFetch(fakeResponse({ status: 200, body: JSON.stringify({ events: [] }) }))

      await api.ListEvents({ 'include-past': false })

      expect(initOf(fetchMock).credentials).toBe('include')
    })
  })

  describe('204 No Content handling', () => {
    it('resolves without reading the response body on a 204', async () => {
      const response = fakeResponse({ status: 204 })
      stubFetch(response)

      const res = await api.DeleteEvent({ id: 'evt-1', scope: undefined })

      expect(res.status).toBe(204)
      // The adapter must short-circuit on 204 rather than trying to read/parse an absent body.
      expect(response.text).not.toHaveBeenCalled()
    })
  })
})
