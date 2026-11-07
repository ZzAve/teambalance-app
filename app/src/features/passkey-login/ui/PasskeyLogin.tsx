import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { authMeQueryOptions } from '@shared/api/auth'
import { passkeyErrorKey, passkeysOffered, passkeysSupported, usePasskeyLogin } from '@shared/api/passkeys'
import { queryClient } from '@shared/api/query-client'
import { PasskeyLoginView } from './PasskeyLoginView'

/** Thin container: signs in with a passkey, then lets the root gate route as after a magic link (ADR-0045). */
export function PasskeyLogin() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = usePasskeyLogin()
  if (!passkeysOffered() || !passkeysSupported()) return null

  return (
    <PasskeyLoginView
      isPending={login.isPending}
      // Cancelling the browser dialog is not a failure worth a message.
      errorMessage={
        login.isError
          ? passkeyErrorKey(login.error) === 'passkeys.error.cancelled'
            ? undefined
            : t('auth.login.passkeyFailed')
          : undefined
      }
      onSignIn={() =>
        login.mutate(undefined, {
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: authMeQueryOptions.queryKey })
            void navigate({ to: '/' })
          },
        })
      }
    />
  )
}
