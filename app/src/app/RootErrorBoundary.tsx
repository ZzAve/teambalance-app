import { Component, type ReactNode } from 'react'
import { RouteErrorFallback } from '@shared/ui/RouteErrorFallback'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * The last-resort error boundary, mounted ABOVE <RouterProvider> in index.tsx.
 *
 * The router has its own error boundary, but it wraps only the matched-route subtree — the router's
 * own load/transition machinery renders as a sibling of it, so an error thrown there (a redirect or
 * a value that surfaces as `undefined` during a concurrent transition) escapes every boundary,
 * reaches React's onUncaughtError, and unmounts the whole tree to a blank (black in dark mode) frame.
 * That is the residual cold-start crash the route-level fixes could not reach.
 *
 * This boundary sits above all of that, so ANY render/commit error React would otherwise leave
 * uncaught becomes a themed "Couldn't load — Retry" screen instead of a black void. Retry reloads
 * (by which point a cold backend is usually warm, and a new service worker — see sw-registration —
 * can take over). It is a safety net, not a router replacement: real route errors are still caught
 * lower down by the router's own error component; only what escapes that reaches here.
 */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Surface it for diagnostics; the thrown value can be anything (including undefined).
    console.error('Uncaught render error surfaced to the root boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return <RouteErrorFallback onRetry={() => window.location.reload()} />
    }
    return this.props.children
  }
}
