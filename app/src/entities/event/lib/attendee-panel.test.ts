import { describe, expect, it } from 'vitest'
import type { AttendanceEntry, EventDetail } from '@shared/api/events'
import { buildAttendeePanel } from './attendee-panel'

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
  attendanceSummary: {
    attending: 0,
    maybe: 0,
    absent: 0,
    notResponded: 0,
    roleBreakdown: [],
  },
  attendances: [],
  ...overrides,
})

describe('buildAttendeePanel', () => {
  it('counts and lists the sole attendee (the current user is not hidden from their own event)', () => {
    // Reproduces the reported bug: one person attending shows as "Going 0 / No one".
    const event = makeEventDetail({
      attendanceSummary: {
        attending: 1,
        maybe: 0,
        absent: 0,
        notResponded: 0,
        roleBreakdown: [{ role: 'Spelverdeler', attending: 1 }],
      },
      attendances: [attendee()],
    })

    const panel = buildAttendeePanel(event)

    expect(panel.ATTENDING.count).toBe(1)
    expect(panel.ATTENDING.attendees).toHaveLength(1)
    expect(panel.ATTENDING.attendees[0].displayName).toBe('Julius')
  })

  it('sources each tab count from the authoritative summary, not from the attendee list', () => {
    // Non-responders are counted in the summary but need not appear in `attendances`.
    const event = makeEventDetail({
      attendanceSummary: {
        attending: 1,
        maybe: 0,
        absent: 0,
        notResponded: 3,
        roleBreakdown: [{ role: 'Spelverdeler', attending: 1 }],
      },
      attendances: [attendee()],
    })

    const panel = buildAttendeePanel(event)

    expect(panel.NOT_RESPONDED.count).toBe(3)
    expect(panel.NOT_RESPONDED.attendees).toHaveLength(0)
  })

  it('groups attendees under their own state', () => {
    const event = makeEventDetail({
      attendanceSummary: {
        attending: 1,
        maybe: 1,
        absent: 1,
        notResponded: 0,
        roleBreakdown: [],
      },
      attendances: [
        attendee({ userId: 'a', displayName: 'Ann', state: 'ATTENDING' }),
        attendee({ userId: 'b', displayName: 'Bea', state: 'MAYBE' }),
        attendee({ userId: 'c', displayName: 'Cas', state: 'ABSENT' }),
      ],
    })

    const panel = buildAttendeePanel(event)

    expect(panel.MAYBE.attendees.map((a) => a.displayName)).toEqual(['Bea'])
    expect(panel.ABSENT.attendees.map((a) => a.displayName)).toEqual(['Cas'])
    expect(panel.ATTENDING.attendees.map((a) => a.displayName)).toEqual(['Ann'])
  })
})
