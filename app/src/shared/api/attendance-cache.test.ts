import { describe, expect, it } from 'vitest'
import type { AttendanceEntry, EventDetail } from './events'
import { applyOptimisticAttendance } from './attendance-cache'

const attendee = (overrides: Partial<AttendanceEntry> = {}): AttendanceEntry => ({
  id: 'att-1',
  userId: 'user-1',
  displayName: 'Julius',
  role: 'Spelverdeler',
  state: 'ATTENDING',
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
  // The viewer's own resolved response, mirroring the list payload.
  myState: 'NOT_RESPONDED',
  // Undefined = this event inherits its type's roster default.
  rosterOverride: undefined,
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

    const next = applyOptimisticAttendance(event, 'user-1', 'ABSENT')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendances.find((a) => a.userId === 'user-1')?.state).toBe('ABSENT')
    // Other attendees are untouched.
    expect(next.attendances.find((a) => a.userId === 'user-2')?.state).toBe('MAYBE')
  })

  it('is a no-op when the user has no entry (a first-time responder carries no row to patch)', () => {
    const event = makeEventDetail({
      attendances: [attendee({ userId: 'user-2', state: 'MAYBE' })],
    })

    const next = applyOptimisticAttendance(event, 'unknown-user', 'ATTENDING')
    if (!next) throw new Error('expected the event back unchanged')

    expect(next.attendances).toEqual(event.attendances)
  })

  it('does not mutate the original event or its attendance entry (immutable update)', () => {
    const original = makeEventDetail({
      attendances: [attendee({ userId: 'user-1', state: 'ATTENDING' })],
    })
    const originalEntry = original.attendances[0]

    const next = applyOptimisticAttendance(original, 'user-1', 'ABSENT')
    if (!next) throw new Error('expected a patched event')

    expect(next).not.toBe(original)
    expect(next.attendances).not.toBe(original.attendances)
    // The original entry object is left exactly as it was.
    expect(originalEntry.state).toBe('ATTENDING')
    expect(original.attendances[0].state).toBe('ATTENDING')
  })

  it('returns null unchanged (nothing cached yet)', () => {
    expect(applyOptimisticAttendance(undefined, 'user-1', 'ABSENT')).toBeUndefined()
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

    const next = applyOptimisticAttendance(event, 'user-1', 'ATTENDING')
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

    const next = applyOptimisticAttendance(event, 'user-1', 'ATTENDING')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendanceSummary.attending).toBe(4)
  })

  it('never drives a counter negative when the summary is already out of step', () => {
    const event = makeEventDetail({
      attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
      attendances: [attendee({ userId: 'user-1', state: 'ATTENDING' })],
    })

    const next = applyOptimisticAttendance(event, 'user-1', 'ABSENT')
    if (!next) throw new Error('expected a patched event')

    expect(next.attendanceSummary.attending).toBe(0)
    expect(next.attendanceSummary.absent).toBe(1)
  })
})
