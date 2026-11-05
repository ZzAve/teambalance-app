import type { ReactNode } from 'react'
import { createContext, use } from 'react'
import type { Decorator, Loader } from '@storybook/react-vite'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

const StoryElement = createContext<ReactNode>(null)

function RootStory() {
  return use(StoryElement)
}

/**
 * Builds the story's router and waits for its first load. The router only renders its routes once
 * that load settles, which is after the story's play function would start; loaders run before the
 * story renders, so the story is on screen when play runs. Registered globally in .storybook/preview.ts.
 *
 * A catch-all splat child makes a <Link to="/anything"> resolve regardless of the target — the
 * decorator stays generic instead of accreting one route per linking component.
 */
export const routerLoader: Loader = async (context) => {
  const initialEntries: string[] = context.parameters?.router?.initialEntries ?? ['/']
  const rootRoute = createRootRoute({ component: RootStory })
  const catchAll = createRoute({ getParentRoute: () => rootRoute, path: '$', component: () => null })
  const router = createRouter({
    routeTree: rootRoute.addChildren([catchAll]),
    history: createMemoryHistory({ initialEntries }),
  })
  await router.load()
  return { router }
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
export const withRouter: Decorator = (Story, context) => (
  <StoryElement value={<Story />}>
    <RouterProvider router={context.loaded.router} />
  </StoryElement>
)
