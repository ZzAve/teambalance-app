import { describe, expect, it } from 'vitest'
import {
  lastSignInMethodKey,
  markSkipPasskeyAutoStart,
  readLastSignInMethod,
  shouldAutoStartPasskey,
  takeSkipPasskeyAutoStart,
  writeLastSignInMethod,
} from './last-sign-in-method'

const memoryStorage = () => {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  }
}

describe('the last sign-in method', () => {
  it('reads back what was written', () => {
    const storage = memoryStorage()
    expect(readLastSignInMethod(storage)).toBeNull()
    writeLastSignInMethod(storage, 'passkey')
    expect(readLastSignInMethod(storage)).toBe('passkey')
    writeLastSignInMethod(storage, 'email')
    expect(readLastSignInMethod(storage)).toBe('email')
  })

  it.each(['"foo"', '42', 'not json', 'null'])('reads %s as nothing', (stored) => {
    const storage = memoryStorage()
    storage.setItem(lastSignInMethodKey, stored)
    expect(readLastSignInMethod(storage)).toBeNull()
  })

  it('reads missing storage as nothing and does not throw on write', () => {
    expect(readLastSignInMethod(null)).toBeNull()
    expect(() => writeLastSignInMethod(null, 'email')).not.toThrow()
  })
})

describe('the skip-once flag', () => {
  it('is taken once, then gone', () => {
    const storage = memoryStorage()
    expect(takeSkipPasskeyAutoStart(storage)).toBe(false)
    markSkipPasskeyAutoStart(storage)
    expect(takeSkipPasskeyAutoStart(storage)).toBe(true)
    expect(takeSkipPasskeyAutoStart(storage)).toBe(false)
  })

  it('is false without storage', () => {
    expect(takeSkipPasskeyAutoStart(null)).toBe(false)
    expect(() => markSkipPasskeyAutoStart(null)).not.toThrow()
  })
})

describe('shouldAutoStartPasskey', () => {
  const all = { lastMethod: 'passkey', offered: true, supported: true, skipOnce: false } as const

  it('starts when a passkey was last used, is offered and supported, and nothing skips it', () => {
    expect(shouldAutoStartPasskey(all)).toBe(true)
  })

  it.each([
    ['email was last', { lastMethod: 'email' }],
    ['nothing was last', { lastMethod: null }],
    ['passkeys are not offered', { offered: false }],
    ['the browser does not support them', { supported: false }],
    ['the person just logged out', { skipOnce: true }],
  ] as const)('does not start when %s', (_label, override) => {
    expect(shouldAutoStartPasskey({ ...all, ...override })).toBe(false)
  })
})
