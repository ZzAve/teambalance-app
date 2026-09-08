/**
 * Local preferences (ADR-0030 §4) — the pure half of "remember how I left this".
 *
 * Nothing here reads a global: storage is an argument, so a whole preference round trip is a plain
 * unit under test. Modelled on `shared/theme` deliberately, and for the same reasons: a preference
 * is never worth breaking the app over, so every path swallows and falls back rather than throwing.
 *
 * The consumer supplies its own `parse`, because a preference read back off disk is untrusted input:
 * it may have been written by an older build, a newer one, or a member poking at devtools.
 *
 * This is the shared *mechanism*. Each consumer owns its own shape and its own plain zustand store
 * (no `persist` middleware — see `shared/theme/theme-store.ts` for the precedent).
 */

/** The slice of `Storage` this module needs — so a test can hand it a Map and nothing else. */
export interface PreferenceStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

const PREFIX = 'tb.pref'

/**
 * A per-team key. Preferences are per team, not per member-across-teams: someone who plays in two
 * teams must not carry one team's event-type filter into the other (ADR-0030 §4).
 *
 * The `tb` prefix is the same convention as the existing client-side keys (`tb-theme`,
 * `tb.money-vote.<slug>`); the `pref` segment keeps this namespace apart from them.
 */
export function teamPreferenceKey(teamSlug: string, name: string): string {
  return `${PREFIX}.${teamSlug}.${name}`
}

/**
 * The stored preference, or `null` for anything that is not one: nothing written yet, malformed
 * JSON, a shape `parse` rejects, or storage that refuses to be read (Safari private mode throws on
 * access). The caller decides what "nothing stored" means — for every consumer so far it means
 * "the defaults", which is the state a member who never touched the control would have had.
 */
export function readPreference<T>(
  storage: PreferenceStorage | null | undefined,
  key: string,
  parse: (raw: unknown) => T | null,
): T | null {
  try {
    const stored = storage?.getItem(key)
    return stored === null || stored === undefined ? null : parse(JSON.parse(stored))
  } catch {
    return null
  }
}

/** Persists the preference. Swallows: storage being unavailable only costs the member a reload. */
export function writePreference(
  storage: PreferenceStorage | null | undefined,
  key: string,
  value: unknown,
): void {
  try {
    storage?.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode, quota, disabled cookies) — the choice just won't survive
    // a reload. The current session keeps it.
  }
}

/** `localStorage` where there is one, `null` where reading it at all throws (cookies blocked). */
export function browserPreferenceStorage(): PreferenceStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}
