import { createFileRoute } from '@tanstack/react-router'
import { useAuthMe, useLogout } from '@shared/api/auth'
import { clearSession } from '@shared/api/clear-session'
import { accountSections } from '@features/account/lib/account-sections'
import { AccountView } from '@features/account/ui/AccountView'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { useTranslation } from 'react-i18next'

/**
 * The team-independent Account tab (ADR-0027 §1). Because it is not under `/t/$slug`, it resolves on
 * every in-shell screen regardless of slug — closing both the teamless and get-started logout gaps —
 * and the root gate allow-lists it (`isTeamlessRoute`) so a teamless caller reaches it here rather
 * than being bounced to onboarding.
 */
export const Route = createFileRoute('/account/')({
  component: AccountPage,
})

/**
 * Thin container: reads the session and wires logout. It fetches no member data, so no load or
 * error can stand between the caller and Log out. The rows are covered by AccountView's stories,
 * this seam by e2e.
 */
function AccountPage() {
  const { data: user } = useAuthMe()
  const logout = useLogout()
  const { t } = useTranslation()

  // The root gate confirms the session before this route renders, so `user` is present; guard
  // defensively for the sliver of time before the cached /me resolves back.
  if (!user) return null

  return (
    <>
      <PageHeader title={t('account.title')} />
      <AccountView
        sections={accountSections(user)}
        userId={user.id}
        displayName={user.displayName}
        email={user.email}
        personalPhotoVersion={user.personalPhotoVersion ?? null}
        activeTeamName={user.activeTeam?.name ?? null}
        activeTeamSlug={user.activeTeam?.slug ?? null}
        // In-shell logout: a clean server-side teardown first, then the shared client clear.
        onLogout={() => logout.mutate(undefined, { onSuccess: () => clearSession() })}
      />
    </>
  )
}
