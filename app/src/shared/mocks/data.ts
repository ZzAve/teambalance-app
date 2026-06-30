export interface RoleCount {
  role: string
  attending: number
}

export interface MockEvent {
  id: string
  eventType: { id: string; name: string; color: string }
  title: string
  description: string | null
  startTime: string
  endTime: string | null
  location: string | null
  attendanceSummary: { attending: number; maybe: number; absent: number; notResponded: number; roleBreakdown: RoleCount[] }
  attendances: { id: string; userId: string; displayName: string; role: string; state: string }[]
}

export const EVENT_TYPES = [
  { id: 'et-001', name: 'Training', color: '#249E6C' },
  { id: 'et-002', name: 'Match', color: '#225C9C' },
  { id: 'et-003', name: 'Tournament', color: '#F4B400' },
  { id: 'et-004', name: 'Social', color: '#E87461' },
]

// Each member has exactly one role (set back-office in v1) — see ADR-0009.
export const MEMBERS = [
  { userId: 'b0000000-0000-0000-0000-000000000001', displayName: 'Jan de Vries', role: 'Setter' },
  { userId: 'b0000000-0000-0000-0000-000000000002', displayName: 'Lisa Bakker', role: 'Outside Hitter' },
  { userId: 'b0000000-0000-0000-0000-000000000003', displayName: 'Tom Visser', role: 'Middle Blocker' },
  { userId: 'b0000000-0000-0000-0000-000000000004', displayName: 'Emma Jansen', role: 'Libero' },
  { userId: 'b0000000-0000-0000-0000-000000000005', displayName: 'Daan Mulder', role: 'Opposite' },
  { userId: 'b0000000-0000-0000-0000-000000000006', displayName: 'Sophie van Dijk', role: 'Outside Hitter' },
]

export function computeRoleBreakdown(attendances: { role: string; state: string }[]): RoleCount[] {
  const counts: Record<string, number> = {}
  for (const a of attendances) {
    if (a.state === 'ATTENDING') counts[a.role] = (counts[a.role] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([role, attending]) => ({ role, attending }))
    .sort((a, b) => b.attending - a.attending || a.role.localeCompare(b.role))
}

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
    role: m.role,
    state: states[i] ?? 'NOT_RESPONDED',
  }))
}

function makeEvent(
  id: string,
  eventType: (typeof EVENT_TYPES)[number],
  title: string,
  description: string | null,
  startTime: string,
  location: string | null,
  states: string[],
): MockEvent {
  const attendances = makeAttendances(states)
  const attending = attendances.filter((a) => a.state === 'ATTENDING').length
  const maybe = attendances.filter((a) => a.state === 'MAYBE').length
  const absent = attendances.filter((a) => a.state === 'ABSENT').length
  const notResponded = attendances.filter((a) => a.state === 'NOT_RESPONDED').length
  return {
    id,
    eventType,
    title,
    description,
    startTime,
    endTime: null,
    location,
    attendanceSummary: { attending, maybe, absent, notResponded, roleBreakdown: computeRoleBreakdown(attendances) },
    attendances,
  }
}

export const EVENTS: MockEvent[] = [
  makeEvent('evt-001', EVENT_TYPES[0], 'Training', 'Regular Tuesday training session', daysFromNow(1), 'Sporthal De Boog', ['ATTENDING', 'ATTENDING', 'ATTENDING', 'MAYBE', 'ATTENDING', 'NOT_RESPONDED']),
  makeEvent('evt-002', EVENT_TYPES[1], 'League Match vs Smash United', 'Away game — carpool at 18:00 from parking lot', daysFromNow(4), 'Sportcentrum Zuid, Amsterdam', ['ATTENDING', 'ATTENDING', 'ABSENT', 'ATTENDING', 'ATTENDING', 'ATTENDING']),
  makeEvent('evt-003', EVENT_TYPES[0], 'Training', null, daysFromNow(8), 'Sporthal De Boog', ['ATTENDING', 'NOT_RESPONDED', 'MAYBE', 'ATTENDING', 'NOT_RESPONDED', 'MAYBE']),
  makeEvent('evt-004', EVENT_TYPES[2], 'Spring Tournament', 'Annual 4v4 beach tournament. Sign up by Wednesday!', daysFromNow(15), 'Beach Arena Scheveningen', ['ATTENDING', 'MAYBE', 'ATTENDING', 'NOT_RESPONDED', 'MAYBE', 'ATTENDING']),
  makeEvent('evt-005', EVENT_TYPES[3], 'Team BBQ', "End-of-season celebration at Jan's place", daysFromNow(22), "Jan's backyard", ['ATTENDING', 'ATTENDING', 'ATTENDING', 'ATTENDING', 'ATTENDING', 'ATTENDING']),
  // Nobody has responded yet — exercises the empty role-breakdown state (PRD user story 8).
  makeEvent('evt-006', EVENT_TYPES[0], 'Friendly (date TBC)', 'Awaiting responses', daysFromNow(2), 'Sporthal De Boog', ['NOT_RESPONDED', 'NOT_RESPONDED', 'NOT_RESPONDED', 'NOT_RESPONDED', 'NOT_RESPONDED', 'NOT_RESPONDED']),
  makeEvent('evt-past-001', EVENT_TYPES[0], 'Training (last week)', null, daysFromNow(-5), 'Sporthal De Boog', ['ATTENDING', 'ATTENDING', 'ATTENDING', 'ABSENT', 'ATTENDING', 'ATTENDING']),
]
