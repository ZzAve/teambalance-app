import { useTranslation } from 'react-i18next'
import { useSetLanguage } from '@shared/api/account'
import type { Language } from '@shared/i18n/i18n'
import { LanguageSwitchView } from './LanguageSwitchView'

/** Thin container: shows the current language and stores a new choice on the user (ADR-0043 §3). */
export function LanguageSwitch() {
  const { i18n } = useTranslation()
  const setLanguage = useSetLanguage()

  return (
    <LanguageSwitchView
      value={i18n.language as Language}
      onChange={(language) => setLanguage.mutate(language)}
      isSaving={setLanguage.isPending}
    />
  )
}
