import { createFileRoute, notFound } from '@tanstack/react-router'
import { DemoPage } from '@pages/demo/ui/DemoPage'

// The guest login exists only in the demo build (VITE_DEMO, set by `make demo-image`); every other build shows not-found.
export const Route = createFileRoute('/demo')({
  beforeLoad: () => {
    if (!import.meta.env.VITE_DEMO) throw notFound()
  },
  component: DemoPage,
})
