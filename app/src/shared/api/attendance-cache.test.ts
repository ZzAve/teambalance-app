import { describe, expect, it } from 'vitest'
import type { AttendanceEntry, EventDetail } from './events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { QueryClient } from '@tanstack/react-query'
import { applyOptimisticAttendance, applyOptimisticAttendanceToCache } from './attendance-cache'
import { patchCachedEvents, rollBack } from './event-cache'

const attendee = (overrides: Partial<AttendanceEntry> = {}): AttendanceEntry => ({
  id: 'att-1',
  userId: 'user-1',
  displayName: 'Julius',
  role: 'Spelverdeler',
  state: 'ATTENDING',
  changedBy: undefined,
  updatedAt: undefined,
  photoVersion: undefined,
  ...overrides,
})

const makeEventDetail = (overrides: Partial<EventDetail> = {}): EventDetail => ({
  id: 'evt-1',
  eventType: { id: 'et-1', name: 'Training', color: '#249E6C' },
  title: 'Training',
  description: undefined,
  startTime: '2026-08-10T18:00:00Z',
  endTime: '2026-08-10T19:30:00Z',
  location: undefined,
  references: [],
  recurringGroup: undefined,
  attendanceSummary: {
    attending: 0,
    maybe: 0,
    absent: 0,
    notResponded: 0,
    roleBreakdown: [],
  },
  attendances: [],
  substitutes: [],
  // The viewer's own resolved response, mirroring the list payload.
  myState: 'NOT_RESPONDED',
  // Undefined = this event inherits its type's roster default.
  rosterOverride: undefined,
  roster: NO_ROSTER,
  ...overrides,
})

