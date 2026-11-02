import {
  appPreferenceKey,
  readPreference,
  writePreference,
  type PreferenceStorage,
} from '@shared/preferences/preferences'

/**
 * How the member likes the card's roster panel (ADR-0030 §6) — the *display* half of "remember how I
 * left this", kept deliberately apart from the filter state next door.
 *
 * Only one preference is left. ADR-0030 §5's `view` (pips or the member list) went with the either/or
 * it selected: the lineup panel is both halves at once, so there is no longer a choice to remember.
 * A stored `view` from an older build is simply ignored — see [parsePanelPreferences].
 *
 * ADR-0030 §3 is the reason these are not one stored blob with the filters: filter state is "where
 * was I" and a display preference is "how do I like this". Only the second is a setting, and only
 * the second survives `Clear filters` — which it could not if the two shared a key.
 *
 * That same distinction decides the **scope**, which is where this first landed wrong. These were
 * team-scoped, because they reused the filter store's `teamPreferenceKey`; but per-team is right for
 * a position and wrong for a taste. Nobody wants pips in one team and names in another, and being
 * asked to set it again on entering a second team reads as the setting having been forgotten. So the
 * key is app-wide, following `tb-theme` — the app's other display preference — rather than the
 * filters next door.
 */

export interface PanelPreferences {
  /** Start every card's roster panel open. Affordable only because the list carries attendances. */
  defaultExpanded: boolean
}

const PREFERENCE_NAME = 'event-panel'

/** Collapsed — the behaviour every member had before this preference existed. */
export function defaultPanelPreferences(): PanelPreferences {
  return { defaultExpanded: false }
}

/**
 * Lenient per field, like the filter preferences: a value written by another build should cost the
 * member the field that changed, not the one that did not. That leniency is also what makes the
 * removal of `view` free — a blob written by an older build still parses, its dead field ignored.
 */
export function parsePanelPreferences(raw: unknown): PanelPreferences | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const value = raw as Record<string, unknown>
  return { defaultExpanded: value.defaultExpanded === true }
}

/** The member's stored preferences, or the defaults — never a throw. */
export function readPanelPreferences(storage: PreferenceStorage | null): PanelPreferences {
  return (
    readPreference(storage, appPreferenceKey(PREFERENCE_NAME), parsePanelPreferences) ??
    defaultPanelPreferences()
  )
}

export function writePanelPreferences(
  storage: PreferenceStorage | null,
  preferences: PanelPreferences,
): void {
  writePreference(storage, appPreferenceKey(PREFERENCE_NAME), preferences)
}
