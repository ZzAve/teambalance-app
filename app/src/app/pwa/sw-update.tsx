import { useEffect, useRef, useState } from 'react'
import { useIsMutating } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { useWakeNotice } from '@shared/lib/use-wake-notice'
import { UpdateToast } from '@shared/ui/UpdateToast'
import { WakeToast } from '@shared/ui/WakeToast'
import { applyDeferredUpdate, applyUpdate, onUpdatePrompt, setDirty } from './sw-registration'

/**
 * The in-shell half of the service-worker update flow (caching plan Phase 3). Registration and the
 * auto-apply decision live at bootstrap in sw-registration.ts so they run even when the app shell
 * fails to render; this component adds only the refinements that need React context and that only
 * matter once the shell is up and the user is active:
 *
 *  - the `isDirty` signal (pending mutations) so a deploy mid-work prompts instead of auto-reloading;
 *  - the defer seam — apply a deferred update at the next route navigation;
 *  - the reload prompt itself (`UpdateToast`), shown only for the "focused, interacted, dirty" case.
 *
 * It also owns the bottom pill slot: the reload prompt takes precedence over the wake notice because
 * it needs an action, and the wake notice yields to the pending-route splash, which already says the
 * same thing.
 *
 * The tab-hidden defer seam and every auto/activate path are owned by sw-registration.ts, which does
 * not need React to run.
 */
export function SwUpdateManager() {
  const [showPrompt, setShowPrompt] = useState(false)

  // isDirty — pending mutations. Mirrored into the bootstrap controller so its register-once
  // onNeedRefresh callback reads a live value.
  const pendingMutations = useIsMutating()
  useEffect(() => {
    setDirty(pendingMutations > 0)
  }, [pendingMutations])

  const wake = useWakeNotice()
  const routePending = useRouterState({ select: (s) => s.matches.some((m) => m.status === 'pending') })

  // The controller tells us when to surface the prompt (the one case it does not auto-resolve).
  useEffect(() => onUpdatePrompt(setShowPrompt), [])

  // Defer seam — a route navigation. A navigation already unmounts the current view, so applying a
  // waiting update there loses nothing. Skips the first run (nothing deferred yet at mount).
  const href = useRouterState({ select: (s) => s.location.href })
  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    applyDeferredUpdate()
  }, [href])

  return (
    <>
      <UpdateToast show={showPrompt} onReload={applyUpdate} />
      <WakeToast show={wake.show && !showPrompt && !routePending} elapsedMs={wake.elapsedMs} />
    </>
  )
}
