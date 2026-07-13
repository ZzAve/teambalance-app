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
function buildRouter(Story: FunctionComponent) {
  const rootRoute = createRootRoute({ component: Story })
  const catchAll = createRoute({ getParentRoute: () => rootRoute, path: '$', component: () => null })
  return createRouter({
    routeTree: rootRoute.addChildren([catchAll]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
}

function StoryRouter({ Story }: { Story: FunctionComponent }) {
  // Build the router once per mount, not on every render, so interaction (play) re-renders don't
  // discard the live router and reset its state mid-story.
  const router = useMemo(() => buildRouter(Story), [Story])
  return <RouterProvider router={router} />
}

/**
 * Storybook decorator that wraps a story in a minimal in-memory TanStack Router. Components that
 * render a <Link> (e.g. EventCard's link to /events/$eventId) need a router in context; the root
 * route renders the story and a catch-all child resolves any link target — without pulling in the
 * app's full generated route tree.
 */
export const withRouter: Decorator = (Story) => <StoryRouter Story={Story} />
