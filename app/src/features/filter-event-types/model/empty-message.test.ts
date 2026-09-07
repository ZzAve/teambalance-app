import {describe, expect, it} from 'vitest'
import type {AttendanceState} from '@features/attendance-toggle/ui/AttendanceToggle'
import {ALL_ATTENDANCE_STATES} from './attendance-states'
import {emptyEventsMessage} from './empty-message'

const ALL_TYPE_IDS = ['training', 'match']

const message = (overrides: Partial<Parameters<typeof emptyEventsMessage>[0]> = {}) =>
    emptyEventsMessage({
        hasHero: false,
        showPast: false,
        activeTypeIds: new Set(ALL_TYPE_IDS),
        allTypeIds: ALL_TYPE_IDS,
        activeStates: new Set(ALL_ATTENDANCE_STATES),
        ...overrides,
    })

describe('emptyEventsMessage', () => {
    it('says the list is merely exhausted when a hero is on screen', () => {
        expect(message({hasHero: true, activeTypeIds: new Set(['match'])})).toBe('Nothing else coming up.')
    })

    it('reports an unfiltered upcoming list as having nothing coming', () => {
        expect(message()).toBe('No upcoming events.')
    })

    it('reports an unfiltered list including past as having nothing at all', () => {
        expect(message({showPast: true})).toBe('No events yet.')
    })

    it('names the type dimension when only it is narrowed', () => {
        expect(message({activeTypeIds: new Set(['match'])})).toBe('No events for this type.')
    })

    it('names the answer dimension when it is narrowed to Not responded alone', () => {
        expect(message({activeStates: new Set<AttendanceState>(['NOT_RESPONDED'])}))
            .toBe('Nothing needs your answer.')
    })

    it('stays generic for an answered status, where "needs your answer" would be a lie', () => {
        expect(message({activeStates: new Set<AttendanceState>(['ATTENDING'])}))
            .toBe('No events match these filters.')
    })

    it('stays generic for a multi-state selection', () => {
        expect(message({activeStates: new Set<AttendanceState>(['MAYBE', 'NOT_RESPONDED'])}))
            .toBe('No events match these filters.')
    })

    it('stays generic when both dimensions are narrowed', () => {
        expect(message({
            activeTypeIds: new Set(['match']),
            activeStates: new Set<AttendanceState>(['NOT_RESPONDED']),
        })).toBe('No events match these filters.')
    })
})
