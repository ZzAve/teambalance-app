import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import {
  readPreference,
  teamPreferenceKey,
  writePreference,
  type PreferenceStorage,
} from '@shared/preferences/preferences'
import { ALL_ATTENDANCE_STATES } from './attendance-states'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from './turnout'

/**
 * What the events list remembers between visits (ADR-0030 §1, reversing ADR-0029 §8).
 *
 * The reversal is about mis-taps: reaching for a card's disclosure and landing on the event is a hit
 * -area defect, and losing your filter as the penalty for it is worse than the misreporting the
 * original decision guarded against.
 *
 * ## Why the *hidden* types are stored, not the active ones
 *
 * Event types are the one filter dimension whose universe changes under us — a type can be added,
 * deleted or archived between two visits. Two rules have to hold on restore (ADR-0030, #325):
 * a stale id must not narrow the list, and a *newly added* type must default to on.
 *
 * Storing the active set cannot satisfy both: a type absent from it is either one the member
 * switched off or one that did not exist yet, and nothing distinguishes them. Storing the set the
 * member switched *off* does: anything not named there is on, so a new type is on for free, a
 * deleted id is inert, and "nothing hidden" is exactly the unfiltered default (ADR-0029 §1).
 *
 * The other two dimensions have fixed universes — the four Attendance States and the four Turnout
 * bands — so they store their active selection directly.
 */
export interface StoredEventFilters {
  showPast: boolean
  /** Event types switched off. Everything else, present and future, is shown. */
  hiddenTypeIds: string[]
  states: string[]
  turnouts: string[]
}

/** The same four pieces, resolved against what actually exists now. */
export interface RestoredEventFilters {
  showPast: boolean
  hiddenTypeIds: Set<string>
  activeStates: Set<AttendanceState>
  activeTurnouts: Set<TurnoutBucket>
}

const PREFERENCE_NAME = 'event-filters'

const stringArray = (raw: unknown): string[] =>
  Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : []

/**
 * Lenient per field: a preference written by an older or newer build should cost the member the
 * fields that changed, not the ones that did not. Only "this is not an object at all" is a total
 * rejection.
 */
export function parseStoredEventFilters(raw: unknown): StoredEventFilters | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const value = raw as Record<string, unknown>
  return {
    showPast: value.showPast === true,
    hiddenTypeIds: stringArray(value.hiddenTypeIds),
    states: stringArray(value.states),
    turnouts: stringArray(value.turnouts),
  }
}

/**
 * A restored selection over a fixed universe: unknown values are dropped, and a selection that ends
 * up empty falls back to everything on. An empty selection is never a legitimate state — the
 * isolate-first toggler cannot produce one (ADR-0029 §3) — so it can only mean a stale or hand-
 * edited value, and showing an empty list because of one would be a worse answer than showing all.
 */
export function restoreSelection<T extends string>(
  stored: readonly string[],
  universe: readonly T[],
): Set<T> {
  const wanted = new Set(stored)
  const kept = universe.filter((member) => wanted.has(member))
  return new Set(kept.length > 0 ? kept : universe)
}

/**
 * The event types to show: everything that loaded, minus what the member switched off.
 *
 * Falls out of the representation — a stale hidden id matches nothing, a type added since the last
 * visit was never hidden so it is on — except for the last line: if every type that loaded is
 * hidden (a hidden set written when other types existed, all of which have since gone) the member
 * would face an empty list with no filter they recognise. All-on is the safer answer.
 */
export function reconcileTypeIds(
  hiddenTypeIds: ReadonlySet<string>,
  allTypeIds: readonly string[],
): Set<string> {
  const shown = allTypeIds.filter((id) => !hiddenTypeIds.has(id))
  return new Set(shown.length > 0 ? shown : allTypeIds)
}

/** The inverse, for writing: the types that exist and are not shown. */
export function hiddenTypeIdsOf(
  activeTypeIds: ReadonlySet<string>,
  allTypeIds: readonly string[],
): Set<string> {
  return new Set(allTypeIds.filter((id) => !activeTypeIds.has(id)))
}

/** The unfiltered view: nothing hidden, every answer, every band, upcoming only (ADR-0029 §1). */
export function defaultEventFilters(): RestoredEventFilters {
  return {
    showPast: false,
    hiddenTypeIds: new Set(),
    activeStates: new Set(ALL_ATTENDANCE_STATES),
    activeTurnouts: new Set(ALL_TURNOUT_BUCKETS),
  }
}

/** The team's stored filters, or the unfiltered defaults — never a throw, never a narrower list. */
export function readEventFilters(
  storage: PreferenceStorage | null,
  teamSlug: string,
): RestoredEventFilters {
  const stored = readPreference(
    storage,
    teamPreferenceKey(teamSlug, PREFERENCE_NAME),
    parseStoredEventFilters,
  )
  if (!stored) return defaultEventFilters()
  return {
    showPast: stored.showPast,
    hiddenTypeIds: new Set(stored.hiddenTypeIds),
    activeStates: restoreSelection(stored.states, ALL_ATTENDANCE_STATES),
    activeTurnouts: restoreSelection(stored.turnouts, ALL_TURNOUT_BUCKETS),
  }
}

export function writeEventFilters(
  storage: PreferenceStorage | null,
  teamSlug: string,
  filters: RestoredEventFilters,
): void {
  const stored: StoredEventFilters = {
    showPast: filters.showPast,
    hiddenTypeIds: [...filters.hiddenTypeIds],
    states: [...filters.activeStates],
    turnouts: [...filters.activeTurnouts],
  }
  writePreference(storage, teamPreferenceKey(teamSlug, PREFERENCE_NAME), stored)
}
