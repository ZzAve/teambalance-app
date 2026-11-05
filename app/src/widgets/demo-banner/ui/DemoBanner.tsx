import { useRouterState } from '@tanstack/react-router'
import { useLogout } from '@shared/api/auth'
import { clearSession } from '@shared/api/clear-session'
import { DemoBannerView } from './DemoBannerView'

// How a visitor asks for a real team (the same address the create-team page offers).
const START_TEAM_HREF = 'mailto:teams@teambalance.nl?subject=Request%20a%20team%20on%20TeamBalance'

/** Thin wiring for [DemoBannerView]: "Switch role" ends the session and lands on the picker (LOGIN_PATH in the demo build). */
export function DemoBanner() {
  const onPicker = useRouterState({ select: (s) => s.location.pathname === '/demo' })
  const logout = useLogout()

  return (
    <DemoBannerView
      startTeamHref={START_TEAM_HREF}
      onSwitchRole={onPicker ? undefined : () => logout.mutate(undefined, { onSuccess: clearSession })}
      isSwitching={logout.isPending}
    />
  )
}
