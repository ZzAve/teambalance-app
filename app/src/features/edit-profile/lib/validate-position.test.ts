import { describe, expect, it } from 'vitest'
import type { Position } from '@shared/api/positions'
import { validatePosition } from './validate-position'

const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
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
