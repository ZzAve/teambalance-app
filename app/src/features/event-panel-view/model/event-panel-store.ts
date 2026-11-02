import { create } from 'zustand'
import { browserPreferenceStorage } from '@shared/preferences/preferences'
import { readPanelPreferences, writePanelPreferences, type PanelPreferences } from './panel-preferences'

/**
 * The roster panel's display preference, hand-wired to `shared/preferences` the same way the filter
 * store is (and `shared/theme` before it): no `persist` middleware, one `update` every mutation goes
 * through so persisting can never be forgotten on one path.
 *
 * Separate from the filter store on purpose (ADR-0030 §3): `clearFilters` clears where the member
 * was, and must leave how they like to look at it alone.
 *
 * Unlike that store it has **no team binding at all** — no `openTeam`, no `teamSlug`. A taste is not
 * per team (see `panel-preferences.ts`), so the value is read once at module load, exactly as
 * `theme-store` reads the theme. That also removes an entry effect from the events route: there is
 * no per-team state left to restore on entry.
 */
interface EventPanelState extends PanelPreferences {
  setDefaultExpanded: (defaultExpanded: boolean) => void
}

export const useEventPanelStore = create<EventPanelState>((set, get) => {
  const update = (next: Partial<PanelPreferences>) => {
    writePanelPreferences(browserPreferenceStorage(), { ...get(), ...next })
    set(next)
  }

  return {
    ...readPanelPreferences(browserPreferenceStorage()),

    setDefaultExpanded: (defaultExpanded) => update({ defaultExpanded }),
  }
})
