import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import type { Decorator } from '@storybook/react-vite'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

// A catch-all splat child so a <Link to="/anything"> resolves regardless of the target — the
// decorator stays generic instead of accreting one route per linking component.
function buildRouter(Story: FunctionComponent, initialEntries: string[]) {
  const rootRoute = createRootRoute({ component: Story })
  const catchAll = createRoute({ getParentRoute: () => rootRoute, path: '$', component: () => null })
  return createRouter({
    routeTree: rootRoute.addChildren([catchAll]),
    history: createMemoryHistory({ initialEntries }),
  })
}

function StoryRouter({ Story, initialEntries }: { Story: FunctionComponent; initialEntries: string[] }) {
  // Build the router once per mount, not on every render, so interaction (play) re-renders don't
  // discard the live router and reset its state mid-story.
  const router = useMemo(() => buildRouter(Story, initialEntries), [Story, initialEntries])
  return <RouterProvider router={router} />
}

/**
 * Storybook decorator that wraps a story in a minimal in-memory TanStack Router. Components that
 * render a <Link> (e.g. EventCard's link to /events/$eventId) need a router in context; the root
 * route renders the story and a catch-all child resolves any link target — without pulling in the
 * app's full generated route tree.
 *
 * Route-aware components (BottomNav derives its active tab from the current path) can start the
 * router at a specific path via `parameters.router.initialEntries` — defaults to `['/']`.
 */
export const withRouter: Decorator = (Story, context) => {
  const initialEntries: string[] = context.parameters?.router?.initialEntries ?? ['/']
  return <StoryRouter Story={Story} initialEntries={initialEntries} />
}
