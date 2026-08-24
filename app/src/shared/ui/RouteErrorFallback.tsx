import { QueryErrorState } from './QueryErrorState'

interface RouteErrorFallbackProps {
  /** Recover — typically a full reload to re-fetch the shell and its current chunk hashes. */
  onRetry: () => void
}

/**
 * The router's last-resort error fallback (caching plan Phase 1), rendered by the router's
 * `defaultErrorComponent` when a route still throws after the one-shot chunk-reload guard has run —
 * e.g. the fresh shell also failed to load a chunk. Reuses the shared QueryErrorState shell so a
 * load failure is never a blank frame; Retry reloads to re-fetch the shell.
 */
export function RouteErrorFallback({ onRetry }: RouteErrorFallbackProps) {
  return (
    <QueryErrorState
      title="Couldn't load this page"
      description="Something went wrong loading the app. Please try again."
      onRetry={onRetry}
    />
  )
}
