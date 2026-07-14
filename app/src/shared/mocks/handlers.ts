import { http, HttpResponse, delay } from 'msw'
import { EVENTS, EVENT_TYPES, MEMBERS, computeRoleBreakdown, type MockEvent } from './data'
import type { AuthenticatedUser } from '../api/auth'

// Mutable copy so mutations persist during the session
const events = structuredClone(EVENTS)

// The one mock identity a login establishes — a distinct identity (not a roster member) so it
// doesn't get pulled out of any event's attendee list as the "current user"; ADMIN so admin-gated
// UI is exercisable. Used by both verify and /me, so there's a single source of truth.
const MOCK_USER: AuthenticatedUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'you@example.com',
  displayName: 'You',
  role: 'ADMIN',
}

// Session is persisted in sessionStorage so it survives page reloads (like a real session cookie),
// letting e2e navigate with hard loads after logging in. It boots UNAUTHENTICATED — a fresh visit
// hits the login screen, mirroring the real app — until verify establishes it. logout clears it.
const SESSION_KEY = 'tb-mock-session'
function readSession(): AuthenticatedUser | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as AuthenticatedUser) : null
}
function writeSession(user: AuthenticatedUser | null): void {
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else sessionStorage.removeItem(SESSION_KEY)
}

function toSummary(event: MockEvent) {
  return {
    id: event.id,
    eventType: event.eventType,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    attendanceSummary: event.attendanceSummary,
  }
}

export const handlers = [
  // GET /api/events
  http.get('/api/events', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const includePast = url.searchParams.get('include-past') === 'true'
    const now = new Date().toISOString()

    const filtered = includePast
      ? events
      : events.filter((e) => e.startTime > now)

    return HttpResponse.json({
      events: filtered.map(toSummary),
    })
  }),

  // GET /api/events/:id
  http.get('/api/events/:id', async ({ params }) => {
    await delay(150)
    const event = events.find((e) => e.id === params.id)
    if (!event) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(event)
  }),

  // POST /api/events
  http.post('/api/events', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as {
      eventTypeId: string
      title: string
      description?: string
      startTime: string
      endTime?: string
      location?: string
    }

    const eventType = EVENT_TYPES.find((t) => t.id === body.eventTypeId) ?? EVENT_TYPES[0]
    const newEvent = {
      id: `evt-${Date.now()}`,
      eventType: eventType,
      title: body.title,
      description: body.description ?? null,
      startTime: body.startTime,
      endTime: body.endTime ?? null,
      location: body.location ?? null,
      attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: MEMBERS.length, roleBreakdown: [] },
      attendances: MEMBERS.map((m) => ({
        id: `att-${m.userId}`,
        userId: m.userId,
        displayName: m.displayName,
        role: m.role,
        state: 'NOT_RESPONDED',
      })),
    }
    events.unshift(newEvent)

    return HttpResponse.json(toSummary(newEvent), { status: 201 })
  }),

  // PUT /api/events/:eventId/attendances/:userId
  http.put('/api/events/:eventId/attendances/:userId', async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as { state: string }
    const event = events.find((e) => e.id === params.eventId)
    if (!event) return new HttpResponse(null, { status: 404 })

    const attendance = event.attendances.find((a) => a.userId === params.userId)
    if (!attendance) return new HttpResponse(null, { status: 404 })

    const oldState = attendance.state
    attendance.state = body.state

    // Update summary counts
    const decrement = (state: string) => {
      if (state === 'ATTENDING') event.attendanceSummary.attending--
      else if (state === 'MAYBE') event.attendanceSummary.maybe--
      else if (state === 'ABSENT') event.attendanceSummary.absent--
      else event.attendanceSummary.notResponded--
    }
    const increment = (state: string) => {
      if (state === 'ATTENDING') event.attendanceSummary.attending++
      else if (state === 'MAYBE') event.attendanceSummary.maybe++
      else if (state === 'ABSENT') event.attendanceSummary.absent++
      else event.attendanceSummary.notResponded++
    }
    decrement(oldState)
    increment(body.state)
    event.attendanceSummary.roleBreakdown = computeRoleBreakdown(event.attendances)

    return HttpResponse.json({
      id: attendance.id,
      eventId: params.eventId,
      userId: attendance.userId,
      displayName: attendance.displayName,
      role: attendance.role,
      state: attendance.state,
    })
  }),

  // GET /api/event-types
  http.get('/api/event-types', async () => {
    await delay(100)
    return HttpResponse.json({ eventTypes: EVENT_TYPES })
  }),

  // POST /api/auth/magic-link/request
  http.post('/api/auth/magic-link/request', async () => {
    await delay(300)
    return new HttpResponse(null, { status: 202 })
  }),

  // POST /api/auth/magic-link/verify
  http.post('/api/auth/magic-link/verify', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as { token: string }
    if (body.token === 'valid-token') {
      writeSession(MOCK_USER)
      return HttpResponse.json(MOCK_USER)
    }
    return new HttpResponse(null, { status: 401 })
  }),

  // GET /api/auth/me — reflects the persisted mock session so the auth guard (redirect when logged
  // out, hydrate when logged in) is exercised under MSW, not just against the real backend.
  http.get('/api/auth/me', async () => {
    await delay(100)
    const session = readSession()
    if (!session) return new HttpResponse(null, { status: 401 })
    return HttpResponse.json(session)
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async () => {
    await delay(100)
    writeSession(null)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/invitations
  http.post('/api/invitations', async () => {
    await delay(300)
    return HttpResponse.json(
      {
        token: 'mock-invite-token',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { status: 201 },
    )
  }),

  // POST /api/invitations/:token/accept
  http.post('/api/invitations/:token/accept', async ({ params }) => {
    await delay(300)
    if (params.token !== 'mock-invite-token') return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ teamId: '11111111-2222-3333-4444-555555555555' })
  }),
]
