import { createFileRoute, notFound } from '@tanstack/react-router'
import { IS_DEMO_BUILD } from '@shared/lib/demo-build'
import { DemoTopUpPage } from '@pages/demo/ui/DemoTopUpPage'

// Where the demo build's Top up button lands (ADR-0043); like /demo it exists only in the demo build.
export const Route = createFileRoute('/demo-top-up')({
  beforeLoad: () => {
    if (!IS_DEMO_BUILD) throw notFound()
  },
  component: DemoTopUpPage,
})
