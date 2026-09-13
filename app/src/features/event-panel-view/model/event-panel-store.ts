import { create } from 'zustand'
import { browserPreferenceStorage } from '@shared/preferences/preferences'
import {
  defaultPanelPreferences,
  readPanelPreferences,
  writePanelPreferences,
  type PanelPreferences,
  type PanelView,
} from './panel-preferences'

/**
 * The roster panel's display preferences, hand-wired to `shared/preferences` the same way the filter
 * store is (and `shared/theme` before it): no `persist` middleware, one `update` every mutation goes
 * through so persisting can never be forgotten on one path.
 *
 * Separate from the filter store on purpose (ADR-0030 §3): `clearFilters` clears where the member
 * was, and must leave how they like to look at it alone.
 */
interface EventPanelState extends PanelPreferences {
  /** The team the preferences belong to — null before the first `openTeam`. */
  teamSlug: string | null
  /** Enter a team's list: restore its preferences. A no-op when already on that team. */
  openTeam: (teamSlug: string) => void
  setView: (view: PanelView) => void
  setDefaultExpanded: (defaultExpanded: boolean) => void
}

export const useEventPanelStore = create<EventPanelState>((set, get) => {
  const update = (next: Partial<PanelPreferences>) => {
    const state = { ...get(), ...next }
    if (state.teamSlug) writePanelPreferences(browserPreferenceStorage(), state.teamSlug, state)
    set(next)
  }

  return {
    teamSlug: null,
    ...defaultPanelPreferences(),

    openTeam: (teamSlug) => {
      if (get().teamSlug === teamSlug) return
      set({ teamSlug, ...readPanelPreferences(browserPreferenceStorage(), teamSlug) })
    },

    setView: (view) => update({ view }),
    setDefaultExpanded: (defaultExpanded) => update({ defaultExpanded }),
  }
})
