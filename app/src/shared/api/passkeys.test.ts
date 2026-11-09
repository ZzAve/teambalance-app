import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  dismissPasskeyPrompt,
  forgetIfUnknownPasskey,
  isPasskeyPromptDismissed,
  passkeyErrorKey,
  passkeyPromptDismissedKey,
} from './passkeys'
import { lastSignInMethodKey, readLastSignInMethod } from './last-sign-in-method'

describe('passkeyErrorKey', () => {
  it.each([
    ['the person cancelled', { name: 'NotAllowedError' }, 'passkeys.error.cancelled'],
    ['the ceremony was aborted', { name: 'WebAuthnError', code: 'ERROR_CEREMONY_ABORTED' }, 'passkeys.error.cancelled'],
    ['the device already has one (browser)', { name: 'InvalidStateError' }, 'passkeys.error.alreadyRegistered'],
    [
      'the device already has one (library)',
      { name: 'WebAuthnError', code: 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED' },
      'passkeys.error.alreadyRegistered',
    ],
    ['any other error', new Error('boom'), 'passkeys.error.failed'],
    ['something that is not an error', 'boom', 'passkeys.error.failed'],
    ['nothing', undefined, 'passkeys.error.failed'],
  ])('%s', (_label, error, key) => {
    expect(passkeyErrorKey(error)).toBe(key)
  })
})

describe('the add-a-passkey prompt dismissal', () => {
  const memoryStorage = () => {
    const map = new Map<string, string>()
    return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) }
  }

  it('is not dismissed until the person says not now, then stays dismissed', () => {
    const storage = memoryStorage()
    expect(isPasskeyPromptDismissed(storage)).toBe(false)
    dismissPasskeyPrompt(storage)
    expect(isPasskeyPromptDismissed(storage)).toBe(true)
  })

  it('reads missing storage and malformed values as not dismissed', () => {
    expect(isPasskeyPromptDismissed(null)).toBe(false)
    const storage = memoryStorage()
    storage.setItem(passkeyPromptDismissedKey, 'not json')
    expect(isPasskeyPromptDismissed(storage)).toBe(false)
    storage.setItem(passkeyPromptDismissedKey, '"yes"')
    expect(isPasskeyPromptDismissed(storage)).toBe(false)
  })
})

describe('forgetIfUnknownPasskey', () => {
  afterEach(() => vi.unstubAllGlobals())

  const storageWithPasskeyLast = () => {
    const map = new Map<string, string>([[lastSignInMethodKey, JSON.stringify('passkey')]])
    return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) }
  }
  const failure = (body: string) => Object.assign(new Error('401'), { response: new Response(body, { status: 401 }) })

  it('drops an unknown passkey from the browser and forgets the last method', async () => {
    const signalUnknownCredential = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('PublicKeyCredential', { signalUnknownCredential })
    const storage = storageWithPasskeyLast()

    await forgetIfUnknownPasskey(failure('{"error":"unknown_passkey"}'), 'app.example', 'cred-1', storage)

    expect(signalUnknownCredential).toHaveBeenCalledWith({ rpId: 'app.example', credentialId: 'cred-1' })
    expect(readLastSignInMethod(storage)).toBeNull()
  })

  it('keeps the passkey on any other failure', async () => {
    const signalUnknownCredential = vi.fn()
    vi.stubGlobal('PublicKeyCredential', { signalUnknownCredential })
    const storage = storageWithPasskeyLast()

    await forgetIfUnknownPasskey(failure(''), 'app.example', 'cred-1', storage)
    await forgetIfUnknownPasskey(new Error('network'), 'app.example', 'cred-1', storage)

    expect(signalUnknownCredential).not.toHaveBeenCalled()
    expect(readLastSignInMethod(storage)).toBe('passkey')
  })

  it('still forgets the last method in a browser without the Signal API', async () => {
    vi.stubGlobal('PublicKeyCredential', {})
    const storage = storageWithPasskeyLast()

    await forgetIfUnknownPasskey(failure('{"error":"unknown_passkey"}'), 'app.example', 'cred-1', storage)

    expect(readLastSignInMethod(storage)).toBeNull()
  })
})
