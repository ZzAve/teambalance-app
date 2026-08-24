import type { Event, EventRoster } from '@shared/api/events'
import type { EventTypeItem, RosterRequirement } from '@shared/api/event-types'

/** Roster tracking switched off — the default for a type nobody has configured. */
export const ROSTER_OFF: RosterRequirement = {
  trackRoster: false,
  totalTarget: undefined,
  positionTargets: [],
}

/**
 * A computed roster with tracking off — the shape the server sends for a social, and the default for
 * every fixture that isn't about the roster. The panel renders nothing for it.
 */
export const NO_ROSTER: EventRoster = {
  trackRoster: false,
  totalTarget: undefined,
  totalAttending: 0,
  positions: [],
  unassignedAttending: 0,
  openSlots: 0,
  state: 'OFF',
}

/**
 * A computed roster, defaulting to a tracked lineup that is one short — the state a roster story
 * usually wants a starting point for. Pass overrides to move it to any other state.
 */
export function makeRoster(overrides: Partial<EventRoster> = {}): EventRoster {
  return {
    trackRoster: true,
    totalTarget: undefined,
    totalAttending: 4,
    positions: [
      { id: 'pos-setter', label: 'Setter', required: 2, attending: 2 },
      { id: 'pos-libero', label: 'Libero', required: 1, attending: 1 },
      { id: 'pos-middle', label: 'Middle', required: 2, attending: 1 },
    ],
    unassignedAttending: 0,
    openSlots: 1,
    state: 'SPOTS_OPEN',
    ...overrides,
  }
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
    // The server-computed roster. Off by default so a fixture that is not about the roster renders
    // no panel; roster stories pass makeRoster().
    roster: NO_ROSTER,
    ...overrides,
  }
}
