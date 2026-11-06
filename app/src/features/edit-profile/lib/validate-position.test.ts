import { describe, expect, it, afterEach } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import type { Position } from '@shared/api/positions'
import { validatePosition } from './validate-position'

const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
]

describe('validatePosition', () => {
  it('accepts a null selection when the team has no positions', () => {
    expect(validatePosition([], null)).toBeNull()
  })

  it('requires a selection when positions are available', () => {
    expect(validatePosition(POSITIONS, null)).toMatch(/select a position/i)
  })

  it('accepts a chosen position when positions are available', () => {
    expect(validatePosition(POSITIONS, 'p1')).toBeNull()
  })
})

describe('validatePosition in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says its error in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(validatePosition(POSITIONS, null)).toBe('Kies een positie.')
  })
})
