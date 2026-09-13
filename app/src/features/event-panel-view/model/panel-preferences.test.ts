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
    expect(readPanelPreferences(mapStorage(), 'setpoint-vt')).toEqual(defaultPanelPreferences())
    expect(defaultPanelPreferences()).toEqual({ view: 'pips', defaultExpanded: false })
  })

  it('restores what was written, per team', () => {
    const storage = mapStorage()
    writePanelPreferences(storage, 'setpoint-vt', { view: 'members', defaultExpanded: true })

    expect(readPanelPreferences(storage, 'setpoint-vt')).toEqual({
      view: 'members',
      defaultExpanded: true,
    })
    // Another team is untouched — the key is per team (ADR-0030 §4).
    expect(readPanelPreferences(storage, 'other-team')).toEqual(defaultPanelPreferences())
  })

  it('falls back to the defaults on a malformed value rather than throwing', () => {
    const storage = mapStorage({ 'tb.pref.setpoint-vt.event-panel': '{ not json' })
    expect(readPanelPreferences(storage, 'setpoint-vt')).toEqual(defaultPanelPreferences())
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
    expect(readPanelPreferences(throwing, 'setpoint-vt')).toEqual(defaultPanelPreferences())
    expect(() => writePanelPreferences(throwing, 'setpoint-vt', defaultPanelPreferences())).not.toThrow()
  })
})