describe('applyOptimisticAttendance', () => {
  it("sets the current user's attendance entry to the new state", () => {
    const event = makeEventDetail({
      attendances: [
        attendee({ userId: 'user-1', state: 'ATTENDING' }),
        attendee({ id: 'att-2', userId: 'user-2', state: 'MAYBE' }),
      ],
    })

    const next = applyOptimisticAttendance(event, 'user-1', 'ABSENT', 'user-1')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendances.find((a) => a.userId === 'user-1')?.state).toBe('ABSENT')
    // Other attendees are untouched.
    expect(next.attendances.find((a) => a.userId === 'user-2')?.state).toBe('MAYBE')
  })

  it('is a no-op when the user has no entry (a first-time responder carries no row to patch)', () => {
    const event = makeEventDetail({
      attendances: [attendee({ userId: 'user-2', state: 'MAYBE' })],
    })

    const next = applyOptimisticAttendance(event, 'unknown-user', 'ATTENDING', 'user-1')
    if (!next) throw new Error('expected the event back unchanged')

    expect(next.attendances).toEqual(event.attendances)
  })

  it('does not mutate the original event or its attendance entry (immutable update)', () => {
    const original = makeEventDetail({
      attendances: [attendee({ userId: 'user-1', state: 'ATTENDING' })],
    })
    const originalEntry = original.attendances[0]

    const next = applyOptimisticAttendance(original, 'user-1', 'ABSENT', 'user-1')
    if (!next) throw new Error('expected a patched event')

    expect(next).not.toBe(original)
    expect(next.attendances).not.toBe(original.attendances)
    // The original entry object is left exactly as it was.
    expect(originalEntry.state).toBe('ATTENDING')
    expect(original.attendances[0].state).toBe('ATTENDING')
  })

  it('returns null unchanged (nothing cached yet)', () => {
    expect(applyOptimisticAttendance(undefined, 'user-1', 'ABSENT', 'user-1')).toBeUndefined()
  })

  // The Next Up hero shows the response and the headcount on one line, so the summary has to move
  // with the entry or it contradicts itself until the refetch lands.
  it('moves the summary counters with the entry', () => {
    const event = makeEventDetail({
      attendanceSummary: {
        attending: 10,
        maybe: 1,
        absent: 2,
        notResponded: 3,
        roleBreakdown: [{ role: 'Setter', attending: 2 }],
      },
      attendances: [attendee({ userId: 'user-1', state: 'NOT_RESPONDED' })],
    })

    const next = applyOptimisticAttendance(event, 'user-1', 'ATTENDING', 'user-1')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendanceSummary.attending).toBe(11)
    expect(next.attendanceSummary.notResponded).toBe(2)
    expect(next.attendanceSummary.maybe).toBe(1)
    expect(next.attendanceSummary.absent).toBe(2)
    // roleBreakdown is the server's to recompute; the optimistic patch leaves it alone.
    expect(next.attendanceSummary.roleBreakdown).toEqual(event.attendanceSummary.roleBreakdown)
    // And the original summary is untouched, so a rollback still restores the real counts.
    expect(event.attendanceSummary.attending).toBe(10)
  })

  it('leaves the counters alone when the state does not actually change', () => {
    const event = makeEventDetail({
      attendanceSummary: { attending: 4, maybe: 0, absent: 0, notResponded: 1, roleBreakdown: [] },
      attendances: [attendee({ userId: 'user-1', state: 'ATTENDING' })],
    })

    const next = applyOptimisticAttendance(event, 'user-1', 'ATTENDING', 'user-1')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendanceSummary.attending).toBe(4)
  })

  it('never drives a counter negative when the summary is already out of step', () => {
    const event = makeEventDetail({
      attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
      attendances: [attendee({ userId: 'user-1', state: 'ATTENDING' })],
    })

    const next = applyOptimisticAttendance(event, 'user-1', 'ABSENT', 'user-1')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendanceSummary.attending).toBe(0)
    expect(next.attendanceSummary.absent).toBe(1)
  })

  // The roster is server-authoritative (#219): its counts could be moved here, but openSlots/state
  // could not without re-implementing the layered status the backend owns, and a half-patched roster
  // is worse than a briefly stale one. Pinned so nobody "fixes" it into a second implementation.
  it('leaves the server-computed roster untouched rather than deriving a new one', () => {
    const roster = makeRoster({ totalAttending: 4, openSlots: 1, state: 'SPOTS_OPEN' })
    const event = makeEventDetail({
      roster,
      attendances: [attendee({ userId: 'u1', state: 'ABSENT' })],
      attendanceSummary: { attending: 4, maybe: 0, absent: 1, notResponded: 0, roleBreakdown: [] },
    })

    const next = applyOptimisticAttendance(event, 'u1', 'ATTENDING', 'u1')

    // The summary moved…
    expect(next?.attendanceSummary.attending).toBe(5)
    // …and the roster is carried through as-is, awaiting the server's recomputation.
    expect(next?.roster).toEqual(roster)
  })
  // ⑪: the row's attribution has to move with its state, or the "set by …" line contradicts the
  // answer next to it for a whole round-trip — most visibly on the detail page, where the line sits
  // directly under the control that just fired.
  it('stamps the acting user as the row\'s changedBy, clearing a teammate\'s stale attribution', () => {
    const event = makeEventDetail({
      attendances: [attendee({ userId: 'user-1', state: 'ABSENT', changedBy: 'user-tim' })],
    })

    const next = applyOptimisticAttendance(event, 'user-1', 'ATTENDING', 'user-1')

    expect(next?.attendances[0].changedBy).toBe('user-1')
  })

  it("stamps the actor, not the target, when setting a teammate's answer (ADR-0003)", () => {
    const event = makeEventDetail({
      attendances: [attendee({ userId: 'user-2', state: 'NOT_RESPONDED', changedBy: undefined })],
    })

    const next = applyOptimisticAttendance(event, 'user-2', 'ATTENDING', 'user-1')

    expect(next?.attendances[0].changedBy).toBe('user-1')
  })
})

