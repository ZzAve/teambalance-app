import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { authMeQueryOptions } from '@shared/api/auth'
import {
  browserSessionStorage,
  readLastSignInMethod,
  shouldAutoStartPasskey,
  takeSkipPasskeyAutoStart,
  writeLastSignInMethod,
} from '@shared/api/last-sign-in-method'
import { passkeyErrorKey, passkeysOffered, passkeysSupported, usePasskeyLogin } from '@shared/api/passkeys'
import { queryClient } from '@shared/api/query-client'
import { browserPreferenceStorage } from '@shared/preferences/preferences'
import { PasskeyLoginView } from './PasskeyLoginView'

/**
 * Thin container: signs in with a passkey, then lets the root gate route as after a magic link (ADR-0045).
 * When a passkey was this device's last sign-in, the ceremony starts once on mount (not right after a logout).
 */
export function PasskeyLogin() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = usePasskeyLogin(() => {
    writeLastSignInMethod(browserPreferenceStorage(), 'passkey')
    queryClient.removeQueries({ queryKey: authMeQueryOptions.queryKey })
    void navigate({ to: '/' })
  })
  const [lastMethod] = useState(() => readLastSignInMethod(browserPreferenceStorage()))
  const started = useRef(false)
  const signIn = () => login.mutate()

  useEffect(() => {
    // Started from a timer, not from the effect body: `mutate` called inside the effect runs before StrictMode's
    // simulated unmount, which detaches the mutation observer for good, so `isPending` would never update and the
    // button would stay enabled. The timer is cleared by that unmount and set again by the remount, so it fires
    // once; `started` stops a later re-run. No retry on error, so a cancel cannot loop.
    // No Vitest/story layer renders StrictMode with a real mutation (it would be a new RTL render test); the e2e
    // reload step proves the auto-start end to end, and the dev server (StrictMode on) runs it.
    if (started.current) return
    const timer = setTimeout(() => {
      started.current = true
      const skipOnce = takeSkipPasskeyAutoStart(browserSessionStorage())
      if (shouldAutoStartPasskey({ lastMethod, offered: passkeysOffered(), supported: passkeysSupported(), skipOnce })) signIn()
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!passkeysOffered() || !passkeysSupported()) return null

  return (
    <PasskeyLoginView
      isPending={login.isPending}
      isLast={lastMethod === 'passkey'}
      // Cancelling the browser dialog is not a failure worth a message.
      errorMessage={
        login.isError
          ? passkeyErrorKey(login.error) === 'passkeys.error.cancelled'
            ? undefined
            : t('auth.login.passkeyFailed')
          : undefined
      }
      onSignIn={signIn}
    />
  )
}
