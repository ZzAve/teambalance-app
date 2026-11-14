import type { Substitute } from './generated/model/Substitute'
import type { SubstituteEntry } from './generated/model/SubstituteEntry'
import { patchCachedEvent, type CachedEvents as CachedEventShapes } from './event-cache'

type SubstituteState = SubstituteEntry['state']
type WithSubstitutes = { id: string; substitutes: SubstituteEntry[] }
type CachedEvents = CachedEventShapes<WithSubstitutes>

/** Applies [patch] to the substitutes of the event with [eventId], whichever cached shape holds it. */
function patchEvent<T extends CachedEvents>(
  cached: T,
  eventId: string,
  patch: (substitutes: SubstituteEntry[]) => SubstituteEntry[],
): T {
  return patchCachedEvent<WithSubstitutes, T>(cached, eventId, (e) => ({ ...e, substitutes: patch(e.substitutes) }))
}

/**
 * The optimistic patch behind an instant Substitute call-in, the counterpart of
 * `applyOptimisticAttendance`: the event's entry for [substituteId] moves to [state], or, for a
 * Substitute not on the event yet, is added from the Team's list ([substitute]). Unknown on both
 * counts, the event is left for the refetch. Immutable, so a rollback can restore the snapshot. The
 * roster is left alone for the reason given on `applyOptimisticAttendance`.
 */
export function applyOptimisticSubstitute<T extends CachedEvents>(
  cached: T,
  eventId: string,
  substituteId: string,
  state: SubstituteState,
  actorId: string | null,
  substitute: Substitute | undefined,
): T {
  return patchEvent(cached, eventId, (substitutes) => {
    const stamp = { state, changedBy: actorId ?? '', updatedAt: new Date().toISOString() }
    if (substitutes.some((s) => s.substituteId === substituteId)) {
      return substitutes.map((s) => (s.substituteId === substituteId ? { ...s, ...stamp } : s))
    }
    if (!substitute) return substitutes
    return [...substitutes, { substituteId, name: substitute.name, position: substitute.position, ...stamp }]
  })
}

/** Takes [substituteId] off the event straight away; the refetch confirms it. */
export function removeOptimisticSubstitute<T extends CachedEvents>(
  cached: T,
  eventId: string,
  substituteId: string,
): T {
  return patchEvent(cached, eventId, (substitutes) => substitutes.filter((s) => s.substituteId !== substituteId))
}
