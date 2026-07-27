import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { WakingSplash } from '@shared/ui/ColdStartSplash'
import './styles/global.css'

// While the root guard probes the session (and on any route load), show the brand splash rather
// than a blank frame. WakingSplash escalates its copy as it waits, so a cold-start backend wake
// (~12s after scale-to-zero) reads as progress instead of a hang — warm loads only ever see the mark.
const router = createRouter({ routeTree, defaultPendingComponent: WakingSplash })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
