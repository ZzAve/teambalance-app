import type { Decorator } from '@storybook/react-vite'
import { AppShellFrame } from '@shared/ui/AppShellFrame'
import { BottomNav } from '@shared/ui/BottomNav'
import { withRouter } from '@shared/testing/router-decorator'
import type { TeamRef } from '@shared/api/teams'
import { TeamSwitcherView } from '@features/switch-team/ui/TeamSwitcherView'

// The one Team every page composite is rendered in. Its slug is what BottomNav builds the tab
// targets from, so the router must start on one of SHELL_ROUTES for the right tab to light up.
export const SHELL_TEAM: TeamRef = { id: 't1', name: 'Setpoint VT', slug: 'setpoint-vt' }

export const SHELL_ROUTES = {
  events: `/t/${SHELL_TEAM.slug}`,
  team: `/t/${SHELL_TEAM.slug}/team`,
  money: `/t/${SHELL_TEAM.slug}/money`,
  account: '/account',
} as const

/**
 * Renders a page composite inside the real app frame — header with the wordmark and the team name,
 * the centred main column, the bottom tab bar — so its snapshot is what a phone actually shows
 * (ADR-0031 §3). The frame is the same `AppShellFrame` the root route uses; only the two live slots
 * are swapped for prop-only stand-ins (a single-team `TeamSwitcherView`, no act-as banner).
 *
 * Needs a router below it for BottomNav's links and active-tab derivation, so use it as
 * `decorators: [withAppShell, withRouter]` and point `parameters.router.initialEntries` at the
 * matching SHELL_ROUTES entry — `appShell(tab)` bundles both, plus the `fullscreen` layout so the
 * frame sits flush against the viewport like the real one, with no preview padding around it.
 * This lives outside `src/` on purpose: it reaches across FSD layers (shared + features) in a way
 * no production module may.
 */
export const withAppShell: Decorator = (Story) => (
  <AppShellFrame
    teamSwitcher={<TeamSwitcherView teams={[SHELL_TEAM]} activeTeam={SHELL_TEAM} onSelect={() => {}} />}
    nav={<BottomNav />}
  >
    <Story />
  </AppShellFrame>
)

/** The decorator stack + router start for a page composite on the given tab. */
export function appShell(tab: keyof typeof SHELL_ROUTES) {
  return {
    decorators: [withAppShell, withRouter] as Decorator[],
    parameters: { layout: 'fullscreen', router: { initialEntries: [SHELL_ROUTES[tab]] } },
  }
}
