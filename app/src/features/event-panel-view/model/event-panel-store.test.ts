import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultPanelPreferences } from './panel-preferences'
import { useEventPanelStore } from './event-panel-store'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'

// The store's job: hold the two display preferences, persist every change, and stay out of the
// filter store's way (ADR-0030 §3). The parsing and fallback rules it leans on are unit-tested next
// door in panel-preferences.test.ts; the wiring is what is proved here.
//
// It has no `openTeam`: the preferences are app-wide, so the value is read once at module load the
// way `theme-store` reads the theme. Restoring is therefore a property of the *import*, which is why
// the restore test below re-imports the module rather than calling an entry function.

beforeEach(() => {
  localStorage.clear()
  useEventPanelStore.setState(defaultPanelPreferences())
})

const state = () => useEventPanelStore.getState()

describe('event-panel-store', () => {
  it('starts on pips, collapsed', () => {
    expect(state().view).toBe('pips')
    expect(state().defaultExpanded).toBe(false)
  })

  it('persists both preferences as they are set', () => {
    state().setView('members')
    state().setDefaultExpanded(true)

    expect(JSON.parse(localStorage.getItem('tb.pref.event-panel') ?? '{}')).toEqual({
      view: 'members',
      defaultExpanded: true,
    })
  })

  it('persists one preference without dropping the other', () => {
    state().setDefaultExpanded(true)
    state().setView('members')

    // A naive `set` that wrote only the field it changed would have lost `defaultExpanded` here.
    expect(state().defaultExpanded).toBe(true)
    expect(JSON.parse(localStorage.getItem('tb.pref.event-panel') ?? '{}').defaultExpanded).toBe(true)
  })

  it('comes back from storage on the next load, whatever team the member lands in', async () => {
    localStorage.setItem(
      'tb.pref.event-panel',
      JSON.stringify({ view: 'members', defaultExpanded: true }),
    )

    // A fresh page load: the module is imported again and reads storage on the way up.
    vi.resetModules()
    const { useEventPanelStore: reloaded } = await import('./event-panel-store')

    expect(reloaded.getState().view).toBe('members')
    expect(reloaded.getState().defaultExpanded).toBe(true)
  })

  it('ignores a preference stored by a build that wrote something else', async () => {
    localStorage.setItem('tb.pref.event-panel', JSON.stringify({ view: 'names' }))

    vi.resetModules()
    const { useEventPanelStore: reloaded } = await import('./event-panel-store')

    expect(reloaded.getState().view).toBe('pips')
  })

  it('survives Clear filters — a display preference is not filter state (ADR-0030 §3)', () => {
    state().setView('members')

    useEventFiltersStore.getState().openTeam('setpoint-vt')
    useEventFiltersStore.getState().clearFilters()

    expect(state().view).toBe('members')
  })
})
