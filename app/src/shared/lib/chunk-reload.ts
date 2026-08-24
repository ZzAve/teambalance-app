/**
 * One-shot recovery for a failed dynamic import of a route chunk (caching plan Phase 1).
 *
 * A client running a stale shell can navigate to a route whose hashed chunk was pruned by the last
 * deploy → the dynamic `import()` 404s → a blank screen. The fix is a single reload: fetching the
 * fresh (no-cache) `index.html` yields a shell that references chunk hashes that still exist.
 *
 * A `sessionStorage` sentinel keeps it one-shot: if the *fresh* shell also fails to load a chunk the
 * sentinel is already set, so it's a real outage (not a stale-chunk race) — we stop reloading and
 * fall through to the router's error fallback instead of looping forever.
 */

/** Sentinel key: set once per tab session after we've reloaded for a chunk error. */
export const CHUNK_RELOAD_SENTINEL = 'tb-chunk-reload'

/**
 * Pure decision: reload once when we haven't yet this session; otherwise the fresh shell also
 * failed, so fall back rather than loop. The window/sessionStorage/reload wiring around this is thin
 * and covered by manual verification; this is the irreducible logic.
 */
export function shouldReloadForChunkError(sentinelPresent: boolean): 'reload' | 'fallback' {
  return sentinelPresent ? 'fallback' : 'reload'
}

function sentinelPresent(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_SENTINEL) !== null
  } catch {
    // sessionStorage unavailable (private mode / disabled) — treat as not-yet-reloaded.
    return false
  }
}

/**
 * Wire the chunk-error recovery at app bootstrap. Listens for Vite's `vite:preloadError` (dispatched
 * by the built-in preload helper when a lazy chunk fails to load). On the first failure this session
 * it sets the sentinel and reloads to the fresh shell; on a second it clears the sentinel and lets
 * the router's `defaultErrorComponent` render the retry fallback.
 */
export function installChunkErrorHandler(): void {
  window.addEventListener('vite:preloadError', (event) => {
    // We own the recovery — suppress Vite's default (which rethrows the rejection).
    event.preventDefault()
    if (shouldReloadForChunkError(sentinelPresent()) === 'reload') {
      try {
        sessionStorage.setItem(CHUNK_RELOAD_SENTINEL, '1')
      } catch {
        // Can't persist the sentinel — a single reload attempt is still worth it.
      }
      window.location.reload()
    } else {
      // The fresh shell failed too → a real outage. Clear the sentinel so a later genuine
      // stale-chunk race can reload again, and let the router error fallback take over.
      try {
        sessionStorage.removeItem(CHUNK_RELOAD_SENTINEL)
      } catch {
        // Nothing to clear — the fallback still renders.
      }
    }
  })
}
