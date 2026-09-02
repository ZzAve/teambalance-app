import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { WakingSplash } from '@shared/ui/ColdStartSplash'
import { RouteErrorFallback } from '@shared/ui/RouteErrorFallback'
import { RootErrorBoundary } from '@app/RootErrorBoundary'
import { installChunkErrorHandler } from '@shared/lib/chunk-reload'
import { registerAppServiceWorker } from '@app/pwa/sw-registration'
import './styles/global.css'

// A stale shell can dynamic-import a route chunk whose hash the last deploy pruned → a blank frame.
// This reloads once to the fresh index.html (which references chunk hashes that exist) rather than
// leaving the screen blank; a second failure falls through to the router fallback below (Phase 1).
installChunkErrorHandler()

// Register the service worker and drive its update lifecycle here at bootstrap — outside the router,
// so it runs on every load regardless of what renders. If a load ends on the error fallback (a cold
// session probe failing) or crashes before the shell mounts, this still activates a waiting new
// worker, so a broken build can always update itself on the next open instead of stranding the
// client. The in-shell refinements (prompt, defer-to-navigation) live in SwUpdateManager.
registerAppServiceWorker()

// While the root guard probes the session (and on any route load), show the brand splash rather
// than a blank frame. WakingSplash escalates its copy as it waits, so a cold-start backend wake
// (~12s after scale-to-zero) reads as progress instead of a hang — warm loads only ever see the mark.
const router = createRouter({
  routeTree,
  defaultPendingComponent: WakingSplash,
  // A route that still throws after the reload guard (e.g. the fresh shell also 404s a chunk — a
  // real outage, not a stale-chunk race) renders the retry fallback instead of nothing. Retry does
  // a full reload to re-fetch the shell and its current chunk hashes.
  defaultErrorComponent: () => <RouteErrorFallback onRetry={() => window.location.reload()} />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Last-resort boundary ABOVE the router: anything that escapes the router's own error handling
        (an error thrown in its load/transition machinery, which sits outside that boundary) becomes
        a themed retry screen here instead of an uncaught error that blanks the root. */}
    <RootErrorBoundary>
      <RouterProvider router={router} />
    </RootErrorBoundary>
  </StrictMode>,
)
