import { describe, expect, it } from 'vitest'
import {
  dismissPasskeyPrompt,
  isPasskeyPromptDismissed,
  passkeyErrorKey,
  passkeyPromptDismissedKey,
} from './passkeys'

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
