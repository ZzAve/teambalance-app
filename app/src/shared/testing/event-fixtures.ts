import type { Event } from '@shared/api/events'

/**
 * Canonical Event fixture for stories. One place to update when the generated Event contract
 * changes. Pass overrides to vary a story (attendanceSummary is replaced wholesale, not merged).
 */
export function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 'evt-002',
    eventType: { id: 'et-1', name: 'Match', color: '#3b82f6' },
    title: 'League Match vs Smash United',
    description: undefined,
    startTime: '2026-07-01T18:00:00+02:00',
    endTime: '2026-07-01T20:00:00+02:00',
    location: undefined,
    attendanceSummary: {
      attending: 5,
      maybe: 1,
      absent: 0,
      notResponded: 2,
      roleBreakdown: [
        { role: 'Outside Hitter', attending: 2 },
        { role: 'Libero', attending: 1 },
        { role: 'Opposite', attending: 1 },
        { role: 'Setter', attending: 1 },
      ],
    },
    ...overrides,
  }
}
