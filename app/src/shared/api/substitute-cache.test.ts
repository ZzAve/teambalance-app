import { describe, expect, it } from 'vitest'
import type { Substitute } from './substitutes'
import type { SubstituteEntry } from './generated/model/SubstituteEntry'
import { applyOptimisticSubstitute, removeOptimisticSubstitute } from './substitute-cache'

const entry = (overrides: Partial<SubstituteEntry> = {}): SubstituteEntry => ({
  substituteId: 'sub-1',
  name: 'Femke',
  position: undefined,
  state: 'MAYBE',
  changedBy: 'user-0',
  updatedAt: '2026-08-01T10:00:00Z',
  ...overrides,
})

const bram: Substitute = { id: 'sub-2', name: 'Bram', position: { id: 'pos-1', label: 'Libero' }, shirtNumber: 14 }

const event = (substitutes: SubstituteEntry[], id = 'evt-1') => ({ id, substitutes })

describe('applyOptimisticSubstitute', () => {
  it('moves a substitute already on the event to the new state, stamped with the actor', () => {
    const patched = applyOptimisticSubstitute([event([entry()])], 'evt-1', 'sub-1', 'ATTENDING', 'user-9', undefined)
    expect(patched[0].substitutes[0]).toMatchObject({ substituteId: 'sub-1', state: 'ATTENDING', changedBy: 'user-9' })
  })

  it('adds a substitute from the team list who is not on the event yet', () => {
    const patched = applyOptimisticSubstitute([event([])], 'evt-1', 'sub-2', 'MAYBE', 'user-9', bram)
    expect(patched[0].substitutes).toEqual([
      expect.objectContaining({ substituteId: 'sub-2', name: 'Bram', position: bram.position, state: 'MAYBE' }),
    ])
  })

  it('leaves the event alone when the substitute is unknown, for the refetch to fill in', () => {
    const original = [event([])]
    expect(applyOptimisticSubstitute(original, 'evt-1', 'sub-2', 'MAYBE', 'user-9', undefined)).toEqual(original)
  })

  it('patches only the targeted event in a list, and a single event detail too', () => {
    const list = [event([entry()], 'evt-1'), event([entry()], 'evt-2')]
    const patched = applyOptimisticSubstitute(list, 'evt-2', 'sub-1', 'ABSENT', 'user-9', undefined)
    expect(patched[0]).toBe(list[0])
    expect(patched[1].substitutes[0].state).toBe('ABSENT')

    const detail = applyOptimisticSubstitute(event([entry()]), 'evt-1', 'sub-1', 'ABSENT', 'user-9', undefined)
    expect(detail.substitutes[0].state).toBe('ABSENT')
  })

  it('patches the list as the list query caches it, the raw { events } response', () => {
    const cached = { events: [event([entry()], 'evt-1'), event([entry()], 'evt-2')] }
    const patched = applyOptimisticSubstitute(cached, 'evt-2', 'sub-1', 'ATTENDING', 'user-9', undefined)
    expect(patched.events[0]).toBe(cached.events[0])
    expect(patched.events[1].substitutes[0].state).toBe('ATTENDING')
  })
})

describe('removeOptimisticSubstitute', () => {
  it('takes the substitute off the targeted event only', () => {
    const list = [event([entry()], 'evt-1'), event([entry()], 'evt-2')]
    const patched = removeOptimisticSubstitute(list, 'evt-1', 'sub-1')
    expect(patched[0].substitutes).toEqual([])
    expect(patched[1]).toBe(list[1])
  })

  it('takes the substitute off in the raw { events } list response', () => {
    const cached = { events: [event([entry()], 'evt-1')] }
    expect(removeOptimisticSubstitute(cached, 'evt-1', 'sub-1').events[0].substitutes).toEqual([])
  })
})
