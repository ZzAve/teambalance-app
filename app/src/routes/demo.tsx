import { createFileRoute, notFound } from '@tanstack/react-router'
import { IS_DEMO_BUILD } from '@shared/lib/demo-build'
import { DemoPage } from '@pages/demo/ui/DemoPage'

// The guest login exists only in the demo build (VITE_DEMO, set by `make demo-image`); every other build shows not-found.
export const Route = createFileRoute('/demo')({
  beforeLoad: () => {
    if (!IS_DEMO_BUILD) throw notFound()
  },
  component: DemoPage,
})
