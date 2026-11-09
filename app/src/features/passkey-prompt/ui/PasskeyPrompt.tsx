import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@shared/api/auth'
import {
  dismissPasskeyPrompt,
  isPasskeyPromptDismissed,
  passkeyErrorKey,
  passkeysOffered,
  passkeysSupported,
  useRegisterPasskey,
} from '@shared/api/passkeys'
import { browserPreferenceStorage } from '@shared/preferences/preferences'
import { PasskeyPromptView } from './PasskeyPromptView'

/**
 * Offers a passkey to a signed-in person who has none, once per device (ADR-0045). A successful add
 * refetches /me, the count becomes 1 and this unmounts itself.
 */
export function PasskeyPrompt() {
  const { t } = useTranslation()
  const user = useCurrentUser()
  const register = useRegisterPasskey()
  const [dismissedNow, setDismissedNow] = useState(false)

  if (!user || user.passkeyCount !== 0 || !passkeysOffered() || !passkeysSupported() || dismissedNow) return null
  if (isPasskeyPromptDismissed(browserPreferenceStorage())) return null

  return (
    <PasskeyPromptView
      isPending={register.isPending}
      errorMessage={register.isError ? t(passkeyErrorKey(register.error)) : undefined}
      onAdd={() => register.mutate()}
      onDismiss={() => {
        dismissPasskeyPrompt(browserPreferenceStorage())
        setDismissedNow(true)
      }}
    />
  )
}
