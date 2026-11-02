import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultPanelPreferences } from './panel-preferences'
import { useEventPanelStore } from './event-panel-store'
import { useEventFiltersStore } from '@features/filter-event-types/model/event-filters-store'

// The store's job: hold the display preference, persist every change, and stay out of the filter
// store's way (ADR-0030 §3). The parsing and fallback rules it leans on are unit-tested next
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
  it('starts collapsed', () => {
    expect(state().defaultExpanded).toBe(false)
  })

  it('persists the preference as it is set', () => {
    state().setDefaultExpanded(true)

    expect(JSON.parse(localStorage.getItem('tb.pref.event-panel') ?? '{}')).toEqual({
      defaultExpanded: true,
    })
  })

  it('comes back from storage on the next load, whatever team the member lands in', async () => {
    localStorage.setItem('tb.pref.event-panel', JSON.stringify({ defaultExpanded: true }))

    // A fresh page load: the module is imported again and reads storage on the way up.
    vi.resetModules()
    const { useEventPanelStore: reloaded } = await import('./event-panel-store')

    expect(reloaded.getState().defaultExpanded).toBe(true)
  })

  it('ignores a field written by a build that stored something else', async () => {
    // `view` was ADR-0030 §5's pips-or-people choice, retired with the either/or it selected. A blob
    // an older build wrote must still parse, costing the member nothing but the dead field.
    localStorage.setItem('tb.pref.event-panel', JSON.stringify({ view: 'members', defaultExpanded: true }))

    vi.resetModules()
    const { useEventPanelStore: reloaded } = await import('./event-panel-store')

    expect(reloaded.getState()).toMatchObject({ defaultExpanded: true })
    expect(reloaded.getState()).not.toHaveProperty('view')
  })

  it('survives Clear filters — a display preference is not filter state (ADR-0030 §3)', () => {
    state().setDefaultExpanded(true)

    useEventFiltersStore.getState().openTeam('setpoint-vt')
    useEventFiltersStore.getState().clearFilters()

    expect(state().defaultExpanded).toBe(true)
  })
})
