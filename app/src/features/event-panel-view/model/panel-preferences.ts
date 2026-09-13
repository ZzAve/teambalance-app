import {
  readPreference,
  teamPreferenceKey,
  writePreference,
  type PreferenceStorage,
} from '@shared/preferences/preferences'

/**
 * How the member likes the card's roster panel (ADR-0030 §5 and §6) — the *display* half of
 * "remember how I left this", kept deliberately apart from the filter state next door.
 *
 * ADR-0030 §3 is the reason these are not one stored blob with the filters: filter state is "where
 * was I" and a display preference is "how do I like this". Only the second is a setting, and only
 * the second survives `Clear filters` — which it could not if the two shared a key. Same mechanism
 * (`shared/preferences`), same per-team key namespace, its own name.
 */

/** What the roster disclosure opens onto: the position pips, or the member list. */
export type PanelView = 'pips' | 'members'

export interface PanelPreferences {
  view: PanelView
  /** Start every card's roster panel open. Affordable only because the list carries attendances. */
  defaultExpanded: boolean
}

const PREFERENCE_NAME = 'event-panel'

/**
 * Pips and collapsed — the behaviour every member had before this preference existed, which is what
 * "never touched the control" has to mean.
 */
export function defaultPanelPreferences(): PanelPreferences {
  return { view: 'pips', defaultExpanded: false }
}

/**
 * Lenient per field, like the filter preferences: a value written by another build should cost the
 * member the field that changed, not the one that did not. An unrecognised `view` — a third view
 * that has since gone, or a hand-edited string — falls back to the default rather than rendering
 * nothing.
 */
export function parsePanelPreferences(raw: unknown): PanelPreferences | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const value = raw as Record<string, unknown>
  return {
    view: value.view === 'members' ? 'members' : 'pips',
    defaultExpanded: value.defaultExpanded === true,
  }
}

/** The team's stored preferences, or the defaults — never a throw. */
export function readPanelPreferences(
  storage: PreferenceStorage | null,
  teamSlug: string,
): PanelPreferences {
  return (
    readPreference(storage, teamPreferenceKey(teamSlug, PREFERENCE_NAME), parsePanelPreferences) ??
    defaultPanelPreferences()
  )
}

export function writePanelPreferences(
  storage: PreferenceStorage | null,
  teamSlug: string,
  preferences: PanelPreferences,
): void {
  writePreference(storage, teamPreferenceKey(teamSlug, PREFERENCE_NAME), preferences)
}
