import { http, HttpResponse, delay } from 'msw'
import { EVENTS, EVENT_TYPES, MEMBERS, computeRoleBreakdown, type MockEvent } from './data'
import type { AuthenticatedUser } from '../api/auth'

// Mutable copy so mutations persist during the session
const events = structuredClone(EVENTS)

// Mock session state — a distinct identity (not a roster member) so it doesn't get pulled out
// of any event's attendee list as the "current user". Starts authenticated so existing dev/e2e
// flows that skip the login screen keep working; logout/verify flip it, letting the auth guard
// actually be exercised under MSW.
const DEFAULT_SESSION_USER: AuthenticatedUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'you@example.com',
  displayName: 'You',
  role: undefined,
}
let session: AuthenticatedUser | null = DEFAULT_SESSION_USER

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
      session = {
        id: MEMBERS[0].userId,
        email: 'you@example.com',
        displayName: MEMBERS[0].displayName,
        role: 'ADMIN',
      }
      return HttpResponse.json(session)
    }
    return new HttpResponse(null, { status: 401 })
  }),

  // GET /api/auth/me — reflects mock session state so the auth guard (redirect when logged out,
  // hydrate when logged in) can actually be exercised under MSW, not just against the real backend.
  http.get('/api/auth/me', async () => {
    await delay(100)
    if (!session) return new HttpResponse(null, { status: 401 })
    return HttpResponse.json(session)
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async () => {
    await delay(100)
    session = null
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
]
