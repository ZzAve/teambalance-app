import { createFileRoute, notFound } from '@tanstack/react-router'
import { DemoTopUpPage } from '@pages/demo/ui/DemoTopUpPage'

// Where the demo build's Top up button lands (ADR-0043); like /demo it exists only in the demo build.
export const Route = createFileRoute('/demo-top-up')({
  beforeLoad: () => {
    if (!import.meta.env.VITE_DEMO) throw notFound()
  },
  component: DemoTopUpPage,
})
