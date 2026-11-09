import {
  appPreferenceKey,
  readPreference,
  writePreference,
  type PreferenceStorage,
} from '@shared/preferences/preferences'

// Which way this device signed in last (ADR-0045): a taste of the device, not state the server acts on (ADR-0030).
export type SignInMethod = 'passkey' | 'email'

export const lastSignInMethodKey = appPreferenceKey('last-sign-in-method')

export const readLastSignInMethod = (storage: PreferenceStorage | null): SignInMethod | null =>
  readPreference(storage, lastSignInMethodKey, (raw) => (raw === 'passkey' || raw === 'email' ? raw : null))

export const writeLastSignInMethod = (storage: PreferenceStorage | null, method: SignInMethod): void =>
  writePreference(storage, lastSignInMethodKey, method)

/** One-shot flag in sessionStorage: set on an explicit logout so /login does not start the passkey ceremony at once. */
export const SKIP_PASSKEY_AUTOSTART = 'tb.skip-passkey-autostart'

type OneShotStorage = PreferenceStorage & { removeItem: (key: string) => void }

export function markSkipPasskeyAutoStart(storage: OneShotStorage | null): void {
  try {
    storage?.setItem(SKIP_PASSKEY_AUTOSTART, '1')
  } catch {
    // Storage unavailable: the auto-start just is not skipped.
  }
}

export function takeSkipPasskeyAutoStart(storage: OneShotStorage | null): boolean {
  try {
    const set = (storage?.getItem(SKIP_PASSKEY_AUTOSTART) ?? null) !== null
    storage?.removeItem(SKIP_PASSKEY_AUTOSTART)
    return set
  } catch {
    return false
  }
}

/** Pure decision: start the passkey ceremony on /login by itself. */
export const shouldAutoStartPasskey = (input: {
  lastMethod: SignInMethod | null
  offered: boolean
  supported: boolean
  skipOnce: boolean
}): boolean => input.lastMethod === 'passkey' && input.offered && input.supported && !input.skipOnce

/** `sessionStorage` where there is one, `null` where reading it at all throws. */
export function browserSessionStorage(): OneShotStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage
  } catch {
    return null
  }
}
