import { useTranslation } from 'react-i18next'

/**
 * A small "Last" pill on the corner of a sign-in button: the way this device signed in last (ADR-0045).
 * The button names it with `aria-describedby={id}`, since a `title` alone is not announced.
 */
export function LastUsedPill({ id }: { id: string }) {
  const { t } = useTranslation()
  return (
    <span
      id={id}
      title={t('auth.login.lastUsedHint')}
      className="absolute -right-2 -top-2 rounded-full border border-green bg-card px-2 py-0.5 text-caption font-semibold text-foreground"
    >
      {t('auth.login.lastUsed')}
    </span>
  )
}
