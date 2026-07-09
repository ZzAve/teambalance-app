/**
 * Isolate-first selection: from the all-active state a tap isolates the tapped
 * type; from a subset a tap toggles it; deselecting the last type restores all.
 */
export function toggleTypeSelection(
    active: Set<string>,
    allTypeIds: string[],
    tappedId: string,
): Set<string> {
    if (active.size === allTypeIds.length) {
        return new Set([tappedId])
    }
    const next = new Set(active)
    if (next.has(tappedId)) {
        next.delete(tappedId)
        if (next.size === 0) {
            return new Set(allTypeIds)
        }
    } else {
        next.add(tappedId)
    }
    return next
}
