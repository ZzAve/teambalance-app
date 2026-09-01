import { registerSW } from 'virtual:pwa-register'
import { decideUpdateAction } from '@shared/lib/update-decision'

// The service-worker update lifecycle, owned at module level so it runs at bootstrap — before, and
// independent of, any React render (see index.tsx, which calls registerAppServiceWorker outside the
// router).
//
// Why not keep this inside a component (it used to live in SwUpdateManager, mounted by RootLayout)?
// Because the one moment we most need an update to apply is exactly when the shell fails to render:
// an errored session probe drops us on the router's error fallback, or a bad build crashes the tree
// — RootLayout never mounts, so a component-owned registration never runs, a waiting new worker
// sits unactivated forever, and the client is stranded on the broken build that can no longer
// update itself. A crashed/error-fallback load is always a fresh, pre-interaction one, so the
// decision table below resolves it to `auto`/`activate` and we self-heal.
//
// The richer, in-shell refinements (prompt-when-dirty, defer-to-next-navigation) still live in the
// React layer (sw-update.tsx) and feed signals in through the setters here — but they only ever
// apply once the user has interacted, which means the shell did render and that layer is present.

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000 // hourly — page load + regained visibility do the rest.

let hasInteracted = false
let isDirty = false
let deferred = false
let registered = false
let updateSW: (reloadPage?: boolean) => Promise<void> = () => Promise.resolve()
let promptListener: ((show: boolean) => void) | null = null

// First real input this session flips hasInteracted — past this point a silent auto-reload would read
// as an interruption, so the decision table stops auto-applying.
if (typeof window !== 'undefined') {
  const mark = () => {
    hasInteracted = true
  }
  window.addEventListener('pointerdown', mark, { once: true })
  window.addEventListener('keydown', mark, { once: true })
}

/** Apply a waiting worker now (SKIP_WAITING → controllerchange → reload). Used by the prompt's Reload. */
export function applyUpdate(): void {
  void updateSW(true)
}

/** Mirror pending mutations in so a deploy landing mid-work prompts instead of auto-reloading. */
export function setDirty(dirty: boolean): void {
  isDirty = dirty
}

/** A safe seam arrived (a route navigation, or the tab going hidden) — apply a deferred update. */
export function applyDeferredUpdate(): void {
  if (!deferred) return
  deferred = false
  void updateSW(true)
}

/** The React UX layer subscribes to learn when to show the reload prompt. */
export function onUpdatePrompt(listener: (show: boolean) => void): () => void {
  promptListener = listener
  return () => {
    if (promptListener === listener) promptListener = null
  }
}

/**
 * Register the worker and own its update lifecycle. Called once from bootstrap (index.tsx), outside
 * the router, so it runs on every load no matter what — or whether — the app renders.
 */
export function registerAppServiceWorker(): void {
  if (registered) return
  registered = true
  updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      // Re-check on regaining visibility and on a long periodic interval (the initial load check is
      // the registration itself). Backgrounding is also a safe seam to apply a deferred update.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void registration.update()
        else applyDeferredUpdate()
      })
      window.setInterval(() => void registration.update(), UPDATE_CHECK_INTERVAL_MS)
    },
    onNeedRefresh() {
      const action = decideUpdateAction({
        hasController: Boolean(navigator.serviceWorker?.controller),
        hasInteracted,
        visibility: document.visibilityState,
        isDirty,
      })
      if (action === 'activate' || action === 'auto') {
        void updateSW(true)
      } else if (action === 'defer') {
        deferred = true
      } else {
        promptListener?.(true)
      }
    },
  })
}
