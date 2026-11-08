import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser'
import { authMeQueryOptions } from './auth'
import { csrfHeaders } from './csrf'
import { api } from './wirespec-client'
import { i18n } from '@shared/i18n/i18n'
import {
  appPreferenceKey,
  readPreference,
  writePreference,
  type PreferenceStorage,
} from '@shared/preferences/preferences'

export type { Passkey } from './generated/model/Passkey'

// Passkeys (ADR-0045). The ceremony endpoints are Spring Security's WebAuthn module's own contract, not
// Wirespec's, so this is the one file that names them. Only the list is Wirespec (`api.listPasskeys`).
const baseUrl = () => import.meta.env.VITE_API_URL ?? ''

export const passkeysSupported = () => browserSupportsWebAuthn()

// Off in the demo build, whose guests share one persona (the API refuses registration there too).
// Not VITE_DEMO: the e2e dev server sets that one to reach /demo.
export const passkeysOffered = () => !import.meta.env.VITE_NO_PASSKEYS

async function postJson(path: string, body?: unknown): Promise<Response> {
  // JSON even without a body: the CSRF exemption of the sign-in endpoints is JSON-only (ADR-0012).
  const res = await fetch(`${baseUrl()}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...csrfHeaders('POST') },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} failed with status ${res.status}`)
  return res
}

/** The message key for a failed ceremony. Pure, so the browser's error names are unit-tested. */
export function passkeyErrorKey(
  error: unknown,
): 'passkeys.error.cancelled' | 'passkeys.error.alreadyRegistered' | 'passkeys.error.failed' {
  const { name, code } = (error ?? {}) as { name?: string; code?: string }
  if (name === 'NotAllowedError' || code === 'ERROR_CEREMONY_ABORTED') return 'passkeys.error.cancelled'
  if (name === 'InvalidStateError' || code === 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED') {
    return 'passkeys.error.alreadyRegistered'
  }
  return 'passkeys.error.failed'
}

const PASSKEYS_KEY = ['account', 'passkeys']

export function usePasskeys() {
  return useQuery({
    queryKey: PASSKEYS_KEY,
    queryFn: async () => {
      const res = await api.listPasskeys()
      if (res.status !== 200) throw new Error(`Listing passkeys failed with status ${res.status}`)
      return res.body
    },
  })
}

/** Registers a passkey on this device for the signed-in person. */
export function useRegisterPasskey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const optionsJSON = await (await postJson('/webauthn/register/options')).json()
      const credential = await startRegistration({ optionsJSON })
      const label = credential.authenticatorAttachment === 'platform' ? i18n.t('passkeys.labelDevice') : i18n.t('passkeys.labelKey')
      await postJson('/webauthn/register', { publicKey: { credential, label } })
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: PASSKEYS_KEY }),
        // The count on /me decides whether the prompt is offered.
        queryClient.invalidateQueries({ queryKey: authMeQueryOptions.queryKey }),
      ]),
  })
}

export function useDeletePasskey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${baseUrl()}/webauthn/register/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: csrfHeaders('DELETE'),
      })
      if (!res.ok) throw new Error(`Removing the passkey failed with status ${res.status}`)
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: PASSKEYS_KEY }),
        queryClient.invalidateQueries({ queryKey: authMeQueryOptions.queryKey }),
      ]),
  })
}

/** Signs in with a passkey; the server answers 204 and starts the same session a magic link does. */
// `onSuccess` is a mutation option, not a `mutate` callback: the auto-start calls `mutate` from an effect, and React
// StrictMode's remount detaches the observer, which drops callbacks passed to `mutate`.
export function usePasskeyLogin(onSuccess?: () => void) {
  return useMutation({
    onSuccess,
    mutationFn: async () => {
      const optionsJSON = await (await postJson('/webauthn/authenticate/options')).json()
      const assertion = await startAuthentication({ optionsJSON })
      await postJson('/login/webauthn', assertion)
    },
  })
}

// "Not now" on the add-a-passkey prompt is a taste of this device, not state the server acts on (ADR-0045, ADR-0030).
export const passkeyPromptDismissedKey = appPreferenceKey('passkey-prompt-dismissed')

export const isPasskeyPromptDismissed = (storage: PreferenceStorage | null) =>
  readPreference(storage, passkeyPromptDismissedKey, (raw) => (raw === true ? true : null)) === true

export const dismissPasskeyPrompt = (storage: PreferenceStorage | null) =>
  writePreference(storage, passkeyPromptDismissedKey, true)
