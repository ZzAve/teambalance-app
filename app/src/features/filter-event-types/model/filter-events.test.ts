import {describe, expect, it} from 'vitest'
import type {AttendanceState} from '@features/attendance-toggle/ui/AttendanceToggle'
import {makeEvent} from '@shared/testing/event-fixtures'
import {ALL_ATTENDANCE_STATES} from './attendance-states'
import {filterEvents} from './filter-events'

const TYPE_IDS = ['training', 'match']
const ALL_TYPES = new Set(TYPE_IDS)
const ALL_STATES = new Set<AttendanceState>(ALL_ATTENDANCE_STATES)

const event = (id: string, typeId: string, myState: AttendanceState) =>
    makeEvent({id, myState, eventType: {id: typeId, name: typeId, color: '#000'}})

const EVENTS = [
    event('going-training', 'training', 'ATTENDING'),
    event('blank-training', 'training', 'NOT_RESPONDED'),
    event('maybe-match', 'match', 'MAYBE'),
    event('absent-match', 'match', 'ABSENT'),
]

const ids = (events: ReturnType<typeof event>[]) => events.map(e => e.id)

describe('filterEvents', () => {
    it('drops nothing when every chip in both groups is on', () => {
        expect(ids(filterEvents(EVENTS, ALL_TYPES, ALL_STATES))).toEqual(ids(EVENTS))
    })

    it('ORs within the answer dimension', () => {
        const result = filterEvents(EVENTS, ALL_TYPES, new Set<AttendanceState>(['MAYBE', 'ABSENT']))
        expect(ids(result)).toEqual(['maybe-match', 'absent-match'])
    })

    it('ORs within the type dimension', () => {
        const result = filterEvents(EVENTS, new Set(['training']), ALL_STATES)
        expect(ids(result)).toEqual(['going-training', 'blank-training'])
    })

    it('ANDs across the two dimensions', () => {
        const result = filterEvents(EVENTS, new Set(['training']), new Set<AttendanceState>(['NOT_RESPONDED']))
        expect(ids(result)).toEqual(['blank-training'])
    })

    it('yields nothing when the two dimensions have no event in common', () => {
        const result = filterEvents(EVENTS, new Set(['match']), new Set<AttendanceState>(['ATTENDING']))
        expect(result).toEqual([])
    })
})
