/**
 * Decides what to do when a new service worker is ready to take over (caching plan Phase 3).
 *
 * Auto-update stays the default: anyone who simply opens the app gets the fresh version with no UI.
 * A visible prompt is a conditional fallback — shown only when a deploy lands while someone is
 * actively working with unsaved / in-flight state, so we never reload the rug out from under them.
 *
 * This is the irreducible logic (the plan's decision table); the `useRegisterSW` wiring and the
 * seam listeners around it are a thin SW-lifecycle shell with no story or real-backend path.
 */
export type UpdateAction = 'activate' | 'auto' | 'defer' | 'prompt'

export interface UpdateSignals {
  /** A previous worker already controls the page — false on a first install (nothing to prompt). */
  hasController: boolean
  /** The user has produced real input this session (first pointer/keydown). */
  hasInteracted: boolean
  /** Current document visibility — a hidden tab can be refreshed silently. */
  visibility: DocumentVisibilityState
  /** Unsaved forms or in-flight mutations — a reload would lose work, so never auto-apply. */
  isDirty: boolean
}

export function decideUpdateAction({
  hasController,
  hasInteracted,
  visibility,
  isDirty,
}: UpdateSignals): UpdateAction {
  // First install — no existing controller to replace, so there is nothing to prompt about.
  if (!hasController) return 'activate'
  // Unsaved / in-flight state — never auto-reload; let the user pick the moment. This takes
  // precedence over the hidden-tab case: a half-filled form still lives in memory even when the tab
  // is backgrounded, and a silent reload there would discard it just the same.
  if (isDirty) return 'prompt'
  // Backgrounded / not focused, nothing to lose — refresh silently so it's fresh on return.
  if (visibility === 'hidden') return 'auto'
  // A fresh load before any interaction — applying now just reads as a normal load.
  if (!hasInteracted) return 'auto'
  // Focused, interacted, but clean — apply at the next safe seam (route change / tab hidden),
  // falling back to a prompt only if none arrives before the app closes.
  return 'defer'
}
