import {describe, expect, it} from 'vitest'
import {toggleTypeSelection} from './toggleTypeSelection'

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
