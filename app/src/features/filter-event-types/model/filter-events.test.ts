import {describe, expect, it} from 'vitest'
import type {AttendanceState} from '@features/attendance-toggle/ui/AttendanceToggle'
import type {RosterState} from '@shared/api/events'
import {makeEvent, makeRoster} from '@shared/testing/event-fixtures'
import {ALL_ATTENDANCE_STATES} from './attendance-states'
import {ALL_TURNOUT_BUCKETS, type TurnoutBucket} from './turnout'
import {filterEvents} from './filter-events'

const TYPE_IDS = ['training', 'match']
const ALL_TYPES = new Set(TYPE_IDS)
const ALL_STATES = new Set<AttendanceState>(ALL_ATTENDANCE_STATES)
const ALL_TURNOUTS = new Set<TurnoutBucket>(ALL_TURNOUT_BUCKETS)

const event = (id: string, typeId: string, myState: AttendanceState, state: RosterState = 'OFF') =>
    makeEvent({
        id,
        myState,
        eventType: {id: typeId, name: typeId, color: '#000'},
        roster: makeRoster({state, positions: [], openSlots: 0}),
    })

const EVENTS = [
    event('going-training', 'training', 'ATTENDING', 'CRITICAL'),
    event('blank-training', 'training', 'NOT_RESPONDED', 'HEADCOUNT_SHORT'),
    event('maybe-match', 'match', 'MAYBE', 'LINEUP_SET'),
    event('absent-match', 'match', 'ABSENT', 'TALLY_ONLY'),
]

const ids = (events: ReturnType<typeof event>[]) => events.map(e => e.id)

describe('filterEvents', () => {
    it('drops nothing when every chip in all three groups is on', () => {
        expect(ids(filterEvents(EVENTS, ALL_TYPES, ALL_STATES, ALL_TURNOUTS))).toEqual(ids(EVENTS))
    })

    it('ORs within the answer dimension', () => {
        const result = filterEvents(EVENTS, ALL_TYPES, new Set<AttendanceState>(['MAYBE', 'ABSENT']), ALL_TURNOUTS)
        expect(ids(result)).toEqual(['maybe-match', 'absent-match'])
    })

    it('ORs within the type dimension', () => {
        const result = filterEvents(EVENTS, new Set(['training']), ALL_STATES, ALL_TURNOUTS)
        expect(ids(result)).toEqual(['going-training', 'blank-training'])
    })

    it('ORs within the turnout dimension, over states that share a band', () => {
        const result = filterEvents(EVENTS, ALL_TYPES, ALL_STATES,
            new Set<TurnoutBucket>(['missing-position', 'spots-open']))
        expect(ids(result)).toEqual(['going-training', 'blank-training'])
    })

    it('ANDs across the two dimensions', () => {
        const result = filterEvents(EVENTS, new Set(['training']), new Set<AttendanceState>(['NOT_RESPONDED']), ALL_TURNOUTS)
        expect(ids(result)).toEqual(['blank-training'])
    })

    it('ANDs turnout with the other dimensions', () => {
        const result = filterEvents(EVENTS, new Set(['training']), ALL_STATES,
            new Set<TurnoutBucket>(['spots-open']))
        expect(ids(result)).toEqual(['blank-training'])
    })

    it('yields nothing when the dimensions have no event in common', () => {
        const result = filterEvents(EVENTS, new Set(['match']), new Set<AttendanceState>(['ATTENDING']), ALL_TURNOUTS)
        expect(result).toEqual([])
    })
})
