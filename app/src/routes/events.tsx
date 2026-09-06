import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Slug-less entry point for the manifest's "Events" shortcut (src/app/pwa/manifest.ts). A static
 * shortcut URL cannot name a Team, so it hands over to `/`, the dispatcher that resolves the Active
 * Team — the one the caller last opened — and lands on its events.
 */
export const Route = createFileRoute('/events')({
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})
