import type { AuthenticatedUser } from '@shared/api/auth'

/**
 * The rows of the Account tab's root list. Each row opens one scope: the account itself, the
 * viewer's profile in the Active Team, their teams, the app preferences, the platform tools. What
 * renders is a pure function of the authenticated user (ADR-0027 §2), never of the URL.
 */
export type AccountSection = 'signIn' | 'teamProfile' | 'teams' | 'preferences' | 'platformAdmin' | 'logout'

// Canonical display order; the selector returns the present sections in this order.
const ORDER: AccountSection[] = ['signIn', 'teamProfile', 'teams', 'preferences', 'platformAdmin', 'logout']

/** The fields of the session this selector reads — a narrow view of {@link AuthenticatedUser}. */
type AccountUser = Pick<AuthenticatedUser, 'activeTeam' | 'isPlatformAdmin' | 'actAs'>

/**
 * Which Account rows are visible for this session.
 *
 * - **Sign-in / Teams / Preferences / Log out** — always. Log out is the whole point: it must be
 *   reachable from every signed-in state.
 * - **Team profile** — an Active Team and not acting-as. It links to the viewer's own member page,
 *   the one editor of their name, position, shirt number, Team Photo and payment aliases. A Platform
 *   Admin acting-as is a Virtual Member that is never written (ADR-0024 §2), so has no such page.
 * - **Platform admin** — only for a Platform Admin.
 */
export function accountSections(user: AccountUser): AccountSection[] {
  const present = new Set<AccountSection>(['signIn', 'teams', 'preferences', 'logout'])
  if (user.activeTeam && !user.actAs) present.add('teamProfile')
  if (user.isPlatformAdmin) present.add('platformAdmin')
  return ORDER.filter((section) => present.has(section))
}
