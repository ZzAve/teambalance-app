import { createFileRoute } from '@tanstack/react-router'
import { ACCOUNT_PATH } from '@shared/lib/team-routes'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'
import { LanguageSwitch } from '@features/language-switch/ui/LanguageSwitch'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { useTranslation } from 'react-i18next'

/** Account → "Preferences". Team-independent like `/account`, and allow-listed with it. */
export const Route = createFileRoute('/account/preferences')({
  component: AccountPreferencesPage,
})

// Both controls carry their own heading and stories; this page only places them.
function AccountPreferencesPage() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader title={t('account.preferences')} backTo={ACCOUNT_PATH} backLabel={t('account.backToAccount')} />
      <div className="space-y-6">
        <h1 className="font-display text-title font-bold">{t('account.preferences')}</h1>
        <p className="text-small text-muted-foreground">{t('account.preferencesScope')}</p>
        <ThemeToggle />
        <LanguageSwitch />
      </div>
    </>
  )
}
