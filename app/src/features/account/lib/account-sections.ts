import type { AuthenticatedUser } from '@shared/api/auth'

/**
 * The rows the Account tab can show. What actually renders is a pure function of the authenticated
 * user (ADR-0027 §2) — never of the URL, so it is identical on every in-shell screen.
 */
export type AccountSection =
  | 'email'
  | 'displayName'
  | 'position'
  | 'appearance'
  | 'teams'
  | 'platformAdmin'
  | 'logout'

// Canonical display order; the selector returns the present sections in this order.
const ORDER: AccountSection[] = [
  'email',
  'displayName',
  'position',
  'appearance',
  'teams',
  'platformAdmin',
  'logout',
]

/** The fields of the session this selector reads — a narrow view of {@link AuthenticatedUser}. */
type AccountUser = Pick<
  AuthenticatedUser,
  'email' | 'activeTeam' | 'teams' | 'isPlatformAdmin' | 'actAs'
>

/**
 * Which Account sections are visible for this session.
 *
 * - **Email / Appearance / Teams / Log out** — always. Log out is the whole point: it must be
 *   reachable from every signed-in state.
 * - **Display name / Position** — only with an Active Team, because member data is tenant-scoped
 *   (ADR-0026). An Active Team can come from a membership *or* from act-as (ADR-0024): a Platform
 *   Admin acting-as has `activeTeam` set with `teams` empty, and still gets the tenant's name +
 *   position — so the gate is `activeTeam`, not "has a membership".
 * - **Platform admin** — only for a Platform Admin.
 */
export function accountSections(user: AccountUser): AccountSection[] {
  const present = new Set<AccountSection>(['email', 'appearance', 'teams', 'logout'])
  if (user.activeTeam) {
    present.add('displayName')
    present.add('position')
  }
  if (user.isPlatformAdmin) present.add('platformAdmin')
  return ORDER.filter((section) => present.has(section))
}
