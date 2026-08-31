import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * The merged Account surface moved off this team-scoped path to the team-independent `/account`
 * (ADR-0027 §1). This stays as a thin redirect so existing links and bookmarks keep working, with
 * `/account` as the single source of truth. The old `LogoutButton` logic now lives in `AccountView`.
 */
export const Route = createFileRoute('/t/$slug/profile/')({
  beforeLoad: () => {
    throw redirect({ to: '/account' })
  },
  component: () => null,
})
