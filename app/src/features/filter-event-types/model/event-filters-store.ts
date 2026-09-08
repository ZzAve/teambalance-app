import { create } from 'zustand'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { browserPreferenceStorage } from '@shared/preferences/preferences'
import { ALL_ATTENDANCE_STATES } from './attendance-states'
import {
  defaultEventFilters,
  hiddenTypeIdsOf,
  readEventFilters,
  reconcileTypeIds,
  writeEventFilters,
  type RestoredEventFilters,
} from './filter-preferences'
import { toggleTypeSelection } from './toggleTypeSelection'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from './turnout'

/**
 * The events list's filter state, which now outlives the page (ADR-0030 §1).
 *
 * Hand-wired to `shared/preferences` rather than zustand's `persist` middleware, the same way
 * `shared/theme/theme-store.ts` is: the restore is not a plain rehydrate. What comes back has to be
 * reconciled against the event types that actually loaded, which the middleware has no place to do.
 *
 * The store holds `hiddenTypeIds`, not the active set — see `filter-preferences.ts` for why. The
 * active set is derived by the route with `reconcileTypeIds` once the types are in, which also
 * removes the old bootstrap effect: before the types load there is nothing to derive, and the route
 * already withholds filtering until then.
 */
interface EventFiltersState extends RestoredEventFilters {
  /** The team the state belongs to — null before the first `openTeam`. */
  teamSlug: string | null
  /**
   * Enter a team's list: restore its filters, or start unfiltered. A no-op when already on that
   * team, so navigating to an event and back does not disturb the state it is meant to preserve.
   */
  openTeam: (teamSlug: string) => void
  setShowPast: (showPast: boolean) => void
  /** Isolate-first, like every chip group (ADR-0029 §3); `allTypeIds` is what currently exists. */
  toggleType: (typeId: string, allTypeIds: readonly string[]) => void
  toggleState: (state: AttendanceState) => void
  toggleTurnout: (bucket: TurnoutBucket) => void
  clearFilters: () => void
}

export const useEventFiltersStore = create<EventFiltersState>((set, get) => {
  /**
   * Every mutation goes through here, so persisting can never be forgotten on one path. The write
   * itself is best-effort (private mode) — the in-memory update stands either way.
   */
  const update = (next: Partial<RestoredEventFilters>) => {
    const state = { ...get(), ...next }
    if (state.teamSlug) writeEventFilters(browserPreferenceStorage(), state.teamSlug, state)
    set(next)
  }

  return {
    teamSlug: null,
    ...defaultEventFilters(),

    openTeam: (teamSlug) => {
      if (get().teamSlug === teamSlug) return
      set({ teamSlug, ...readEventFilters(browserPreferenceStorage(), teamSlug) })
    },

    setShowPast: (showPast) => update({ showPast }),

    toggleType: (typeId, allTypeIds) => {
      const active = reconcileTypeIds(get().hiddenTypeIds, allTypeIds)
      const next = toggleTypeSelection(active, allTypeIds, typeId)
      update({ hiddenTypeIds: hiddenTypeIdsOf(next, allTypeIds) })
    },

    toggleState: (state) =>
      update({ activeStates: toggleTypeSelection(get().activeStates, ALL_ATTENDANCE_STATES, state) }),

    toggleTurnout: (bucket) =>
      update({
        activeTurnouts: toggleTypeSelection(get().activeTurnouts, ALL_TURNOUT_BUCKETS, bucket),
      }),

    clearFilters: () => update(defaultEventFilters()),
  }
})
