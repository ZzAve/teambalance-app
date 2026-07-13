import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from './wirespec-client'

// Pure-adapter units for the wirespec-client (the fetch handler behind `api`). Storybook owns
// anything that renders; Vitest owns pure, non-rendering logic like this request/response adapter.
// We drive the real public surface (`api`) with a stubbed `fetch`, asserting the two behaviours the
// adapter is responsible for: X-Team-Id header injection and 204-No-Content body handling.

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

describe('wirespec-client adapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('X-Team-Id header injection', () => {
    it('sends the team id from localStorage as the X-Team-Id header', async () => {
      localStorage.setItem('teamId', 'team_test')
      const fetchMock = stubFetch(fakeResponse({ status: 200, body: JSON.stringify({ events: [] }) }))

      await api.ListEvents({ 'include-past': false })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(headerOf(fetchMock, 'X-Team-Id')).toBe('team_test')
    })

    it('falls back to the default team id when none is stored', async () => {
      const fetchMock = stubFetch(fakeResponse({ status: 200, body: JSON.stringify({ events: [] }) }))

      await api.ListEvents({ 'include-past': false })

      expect(headerOf(fetchMock, 'X-Team-Id')).toBe('setpoint_vt')
    })
  })

  describe('204 No Content handling', () => {
    it('resolves without reading the response body on a 204', async () => {
      const response = fakeResponse({ status: 204 })
      stubFetch(response)

      const res = await api.DeleteEvent({ id: 'evt-1' })

      expect(res.status).toBe(204)
      // The adapter must short-circuit on 204 rather than trying to read/parse an absent body.
      expect(response.text).not.toHaveBeenCalled()
    })
  })
})
