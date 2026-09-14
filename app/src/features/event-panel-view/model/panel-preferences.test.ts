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
  it('reads a stored pair back', () => {
    expect(parsePanelPreferences({ view: 'members', defaultExpanded: true })).toEqual({
      view: 'members',
      defaultExpanded: true,
    })
  })

  it('falls back to pips for a view it does not recognise', () => {
    // A third view that has since gone, or a hand-edited value: render the default, not nothing.
    expect(parsePanelPreferences({ view: 'names', defaultExpanded: true })).toEqual({
      view: 'pips',
      defaultExpanded: true,
    })
  })

  it('is lenient per field — a missing one costs only itself', () => {
    expect(parsePanelPreferences({ view: 'members' })).toEqual({
      view: 'members',
      defaultExpanded: false,
    })
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
    expect(defaultPanelPreferences()).toEqual({ view: 'pips', defaultExpanded: false })
  })

  it('restores what was written', () => {
    const storage = mapStorage()
    writePanelPreferences(storage, { view: 'members', defaultExpanded: true })

    expect(readPanelPreferences(storage)).toEqual({ view: 'members', defaultExpanded: true })
  })

  // The scope, which is the half this got wrong first time round. A display preference is a taste,
  // not a position: it follows the member into every team, the way `tb-theme` does. Team-scoping it
  // meant entering a second team looked like the setting had been forgotten.
  it('is stored app-wide, under no team', () => {
    const storage = mapStorage()
    writePanelPreferences(storage, { view: 'members', defaultExpanded: true })

    expect(storage.getItem('tb.pref.event-panel')).toBe('{"view":"members","defaultExpanded":true}')
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
