import { describe, expect, it } from 'vitest'
import { makeEvent } from '@entities/event/testing/event-fixtures'
import { ALL_ATTENDANCE_STATES, type AttendanceState } from '@entities/attendance/model/attendance-state'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from '@features/filter-event-types/model/turnout'
import { buildEventsPageModel, type EventsPageModelInput } from './events-page-model'

const NOW = new Date('2030-01-01T12:00:00Z')
const TRAINING = { id: 'training', name: 'Training', color: '#000' }
const MATCH = { id: 'match', name: 'Match', color: '#111' }

const event = (id: string, startTime: string, eventType = TRAINING, myState: AttendanceState = 'NOT_RESPONDED') =>
    makeEvent({ id, startTime, eventType, myState })

const soon = event('soon', '2030-01-02T18:00:00Z')
const later = event('later', '2030-01-03T18:00:00Z', MATCH)
const farOff = event('far-off', '2030-06-01T18:00:00Z')

const input = (overrides: Partial<EventsPageModelInput> = {}): EventsPageModelInput => ({
    events: [later, soon],
    eventTypes: [TRAINING, MATCH],
    isLoading: false,
    error: undefined,
    hiddenTypeIds: new Set<string>(),
    activeStates: new Set<AttendanceState>(ALL_ATTENDANCE_STATES),
    activeTurnouts: new Set<TurnoutBucket>(ALL_TURNOUT_BUCKETS),
    showPast: false,
    now: NOW,
    ...overrides,
})

const ids = (events: { id: string }[]) => events.map(e => e.id)

describe('buildEventsPageModel', () => {
    it('sorts chronologically and takes the nearest event as hero', () => {
        const model = buildEventsPageModel(input())
        expect(ids(model.sortedEvents)).toEqual(['soon', 'later'])
        expect(model.heroEvent?.id).toBe('soon')
    })

    it('drops the hero from the list but keeps it in Bulk Attend', () => {
        const model = buildEventsPageModel(input())
        expect(ids(model.listEvents)).toEqual(['later'])
        expect(ids(model.bulkEvents)).toEqual(['soon', 'later'])
    })

    it('has no hero when the nearest event is outside the window', () => {
        const model = buildEventsPageModel(input({ events: [farOff] }))
        expect(model.heroEvent).toBeNull()
        expect(ids(model.listEvents)).toEqual(['far-off'])
    })

    it('hides loading and error beneath a hero', () => {
        const model = buildEventsPageModel(input({ isLoading: true, error: new Error('boom') }))
        expect(model.listShell).toEqual({ isLoading: false, error: undefined })
    })

    it('passes loading and error through when there is no hero', () => {
        const error = new Error('boom')
        const model = buildEventsPageModel(input({ events: undefined, isLoading: true, error }))
        expect(model.listShell).toEqual({ isLoading: true, error })
    })

    it('applies filters only once event types have loaded', () => {
        const hidden = new Set(['training'])
        expect(ids(buildEventsPageModel(input({ eventTypes: undefined, hiddenTypeIds: hidden })).sortedEvents))
            .toEqual(['soon', 'later'])
        expect(ids(buildEventsPageModel(input({ hiddenTypeIds: hidden })).sortedEvents)).toEqual(['later'])
    })

    it('derives active type ids from what is hidden', () => {
        const model = buildEventsPageModel(input({ hiddenTypeIds: new Set(['match', 'deleted-type']) }))
        expect([...model.activeTypeIds]).toEqual(['training'])
        expect(model.allTypeIds).toEqual(['training', 'match'])
    })

    it('words the empty state by whether a hero is shown', () => {
        expect(buildEventsPageModel(input({ events: [] })).emptyMessage).toBe('No upcoming events.')
        expect(buildEventsPageModel(input()).emptyMessage).toBe('Nothing else coming up.')
    })
})
