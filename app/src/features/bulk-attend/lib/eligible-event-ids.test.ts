import { describe, expect, it } from 'vitest'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { makeEvent } from '@shared/testing/event-fixtures'
import { ALL_ATTENDANCE_STATES } from '@features/filter-event-types/model/attendance-states'
import { filterEvents } from '@features/filter-event-types/model/filter-events'
import { eligibleEventIds } from './eligible-event-ids'

// "Now" is fixed so the future/past split is decided by the fixtures, never by the wall clock.
const NOW = new Date('2026-06-01T12:00:00Z')
const FUTURE = '2026-07-01T18:00:00Z'
const PAST = '2026-05-01T18:00:00Z'

const TRAINING = { id: 'et-training', name: 'Training', color: '#22c55e' }
const MATCH = { id: 'et-match', name: 'Match', color: '#3b82f6' }

const ALL_TYPES = new Set([TRAINING.id, MATCH.id])

describe('eligibleEventIds', () => {
  it('returns nothing when there are no events', () => {
    expect(eligibleEventIds([], ALL_TYPES, NOW)).toEqual([])
  })

  it('returns nothing while the events query is still undefined', () => {
    expect(eligibleEventIds(undefined, ALL_TYPES, NOW)).toEqual([])
  })

  it('returns nothing when every shown event is already answered', () => {
    const events = [
      makeEvent({ id: 'a', eventType: TRAINING, startTime: FUTURE, myState: 'ATTENDING' }),
      makeEvent({ id: 'b', eventType: TRAINING, startTime: FUTURE, myState: 'ABSENT' }),
      makeEvent({ id: 'c', eventType: MATCH, startTime: FUTURE, myState: 'MAYBE' }),
    ]
    expect(eligibleEventIds(events, ALL_TYPES, NOW)).toEqual([])
  })

  it('picks only the unanswered events out of a mixed list', () => {
    const events = [
      makeEvent({ id: 'answered', eventType: TRAINING, startTime: FUTURE, myState: 'ATTENDING' }),
      makeEvent({ id: 'blank-1', eventType: TRAINING, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
      // A deliberate Absent is a real answer and must never be swept up.
      makeEvent({ id: 'absent', eventType: MATCH, startTime: FUTURE, myState: 'ABSENT' }),
      makeEvent({ id: 'blank-2', eventType: MATCH, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
    ]
    expect(eligibleEventIds(events, ALL_TYPES, NOW)).toEqual(['blank-1', 'blank-2'])
  })

  it('excludes events that have already started', () => {
    const events = [
      makeEvent({ id: 'past', eventType: TRAINING, startTime: PAST, myState: 'NOT_RESPONDED' }),
      makeEvent({ id: 'future', eventType: TRAINING, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
    ]
    expect(eligibleEventIds(events, ALL_TYPES, NOW)).toEqual(['future'])
  })

  it('includes an event starting exactly now, matching the server guard', () => {
    const events = [
      makeEvent({ id: 'now', eventType: TRAINING, startTime: NOW.toISOString(), myState: 'NOT_RESPONDED' }),
    ]
    expect(eligibleEventIds(events, ALL_TYPES, NOW)).toEqual(['now'])
  })

  it('narrows to the filtered subset when only some type pills are active', () => {
    const events = [
      makeEvent({ id: 'training', eventType: TRAINING, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
      makeEvent({ id: 'match', eventType: MATCH, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
    ]
    // Filter to Training, Bulk Attend only the trainings (ADR-0020: the pills are the selector).
    expect(eligibleEventIds(events, new Set([TRAINING.id]), NOW)).toEqual(['training'])
  })

  it('returns nothing when no type pill is active', () => {
    const events = [
      makeEvent({ id: 'training', eventType: TRAINING, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
    ]
    expect(eligibleEventIds(events, new Set(), NOW)).toEqual([])
  })
})

// Bulk Attend covers exactly what is on screen (ADR-0020 decision 5, restated by ADR-0029 §6), so
// the answer chips narrow it like the type chips do. The consequence is not a bug and must not be
// "fixed" by exempting Bulk Attend from this dimension: filtering to an answered status leaves the
// bar with nothing to act on, and the reason is on screen — the visible list holds nothing
// unanswered. The converse is the useful half: `Not responded` *is* the bar's preview.
describe('eligibleEventIds under the answer filter', () => {
  const ALL_STATES = new Set<AttendanceState>(ALL_ATTENDANCE_STATES)
  const EVENTS = [
    makeEvent({ id: 'blank', eventType: TRAINING, startTime: FUTURE, myState: 'NOT_RESPONDED' }),
    makeEvent({ id: 'going', eventType: TRAINING, startTime: FUTURE, myState: 'ATTENDING' }),
  ]
  const shown = (activeStates: Set<AttendanceState>) =>
    eligibleEventIds(filterEvents(EVENTS, ALL_TYPES, activeStates), ALL_TYPES, NOW)

  it('offers the unanswered events when no answer chip narrows the list', () => {
    expect(shown(ALL_STATES)).toEqual(['blank'])
  })

  it('offers nothing at all when the list is filtered to an answered status', () => {
    expect(shown(new Set<AttendanceState>(['ATTENDING']))).toEqual([])
    expect(shown(new Set<AttendanceState>(['MAYBE', 'ABSENT']))).toEqual([])
  })

  it('offers exactly the visible list when filtered to Not responded — the bar\'s preview', () => {
    expect(shown(new Set<AttendanceState>(['NOT_RESPONDED']))).toEqual(['blank'])
  })
})
