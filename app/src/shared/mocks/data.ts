export interface MockEvent {
  id: string
  type: { id: string; name: string; color: string }
  title: string
  description: string | null
  startTime: string
  endTime: string | null
  location: string | null
  attendanceSummary: { attending: number; maybe: number; absent: number; notResponded: number }
  attendances: { id: string; userId: string; displayName: string; state: string }[]
}

export const EVENT_TYPES = [
  { id: 'et-001', name: 'Training', color: '#249E6C' },
  { id: 'et-002', name: 'Match', color: '#225C9C' },
  { id: 'et-003', name: 'Tournament', color: '#F4B400' },
  { id: 'et-004', name: 'Social', color: '#E87461' },
]

export const MEMBERS = [
  { userId: 'b0000000-0000-0000-0000-000000000001', displayName: 'Jan de Vries' },
  { userId: 'b0000000-0000-0000-0000-000000000002', displayName: 'Lisa Bakker' },
  { userId: 'b0000000-0000-0000-0000-000000000003', displayName: 'Tom Visser' },
  { userId: 'b0000000-0000-0000-0000-000000000004', displayName: 'Emma Jansen' },
  { userId: 'b0000000-0000-0000-0000-000000000005', displayName: 'Daan Mulder' },
  { userId: 'b0000000-0000-0000-0000-000000000006', displayName: 'Sophie van Dijk' },
]

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(20, 0, 0, 0)
  return d.toISOString()
}

function makeAttendances(states: string[]) {
  return MEMBERS.map((m, i) => ({
    id: `att-${m.userId}`,
    userId: m.userId,
    displayName: m.displayName,
    state: states[i] ?? 'NOT_RESPONDED',
  }))
}

export const EVENTS: MockEvent[] = [
  {
    id: 'evt-001',
    type: EVENT_TYPES[0],
    title: 'Training',
    description: 'Regular Tuesday training session',
    startTime: daysFromNow(1),
    endTime: null,
    location: 'Sporthal De Boog',
    attendanceSummary: { attending: 4, maybe: 1, absent: 0, notResponded: 1 },
    attendances: makeAttendances(['ATTENDING', 'ATTENDING', 'ATTENDING', 'MAYBE', 'ATTENDING', 'NOT_RESPONDED']),
  },
  {
    id: 'evt-002',
    type: EVENT_TYPES[1],
    title: 'League Match vs Smash United',
    description: 'Away game — carpool at 18:00 from parking lot',
    startTime: daysFromNow(4),
    endTime: null,
    location: 'Sportcentrum Zuid, Amsterdam',
    attendanceSummary: { attending: 5, maybe: 0, absent: 1, notResponded: 0 },
    attendances: makeAttendances(['ATTENDING', 'ATTENDING', 'ABSENT', 'ATTENDING', 'ATTENDING', 'ATTENDING']),
  },
  {
    id: 'evt-003',
    type: EVENT_TYPES[0],
    title: 'Training',
    description: null,
    startTime: daysFromNow(8),
    endTime: null,
    location: 'Sporthal De Boog',
    attendanceSummary: { attending: 2, maybe: 2, absent: 0, notResponded: 2 },
    attendances: makeAttendances(['ATTENDING', 'NOT_RESPONDED', 'MAYBE', 'ATTENDING', 'NOT_RESPONDED', 'MAYBE']),
  },
  {
    id: 'evt-004',
    type: EVENT_TYPES[2],
    title: 'Spring Tournament',
    description: 'Annual 4v4 beach tournament. Sign up by Wednesday!',
    startTime: daysFromNow(15),
    endTime: null,
    location: 'Beach Arena Scheveningen',
    attendanceSummary: { attending: 3, maybe: 2, absent: 0, notResponded: 1 },
    attendances: makeAttendances(['ATTENDING', 'MAYBE', 'ATTENDING', 'NOT_RESPONDED', 'MAYBE', 'ATTENDING']),
  },
  {
    id: 'evt-005',
    type: EVENT_TYPES[3],
    title: 'Team BBQ',
    description: 'End-of-season celebration at Jan\'s place',
    startTime: daysFromNow(22),
    endTime: null,
    location: 'Jan\'s backyard',
    attendanceSummary: { attending: 6, maybe: 0, absent: 0, notResponded: 0 },
    attendances: makeAttendances(['ATTENDING', 'ATTENDING', 'ATTENDING', 'ATTENDING', 'ATTENDING', 'ATTENDING']),
  },
  {
    id: 'evt-past-001',
    type: EVENT_TYPES[0],
    title: 'Training (last week)',
    description: null,
    startTime: daysFromNow(-5),
    endTime: null,
    location: 'Sporthal De Boog',
    attendanceSummary: { attending: 5, maybe: 0, absent: 1, notResponded: 0 },
    attendances: makeAttendances(['ATTENDING', 'ATTENDING', 'ATTENDING', 'ABSENT', 'ATTENDING', 'ATTENDING']),
  },
]
