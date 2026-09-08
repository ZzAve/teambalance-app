import {describe, expect, it} from 'vitest'
import {toggleTypeSelection} from './toggleTypeSelection'
import type {AttendanceState} from '@features/attendance-toggle/ui/AttendanceToggle'

const ALL = ['training', 'match', 'tournament', 'social']

describe('toggleTypeSelection', () => {
    it('isolates the tapped type when all types are active', () => {
        const result = toggleTypeSelection(new Set(ALL), ALL, 'training')
        expect([...result]).toEqual(['training'])
    })

    it('adds an inactive type when a subset is active', () => {
        const result = toggleTypeSelection(new Set(['training']), ALL, 'match')
        expect([...result].sort()).toEqual(['match', 'training'])
    })

    it('removes an active type when a subset is active', () => {
        const result = toggleTypeSelection(new Set(['training', 'match']), ALL, 'training')
        expect([...result]).toEqual(['match'])
    })

    it('restores all types when the last active type is deselected', () => {
        const result = toggleTypeSelection(new Set(['training']), ALL, 'training')
        expect([...result].sort()).toEqual([...ALL].sort())
    })

    it('reaches the all-active state by adding the final missing type', () => {
        const result = toggleTypeSelection(new Set(['training', 'match', 'tournament']), ALL, 'social')
        expect([...result].sort()).toEqual([...ALL].sort())
    })

    it('does not mutate the input set', () => {
        const input = new Set(['training', 'match'])
        toggleTypeSelection(input, ALL, 'training')
        expect([...input].sort()).toEqual(['match', 'training'])
    })
})

// The same toggler drives the Attendance State chips (ADR-0029 §3) — one implementation, so
// "show me only what needs my answer" is the same single tap as isolating an event type.
describe('toggleTypeSelection over attendance states', () => {
    const STATES: AttendanceState[] = ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED']

    it('isolates the tapped state when all states are active', () => {
        const result = toggleTypeSelection(new Set(STATES), STATES, 'NOT_RESPONDED')
        expect([...result]).toEqual(['NOT_RESPONDED'])
    })

    it('adds a second state back, which is the OR case', () => {
        const result = toggleTypeSelection(new Set<AttendanceState>(['NOT_RESPONDED']), STATES, 'MAYBE')
        expect([...result].sort()).toEqual(['MAYBE', 'NOT_RESPONDED'])
    })
})
