import { describe, expect, it } from 'vitest'
import {
  readPreference,
  teamPreferenceKey,
  writePreference,
  type PreferenceStorage,
} from './preferences'

// The shared local-preferences mechanism (ADR-0030 §4). Pure read/write over a {getItem,setItem}
// pair, so the whole round trip — including the private-mode paths a browser will not reproduce on
// demand — is a plain unit. The filter-specific shape on top of it is covered next door in
// features/filter-event-types/model/filter-preferences.test.ts.

/** Minimal in-memory Storage stand-in, so read/write assertions never depend on test ordering. */
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    read: (key: string) => data.get(key) ?? null,
  }
}

/** Storage that throws on every access — Safari private mode, blocked cookies, quota. */
const throwingStorage: PreferenceStorage = {
  getItem: () => {
    throw new Error('storage disabled')
  },
  setItem: () => {
    throw new Error('quota exceeded')
  },
}

const asNumber = (raw: unknown) => (typeof raw === 'number' ? raw : null)

describe('teamPreferenceKey', () => {
  it('scopes the key to the team, so two teams keep separate preferences', () => {
    expect(teamPreferenceKey('setpoint-vt', 'event-filters')).not.toBe(
      teamPreferenceKey('vc-zaanstad', 'event-filters'),
    )
  })

  it('keeps the tb namespace', () => {
    expect(teamPreferenceKey('setpoint-vt', 'event-filters')).toBe('tb.pref.setpoint-vt.event-filters')
  })
})

describe('readPreference', () => {
  it('round-trips a value through the same storage', () => {
    const storage = fakeStorage()
    writePreference(storage, 'k', { showPast: true, ids: ['a'] })
    expect(readPreference(storage, 'k', (raw) => raw)).toEqual({ showPast: true, ids: ['a'] })
  })

  it('returns null when nothing is stored', () => {
    expect(readPreference(fakeStorage(), 'k', asNumber)).toBeNull()
  })

  it('returns null on malformed JSON rather than throwing', () => {
    expect(readPreference(fakeStorage({ k: '{not json' }), 'k', asNumber)).toBeNull()
  })

  it('returns null when parse rejects the shape (a value from another build)', () => {
    expect(readPreference(fakeStorage({ k: '"seven"' }), 'k', asNumber)).toBeNull()
  })

  it('returns null when parse itself throws', () => {
    expect(
      readPreference(fakeStorage({ k: '1' }), 'k', () => {
        throw new Error('bad shape')
      }),
    ).toBeNull()
  })

  it('returns null when storage is missing or throws (private mode)', () => {
    expect(readPreference(null, 'k', asNumber)).toBeNull()
    expect(readPreference(throwingStorage, 'k', asNumber)).toBeNull()
  })
})

describe('writePreference', () => {
  it('stores the value as JSON under the given key', () => {
    const storage = fakeStorage()
    writePreference(storage, 'k', [1, 2])
    expect(storage.read('k')).toBe('[1,2]')
  })

  it('survives storage being missing or throwing (private mode, quota)', () => {
    expect(() => writePreference(null, 'k', 1)).not.toThrow()
    expect(() => writePreference(throwingStorage, 'k', 1)).not.toThrow()
  })
})
