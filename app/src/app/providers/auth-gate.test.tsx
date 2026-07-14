import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'
import type { AuthenticatedUser } from '@shared/api/auth'

// The guard is a true render gate: a protected route must not mount (and therefore must not
// fetch protected data) until the session is confirmed. An unconfirmed session — a 401 probe OR
// any /me error — fails closed to the login screen.

const USER: AuthenticatedUser = { id: 'user-1', email: 'jan@example.com', displayName: 'Jan', role: 'USER' }

let meStatus = 401
let eventsFetched = false

const server = setupServer(
  http.get('/api/auth/me', () =>
    meStatus === 200 ? HttpResponse.json(USER) : new HttpResponse(null, { status: meStatus }),
  ),
  http.get('/api/events', () => {
    eventsFetched = true
    return HttpResponse.json({ events: [] })
  }),
  http.get('/api/event-types', () => HttpResponse.json({ eventTypes: [] })),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  meStatus = 401
  eventsFetched = false
})
afterAll(() => server.close())

function renderAppAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) })
  render(<RouterProvider router={router} />)
  return router
}

describe('auth gate', () => {
  it('redirects an unauthenticated visitor to login without mounting the protected route', async () => {
    meStatus = 401
    const router = renderAppAt('/')

    await waitFor(() => expect(router.state.location.pathname).toBe('/login'), { timeout: 5000 })
    await waitFor(() => expect(screen.getByText(/no password/i)).toBeInTheDocument(), { timeout: 5000 })
    // Gated: the events route never mounted, so its protected data fetch never fired.
    expect(eventsFetched).toBe(false)
    expect(screen.queryByRole('heading', { name: 'Events' })).not.toBeInTheDocument()
  })

  it('fails closed: a non-401 /me error also redirects to login and never mounts the route', async () => {
    meStatus = 500
    const router = renderAppAt('/')

    await waitFor(() => expect(router.state.location.pathname).toBe('/login'), { timeout: 5000 })
    expect(eventsFetched).toBe(false)
    expect(screen.queryByRole('heading', { name: 'Events' })).not.toBeInTheDocument()
  })
})
