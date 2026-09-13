import { beforeEach, describe, expect, it } from 'vitest'
import { defaultEventFilters } from './filter-preferences'
import { useEventFiltersStore } from './event-filters-store'

// The store's job is small but load-bearing: hold the four filter dimensions, persist every change,
// and restore the right team's on entry. The reconciliation rules it leans on are unit-tested next
// door in filter-preferences.test.ts; what is proved here is the wiring — that nothing mutates
// without being written, and that a team switch does not leak a filter across.

const TYPES = ['et-1', 'et-2', 'et-3']

beforeEach(() => {
  localStorage.clear()
  useEventFiltersStore.setState({ teamSlug: null, ...defaultEventFilters() })
})

const state = () => useEventFiltersStore.getState()

describe('event-filters-store', () => {
  it('starts unfiltered', () => {
    expect(state().showPast).toBe(false)
    expect(state().hiddenTypeIds).toEqual(new Set())
  })

  it('persists a type filter and restores it on the next visit', () => {
    state().openTeam('setpoint-vt')
    // Isolate-first from the all-on default (ADR-0029 §3): one tap leaves only the tapped type.
    state().toggleType('et-2', TYPES)
    expect(state().hiddenTypeIds).toEqual(new Set(['et-1', 'et-3']))

    // A fresh page load: nothing in memory, everything in storage.
    useEventFiltersStore.setState({ teamSlug: null, ...defaultEventFilters() })
    state().openTeam('setpoint-vt')

    expect(state().hiddenTypeIds).toEqual(new Set(['et-1', 'et-3']))
  })

  it('persists the answer, turnout and past-events dimensions too', () => {
    state().openTeam('setpoint-vt')
    state().toggleState('NOT_RESPONDED')
    state().toggleTurnout('spots-open')
    state().setShowPast(true)

    useEventFiltersStore.setState({ teamSlug: null, ...defaultEventFilters() })
    state().openTeam('setpoint-vt')

    expect(state().activeStates).toEqual(new Set(['NOT_RESPONDED']))
    expect(state().activeTurnouts).toEqual(new Set(['spots-open']))
    expect(state().showPast).toBe(true)
  })

  // Navigating to an event and back re-runs the effect that opens the team. That must not disturb
  // the very state it exists to preserve — which is the whole point of the reversal (ADR-0030 §1).
  it('is a no-op when re-entering the team it is already on', () => {
    state().openTeam('setpoint-vt')
    state().toggleType('et-2', TYPES)
    const hidden = state().hiddenTypeIds

    state().openTeam('setpoint-vt')

    expect(state().hiddenTypeIds).toBe(hidden)
  })

  it('swaps to the other team’s filters on a team switch, without carrying one across', () => {
    state().openTeam('setpoint-vt')
    state().toggleType('et-2', TYPES)
    state().setShowPast(true)

    state().openTeam('vc-zaanstad')

    expect(state()).toMatchObject({ ...defaultEventFilters(), teamSlug: 'vc-zaanstad' })
  })

  it('clears every dimension at once, and persists the cleared state', () => {
    state().openTeam('setpoint-vt')
    state().toggleType('et-2', TYPES)
    state().toggleState('MAYBE')
    state().setShowPast(true)

    state().clearFilters()

    expect(state()).toMatchObject(defaultEventFilters())
    useEventFiltersStore.setState({ teamSlug: null, ...defaultEventFilters() })
    state().openTeam('setpoint-vt')
    expect(state()).toMatchObject(defaultEventFilters())
  })

  // Before a team is opened there is nowhere to write to. Toggling anyway must not throw or invent
  // a key — it simply is not persisted.
  it('holds a change made before a team is open without persisting it', () => {
    state().setShowPast(true)

    expect(state().showPast).toBe(true)
    expect(localStorage.length).toBe(0)
  })
})
