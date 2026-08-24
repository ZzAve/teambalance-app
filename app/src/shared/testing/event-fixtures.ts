import type { Event } from '@shared/api/events'
import type { EventTypeItem } from '@shared/api/event-types'
import type { RosterRequirement } from '@shared/api/event-types'

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
    references: [],
    recurringGroup: undefined,
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
    // The viewer's own response. Defaults to a blank, which is the state Bulk Attend acts on.
    myState: 'NOT_RESPONDED',
    // Undefined means this event inherits its type's roster default, which is the common case.
    rosterOverride: undefined,
    ...overrides,
  }
}

/** Roster tracking switched off — the default for a type nobody has configured. */
export const ROSTER_OFF: RosterRequirement = {
  trackRoster: false,
  totalTarget: undefined,
  positionTargets: [],
}

/**
 * Canonical EventTypeItem fixture, the sibling of [makeEvent]: one place to update when the
 * generated event-type contract changes, instead of the inline literals every picker story used to
 * carry.
 */
export function makeEventType(overrides: Partial<EventTypeItem> = {}): EventTypeItem {
  return {
    id: 'et-1',
    name: 'Training',
    color: '#249E6C',
    archived: false,
    rosterDefault: ROSTER_OFF,
    ...overrides,
  }
}
