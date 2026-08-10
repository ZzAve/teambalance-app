import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'
import type { AuthenticatedUser } from '@shared/api/auth'

// A stateful in-test session (msw/node): verify establishes it, /me reflects it. The auth
// render-gate is a routing concern — not story-able, and its timing edge cases can't be forced
// against the real backend — so it stays a jsdom test here; the happy verify path is also proven
// end-to-end by the real e2e login flow. The verify response is deliberately delayed relative to
// /me's so the guard's own mount-time /me fetch (started at the same time, on the un-verified
// session) resolves first — matching real latency, where verify does token/session work and
// /me is a cheap read. This proves the redirect guard trusts the direct cache write from
// verify rather than racing it with a slower background fetch.
let session: AuthenticatedUser | null = null

const USER: AuthenticatedUser = {
  id: 'user-1',
  email: 'jan@example.com',
  displayName: 'Jan',
  role: 'USER',
  // A member of a team, so the has-a-team gate passes and the flow lands on events (not /create-team).
  team: { id: 'team-1', name: 'Setpoint VT', slug: 'setpoint-vt' },
  isPlatformAdmin: false,
}

const server = setupServer(
  http.post('/api/auth/magic-link/verify', async ({ request }) => {
    const body = (await request.json()) as { token: string }
    if (body.token !== 'valid-token') return new HttpResponse(null, { status: 401 })
    await delay(10)
    session = USER
    return HttpResponse.json(USER)
  }),
  http.get('/api/auth/me', () => (session ? HttpResponse.json(session) : new HttpResponse(null, { status: 401 }))),
  // The root onboarding gate reads /members/me; an onboarded member skips /welcome and lands on
  // events, keeping this test focused on the verify/auth-routing seam.
  http.get('/api/members/me', () =>
    HttpResponse.json({ userId: 'user-1', displayName: 'Jan', role: 'USER', onboarded: true }),
  ),
  http.get('/api/events', () => HttpResponse.json({ events: [] })),
  http.get('/api/event-types', () => HttpResponse.json({ eventTypes: [] })),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  session = null
})
afterAll(() => server.close())

function renderAppAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) })
  render(<RouterProvider router={router} />)
  return router
}

describe('magic-link verification', () => {
  // Timeouts are generous because the assertion waits out a real chain — the 10ms verify delay,
  // the direct cache write, the redirect, then the events route mounting — which a loaded CI
  // runner walks through well past the 1000ms default (green locally, flaked in CI at 1000ms).
  it('establishes the session and lands on events, without the guard bouncing back to login', async () => {
    const router = renderAppAt('/auth/verify?token=valid-token')

    await waitFor(() => expect(router.state.location.pathname).toBe('/'), { timeout: 5000 })
    expect(await screen.findByRole('heading', { name: 'Events' }, { timeout: 5000 })).toBeInTheDocument()
    expect(screen.queryByText(/link expired/i)).not.toBeInTheDocument()
  })

  it('rejects an invalid token and keeps the guard from ever granting access', async () => {
    const router = renderAppAt('/auth/verify?token=bogus-token')

    expect(await screen.findByText(/link has expired or already been used/i, undefined, { timeout: 5000 })).toBeInTheDocument()
    // Access was never granted: never navigated to the protected landing, events never rendered.
    expect(router.state.location.pathname).toBe('/auth/verify')
    expect(screen.queryByRole('heading', { name: 'Events' })).not.toBeInTheDocument()
  })
})
