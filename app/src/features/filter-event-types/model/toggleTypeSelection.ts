/**
 * Isolate-first selection for a chip group: from the all-active state a tap isolates the tapped
 * chip; from a subset a tap toggles it; deselecting the last chip restores all.
 *
 * Generic over the chip id because every filter dimension toggles this way (ADR-0029 §3) — event
 * types and Attendance States share this one implementation rather than each growing their own.
 */
export function toggleTypeSelection<T extends string>(
    active: Set<T>,
    allIds: readonly T[],
    tappedId: T,
): Set<T> {
    if (active.size === allIds.length) {
        return new Set([tappedId])
    }
    const next = new Set(active)
    if (next.has(tappedId)) {
        next.delete(tappedId)
        if (next.size === 0) {
            return new Set(allIds)
        }
    } else {
        next.add(tappedId)
    }
    return next
}
