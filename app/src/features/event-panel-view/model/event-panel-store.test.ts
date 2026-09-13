import { beforeEach, describe, expect, it } from 'vitest'
import { defaultPanelPreferences } from './panel-preferences'
import { useEventPanelStore } from './event-panel-store'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'

// The store's job: hold the two display preferences, persist every change, restore the right team's
// on entry — and stay out of the filter store's way (ADR-0030 §3). The parsing and fallback rules it
// leans on are unit-tested next door in panel-preferences.test.ts; the wiring is what is proved here.

beforeEach(() => {
  localStorage.clear()
  useEventPanelStore.setState({ teamSlug: null, ...defaultPanelPreferences() })
})

const state = () => useEventPanelStore.getState()

describe('event-panel-store', () => {
  it('starts on pips, collapsed', () => {
    expect(state().view).toBe('pips')
    expect(state().defaultExpanded).toBe(false)
  })

  it('persists both preferences and restores them on the next visit', () => {
    state().openTeam('setpoint-vt')
    state().setView('members')
    state().setDefaultExpanded(true)

    // A fresh page load: nothing in memory, everything in storage.
    useEventPanelStore.setState({ teamSlug: null, ...defaultPanelPreferences() })
    state().openTeam('setpoint-vt')

    expect(state().view).toBe('members')
    expect(state().defaultExpanded).toBe(true)
  })

  it('does not carry one team preference into another', () => {
    state().openTeam('setpoint-vt')
    state().setView('members')

    state().openTeam('other-team')
    expect(state().view).toBe('pips')
  })

  it('re-entering the same team leaves the state alone', () => {
    state().openTeam('setpoint-vt')
    state().setView('members')
    state().openTeam('setpoint-vt')
    expect(state().view).toBe('members')
  })

  it('ignores a preference stored by a build that wrote something else', () => {
    localStorage.setItem('tb.pref.setpoint-vt.event-panel', JSON.stringify({ view: 'names' }))
    state().openTeam('setpoint-vt')
    expect(state().view).toBe('pips')
  })

  it('survives Clear filters — a display preference is not filter state (ADR-0030 §3)', () => {
    state().openTeam('setpoint-vt')
    state().setView('members')

    useEventFiltersStore.getState().openTeam('setpoint-vt')
    useEventFiltersStore.getState().clearFilters()

    expect(state().view).toBe('members')
  })
})
