import { useEffect, useRef, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useIsMutating } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { decideUpdateAction } from '@shared/lib/update-decision'
import { UpdateToast } from '@shared/ui/UpdateToast'

// Knob 1 — how often we even look for an update while a tab stays open. A long interval, not
// aggressive polling: the real triggers are page load (registration) and regaining visibility.
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000 // hourly

/**
 * Owns the service-worker update lifecycle (caching plan Phase 3). Registers the worker via
 * `virtual:pwa-register/react` and, when a new version is ready (`onNeedRefresh`), routes the
 * decision through `decideUpdateAction`:
 *
 *  - `activate` / `auto` → apply immediately (invisible; perceived as a normal load).
 *  - `defer`             → apply at the next safe seam — a route navigation or the tab going hidden —
 *                          falling back to the prompt only if none arrives.
 *  - `prompt`            → show the toast; the user reloads when their work is safe.
 *
 * Signals: `hasInteracted` (first real input this session) and `isDirty` (pending TanStack Query
 * mutations via `useIsMutating` — the pragmatic minimal source; unsaved-form tracking can extend it
 * later). Both are read through refs inside the SW callbacks, which `useRegisterSW` registers once
 * and would otherwise close over stale values.
 *
 * This is the thin lifecycle shell the plan flags as manual-verified: the risk lives in
 * decideUpdateAction (unit-tested) and the toast (storied), not here.
 */
export function SwUpdateManager() {
  const [showPrompt, setShowPrompt] = useState(false)

  // isDirty — pending mutations. Mirrored into a ref so the register-once SW callback reads it live.
  const pendingMutations = useIsMutating()
  const isDirtyRef = useRef(false)
  useEffect(() => {
    isDirtyRef.current = pendingMutations > 0
  }, [pendingMutations])

  const hasInteractedRef = useRef(false)
  const deferredRef = useRef(false)
  const updateSWRef = useRef<(reloadPage?: boolean) => Promise<void>>(() => Promise.resolve())

  // First real user input this session flips hasInteracted — the point past which a silent
  // auto-reload would read as an interruption rather than a normal load.
  useEffect(() => {
    const mark = () => {
      hasInteractedRef.current = true
    }
    window.addEventListener('pointerdown', mark, { once: true })
    window.addEventListener('keydown', mark, { once: true })
    return () => {
      window.removeEventListener('pointerdown', mark)
      window.removeEventListener('keydown', mark)
    }
  }, [])

  const { updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      // Knob 1 — re-check on regaining visibility and on a long periodic interval. (The initial
      // load check is the registration itself.) Never torn down: the manager lives for the app's
      // lifetime, so the listener and interval are process-scoped by design.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void registration.update()
      })
      window.setInterval(() => void registration.update(), UPDATE_CHECK_INTERVAL_MS)
    },
    onNeedRefresh() {
      const action = decideUpdateAction({
        hasController: Boolean(navigator.serviceWorker?.controller),
        hasInteracted: hasInteractedRef.current,
        visibility: document.visibilityState,
        isDirty: isDirtyRef.current,
      })
      if (action === 'activate' || action === 'auto') {
        void updateSWRef.current(true)
      } else if (action === 'defer') {
        deferredRef.current = true
      } else {
        setShowPrompt(true)
      }
    },
  })
  // Keep the ref pointing at the latest updater so the register-once callbacks and the seam effects
  // don't close over a stale one.
  useEffect(() => {
    updateSWRef.current = updateServiceWorker
  }, [updateServiceWorker])

  // Defer seam — a route navigation. A navigation already unmounts the current view, so applying a
  // waiting update there loses nothing. Skips the first run (nothing deferred yet at mount).
  const href = useRouterState({ select: (s) => s.location.href })
  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if (deferredRef.current) void updateSWRef.current(true)
  }, [href])

  // Defer seam — the tab going hidden. Backgrounding is a safe moment to refresh silently.
  useEffect(() => {
    const onHidden = () => {
      if (deferredRef.current && document.visibilityState === 'hidden') {
        void updateSWRef.current(true)
      }
    }
    document.addEventListener('visibilitychange', onHidden)
    return () => document.removeEventListener('visibilitychange', onHidden)
  }, [])

  return <UpdateToast show={showPrompt} onReload={() => void updateSWRef.current(true)} />
}
