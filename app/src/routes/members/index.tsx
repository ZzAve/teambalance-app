import { createFileRoute, redirect } from '@tanstack/react-router'

// Retired. The roster now lives at /team (readable by every member); position management moved to
// /team/settings. Bounce any lingering /members link there so there is only one roster surface.
export const Route = createFileRoute('/members/')({
  beforeLoad: () => {
    throw redirect({ to: '/team' })
  },
})
