import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import './styles/global.css'

// While the root guard probes the session (and on any route load), show a brand splash rather
// than a blank frame.
function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="font-display text-xl font-bold text-blue">
        Team<span className="text-green">Balance</span>
      </span>
    </div>
  )
}

const router = createRouter({ routeTree, defaultPendingComponent: Splash })

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
