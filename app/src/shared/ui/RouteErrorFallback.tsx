import { Button } from '@shared/ui/button'
import { QueryErrorState } from './QueryErrorState'

interface RouteErrorFallbackProps {
  /** Recover — typically a full reload to re-fetch the shell and its current chunk hashes. */
  onRetry: () => void
  /**
   * Local escape hatch (ADR-0027 §3): a client-only `clearSession()`. Present only when a session
   * exists — or might; omitted once the auth probe has resolved to "no user", when there is nothing
   * to log out of. Rendered beside Retry.
   */
  onLogout?: () => void
}

/**
 * The router's last-resort error fallback (caching plan Phase 1), rendered by the router's
 * `defaultErrorComponent` when a route still throws after the one-shot chunk-reload guard has run —
 * e.g. the fresh shell also failed to load a chunk. Reuses the shared QueryErrorState shell so a
 * load failure is never a blank frame; Retry reloads to re-fetch the shell. Because this renders
 * *instead of* RootLayout, `/account`'s Log out can't reach it — so it carries its own (ADR-0027 §3).
 */
export function RouteErrorFallback({ onRetry, onLogout }: RouteErrorFallbackProps) {
  return (
    <QueryErrorState
      title="Couldn't load this page"
      description="Something went wrong loading the app. Please try again."
      onRetry={onRetry}
    >
      {onLogout && (
        <Button variant="ghost" onClick={onLogout}>
          Log out
        </Button>
      )}
    </QueryErrorState>
  )
}