describe('applyOptimisticAttendanceToCache', () => {
  const summary = { attending: 2, maybe: 0, absent: 0, notResponded: 1, roleBreakdown: [] }
  const roster = makeRoster({ totalAttending: 2, openSlots: 1, state: 'SPOTS_OPEN' })
  const evt = (id: string) =>
    makeEventDetail({
      id,
      roster,
      attendanceSummary: summary,
      attendances: [attendee({ userId: 'me', state: 'NOT_RESPONDED' })],
      myState: 'NOT_RESPONDED',
    })
  const answer = (cached: Parameters<typeof applyOptimisticAttendanceToCache>[0], eventId: string) =>
    applyOptimisticAttendanceToCache(cached, eventId, 'me', 'ATTENDING', 'me')

  it('patches the one event in a detail, a list and a raw { events } response, and no other', () => {
    const detail = answer(evt('a'), 'a') as EventDetail
    expect(detail.attendances[0].state).toBe('ATTENDING')

    const list = answer([evt('a'), evt('b')], 'b') as EventDetail[]
    expect(list[0].attendances[0].state).toBe('NOT_RESPONDED')
    expect(list[1].attendances[0].state).toBe('ATTENDING')

    const raw = answer({ events: [evt('a'), evt('b')] }, 'a') as { events: EventDetail[] }
    expect(raw.events[0].attendances[0].state).toBe('ATTENDING')
    expect(raw.events[1].attendances[0].state).toBe('NOT_RESPONDED')
  })

  it('moves the summary counters and the viewer\'s own answer, and leaves the roster alone', () => {
    const [patched] = answer([evt('a')], 'a') as EventDetail[]

    expect(patched.attendanceSummary).toMatchObject({ attending: 3, notResponded: 0 })
    expect(patched.myState).toBe('ATTENDING')
    expect(patched.roster).toBe(roster)
  })

  it("leaves myState alone when the answer is a teammate's", () => {
    const [patched] = applyOptimisticAttendanceToCache([evt('a')], 'a', 'me', 'ATTENDING', 'coach') as EventDetail[]

    expect(patched.myState).toBe('NOT_RESPONDED')
  })
})

describe('patchCachedEvents for attendance', () => {
  const LIST_KEY = ['events', { includePast: false }]
  const seeded = () => {
    const queryClient = new QueryClient()
    const base = (id: string) =>
      makeEventDetail({ id, attendances: [attendee({ userId: 'me', state: 'NOT_RESPONDED' })], myState: 'NOT_RESPONDED' })
    queryClient.setQueryData(LIST_KEY, { events: [base('a'), base('b')] })
    queryClient.setQueryData(['events', 'a'], base('a'))
    return queryClient
  }
  const tap = (queryClient: QueryClient, eventId: string) =>
    patchCachedEvents<Parameters<typeof applyOptimisticAttendanceToCache>[0]>(queryClient, (cached) =>
      applyOptimisticAttendanceToCache(cached, eventId, 'me', 'ATTENDING', 'me'),
    )
  const states = (queryClient: QueryClient) =>
    queryClient.getQueryData<{ events: EventDetail[] }>(LIST_KEY)?.events.map((e) => e.myState)

  it('keeps both answers when a second tap lands on another event', async () => {
    const queryClient = seeded()
    await tap(queryClient, 'a')
    await tap(queryClient, 'b')

    expect(states(queryClient)).toEqual(['ATTENDING', 'ATTENDING'])
    expect(queryClient.getQueryData<EventDetail>(['events', 'a'])?.myState).toBe('ATTENDING')
  })

  it('rolls the list and the detail back to the server value when the write fails', async () => {
    const queryClient = seeded()
    const context = await tap(queryClient, 'a')
    rollBack(queryClient, context)

    expect(states(queryClient)).toEqual(['NOT_RESPONDED', 'NOT_RESPONDED'])
    expect(queryClient.getQueryData<EventDetail>(['events', 'a'])?.myState).toBe('NOT_RESPONDED')
  })
})
