import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'
import { WakingSplash } from '@shared/ui/ColdStartSplash'
import { RouteErrorFallback } from '@shared/ui/RouteErrorFallback'
import { queryClient } from '@shared/api/query-client'
import type { AuthenticatedUser } from '@shared/api/auth'

// The guard is a true render gate: a protected route must not mount (and therefore must not
// fetch protected data) until the session is confirmed. It distinguishes the two ways a session
// fails to confirm:
//   • a *clean* 401 (backend reachable, not signed in) → redirect to /login;
//   • a *backend error* (network / 5xx while the scale-to-zero container is still waking) → the
//     router's themed error fallback (Retry reloads), NOT /login. Redirecting to /login there
//     would log out a still-valid session, and — because the errored /me query stayed in cache
//     while the layout mounted — used to crash the initial render into a blank screen.
// Either way it fails closed: the protected route never mounts and its data never fetches.

const TEAM = { id: 'team-1', name: 'Setpoint VT', slug: 'setpoint-vt' }

const USER: AuthenticatedUser = {
  id: 'user-1',
  email: 'jan@example.com',
  displayName: 'Jan',
  role: 'USER',
  // A confirmed Member with an Active Team, so this stays focused on the auth-confirmation seam.
  teams: [TEAM],
  activeTeam: TEAM,
  isPlatformAdmin: false,
  actAs: undefined,
}

let meStatus = 401
// A 200 with an empty (0-byte) body — what a cold/misbehaving backend can send. The wirespec client
// surfaces it as an undefined user, which must be treated as unconfirmed, not signed-out.
let meEmptyBody = false
let eventsFetched = false

const server = setupServer(
  http.get('/api/auth/me', () => {
    if (meEmptyBody) return new HttpResponse('', { status: 200 })
    return meStatus === 200 ? HttpResponse.json(USER) : new HttpResponse(null, { status: meStatus })
  }),
  http.get('/api/events', () => {
    eventsFetched = true
    return HttpResponse.json({ events: [] })
  }),
  http.get('/api/event-types', () => HttpResponse.json({ eventTypes: [] })),
)

beforeAll(() => server.listen())
beforeEach(() => {
  // The guard reads the shared query client, so the ['auth','me'] result must not leak between
  // tests (a cached null from one case would skip the next case's probe). Also pin retry off for
  // this seam: the retry/backoff timing is exercised in retry-policy.test.ts; here we only assert
  // how the guard reacts to the settled outcome, and real backoff would make the test slow + flaky.
  queryClient.clear()
  queryClient.setQueryDefaults(['auth', 'me'], { retry: false })
})
afterEach(() => {
  server.resetHandlers()
  meStatus = 401
  meEmptyBody = false
  eventsFetched = false
  queryClient.clear()
  queryClient.setQueryDefaults(['auth', 'me'], {})
})
afterAll(() => server.close())

// Mirror the real router config from app/index.tsx so the gate is exercised with the same pending
// and error components the app ships — the error fallback in particular is what a probe failure
// must render instead of a blank frame.
function renderAppAt(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    defaultPendingComponent: WakingSplash,
    defaultErrorComponent: () => <RouteErrorFallback onRetry={() => {}} />,
  })
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

  it('fails closed on a non-401 /me error to the error fallback — not /login, never mounts the route', async () => {
    meStatus = 500
    const router = renderAppAt('/')

    // The themed retry fallback, not a blank frame and not the login screen: a cold-start backend
    // error must not be mistaken for "signed out".
    await waitFor(() => expect(screen.getByText(/couldn't load this page/i)).toBeInTheDocument(), {
      timeout: 5000,
    })
    expect(router.state.location.pathname).not.toBe('/login')
    // Still gated: the protected route never mounted, so its data fetch never fired.
    expect(eventsFetched).toBe(false)
    expect(screen.queryByRole('heading', { name: 'Events' })).not.toBeInTheDocument()
  })

  it('treats an empty (0-byte) 200 /me as unconfirmed → error fallback, not a signed-out /login', async () => {
    // A cold/misbehaving backend answering the probe with an empty body is not "signed out": it must
    // not bounce a valid session to /login (nor, historically, blank the screen), so it lands on the
    // same retry fallback as a 5xx.
    meEmptyBody = true
    const router = renderAppAt('/')

    await waitFor(() => expect(screen.getByText(/couldn't load this page/i)).toBeInTheDocument(), {
      timeout: 5000,
    })
    expect(router.state.location.pathname).not.toBe('/login')
    expect(eventsFetched).toBe(false)
    expect(screen.queryByRole('heading', { name: 'Events' })).not.toBeInTheDocument()
  })
})
