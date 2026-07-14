import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'
import type { AuthenticatedUser } from '@shared/api/auth'

// A stateful session, mirroring the browser MSW mock (shared/mocks/handlers.ts): verify
// establishes it, /me reflects it. The verify response is deliberately delayed relative to
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
  it('establishes the session and lands on events, without the guard bouncing back to login', async () => {
    const router = renderAppAt('/auth/verify?token=valid-token')

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(await screen.findByRole('heading', { name: 'Events' })).toBeInTheDocument()
    expect(screen.queryByText(/link expired/i)).not.toBeInTheDocument()
  })

  it('rejects an invalid token and keeps the guard from ever granting access', async () => {
    const router = renderAppAt('/auth/verify?token=bogus-token')

    expect(await screen.findByText(/link has expired or already been used/i)).toBeInTheDocument()
    // Access was never granted: never navigated to the protected landing, events never rendered.
    expect(router.state.location.pathname).toBe('/auth/verify')
    expect(screen.queryByRole('heading', { name: 'Events' })).not.toBeInTheDocument()
  })
})
