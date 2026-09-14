import { describe, expect, it } from 'vitest'
import {
  defaultPanelPreferences,
  parsePanelPreferences,
  readPanelPreferences,
  writePanelPreferences,
} from './panel-preferences'
import type { PreferenceStorage } from '@shared/preferences/preferences'

// A Map is the whole storage contract (shared/preferences), so a round trip is a plain unit.
const mapStorage = (entries: Record<string, string> = {}): PreferenceStorage => {
  const map = new Map(Object.entries(entries))
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  }
}

describe('parsePanelPreferences', () => {
  it('reads a stored value back', () => {
    expect(parsePanelPreferences({ defaultExpanded: true })).toEqual({ defaultExpanded: true })
  })

  it('ignores a field a previous build wrote — here the retired pips-or-people view', () => {
    expect(parsePanelPreferences({ view: 'members', defaultExpanded: true })).toEqual({
      defaultExpanded: true,
    })
  })

  it('is lenient per field — a missing one costs only itself', () => {
    expect(parsePanelPreferences({})).toEqual({ defaultExpanded: false })
  })

  it('rejects anything that is not an object', () => {
    expect(parsePanelPreferences('members')).toBeNull()
    expect(parsePanelPreferences(['members'])).toBeNull()
    expect(parsePanelPreferences(null)).toBeNull()
  })
})

describe('readPanelPreferences', () => {
  it('defaults to the behaviour of a member who never touched the control', () => {
    expect(readPanelPreferences(mapStorage())).toEqual(defaultPanelPreferences())
    expect(defaultPanelPreferences()).toEqual({ defaultExpanded: false })
  })

  it('restores what was written', () => {
    const storage = mapStorage()
    writePanelPreferences(storage, { defaultExpanded: true })

    expect(readPanelPreferences(storage)).toEqual({ defaultExpanded: true })
  })

  // The scope, which is the half this got wrong first time round. A display preference is a taste,
  // not a position: it follows the member into every team, the way `tb-theme` does. Team-scoping it
  // meant entering a second team looked like the setting had been forgotten.
  it('is stored app-wide, under no team', () => {
    const storage = mapStorage()
    writePanelPreferences(storage, { defaultExpanded: true })

    expect(storage.getItem('tb.pref.event-panel')).toBe('{"defaultExpanded":true}')
    expect(storage.getItem('tb.pref.setpoint-vt.event-panel')).toBeNull()
  })

  it('falls back to the defaults on a malformed value rather than throwing', () => {
    const storage = mapStorage({ 'tb.pref.event-panel': '{ not json' })
    expect(readPanelPreferences(storage)).toEqual(defaultPanelPreferences())
  })

  it('survives storage that refuses to be read', () => {
    const throwing: PreferenceStorage = {
      getItem: () => {
        throw new Error('private mode')
      },
      setItem: () => {
        throw new Error('private mode')
      },
    }
    expect(readPanelPreferences(throwing)).toEqual(defaultPanelPreferences())
    expect(() => writePanelPreferences(throwing, defaultPanelPreferences())).not.toThrow()
  })
})
