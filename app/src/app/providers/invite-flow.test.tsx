import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'
import type { AuthenticatedUser } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'

// Mirrors verify-flow.test.tsx's stateful-session approach, plus a stateful invitation so accept
// can be proven idempotent/rejecting without touching the real backend.
let session: AuthenticatedUser | null = null
let accepted = false

const USER: AuthenticatedUser = {
  id: 'user-1',
  email: 'newbie@example.com',
  displayName: 'newbie',
  role: undefined,
}

const server = setupServer(
  http.post('/api/auth/magic-link/request', () => new HttpResponse(null, { status: 202 })),
  http.post('/api/auth/magic-link/verify', async ({ request }) => {
    const body = (await request.json()) as { token: string }
    if (body.token !== 'valid-token') return new HttpResponse(null, { status: 401 })
    await delay(10)
    session = USER
    return HttpResponse.json(USER)
  }),
  http.get('/api/auth/me', () => (session ? HttpResponse.json(session) : new HttpResponse(null, { status: 401 }))),
  // The root onboarding gate reads /members/me; an onboarded member skips /welcome and lands on
  // events, keeping this test focused on the invite/accept seam.
  http.get('/api/members/me', () =>
    HttpResponse.json({ userId: 'user-1', displayName: 'newbie', role: 'USER', onboarded: true }),
  ),
  http.post('/api/invitations/:token/accept', ({ params }) => {
    if (params.token !== 'valid-invite-token') return new HttpResponse(null, { status: 404 })
    accepted = true
    return HttpResponse.json({ teamId: 'team-1' })
  }),
  http.get('/api/events', () => HttpResponse.json({ events: [] })),
  http.get('/api/event-types', () => HttpResponse.json({ eventTypes: [] })),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  session = null
  accepted = false
  localStorage.clear()
  // The app's queryClient (30s staleTime) is a shared singleton — without clearing it, a later
  // test's fresh render would read a previous test's cached ['auth','me'] value instead of
  // actually hitting the mock, since the cache doesn't know the mock session was reset above.
  queryClient.clear()
})
afterAll(() => server.close())

function renderAppAt(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) })
  render(<RouterProvider router={router} />)
  return router
}

describe('invite acceptance', () => {
  it('an already-authenticated visitor accepts immediately and lands on team events', async () => {
    session = USER
    const router = renderAppAt('/invite/valid-invite-token')

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(await screen.findByRole('heading', { name: 'Events' })).toBeInTheDocument()
    expect(accepted).toBe(true)
  })

  it('an invalid invite token shows an error instead of joining', async () => {
    session = USER
    renderAppAt('/invite/bogus-token')

    expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument()
    expect(accepted).toBe(false)
  })

  it('an unauthenticated visitor requests a magic link, then joins once verified', async () => {
    renderAppAt('/invite/valid-invite-token')

    const emailInput = await screen.findByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'newbie@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send magic link/i }))

    expect(await screen.findByText(/check your email/i)).toBeInTheDocument()

    // Simulate clicking the emailed link: a fresh router mount at /auth/verify, same page context
    // (localStorage survives), so the pending invite token saved on submit is still there.
    const verifyRouter = renderAppAt('/auth/verify?token=valid-token')

    await waitFor(() => expect(verifyRouter.state.location.pathname).toBe('/'))
    expect(await screen.findAllByRole('heading', { name: 'Events' })).not.toHaveLength(0)
    expect(accepted).toBe(true)
    expect(localStorage.getItem('tb-pending-invite-token')).toBeNull()
  })
})
