import { describe, expect, it } from 'vitest'
import { groupForPosition } from './picker-groups'

// Pure ordering, so a plain unit is the lowest layer that proves it. What the headings look like is
// the picker's story.

const LIBERO = { id: 'pos-libero', label: 'Libero' }
const SETTER = { id: 'pos-setter', label: 'Setter' }

// The Team's list as the server returns it: ordered by name.
const TEAM_LIST = [
  { id: 'sub-anna', name: 'Anna Smit', position: SETTER },
  { id: 'sub-jan', name: 'Jan de Vries', position: LIBERO },
  { id: 'sub-mila', name: 'Mila Jansen', position: undefined },
  { id: 'sub-pim', name: 'Pim Kok', position: LIBERO },
]

describe('groupForPosition', () => {
  it('puts the Substitutes who play the Position first and everyone else under Others, each in list order', () => {
    const groups = groupForPosition(TEAM_LIST, 'pos-libero')
    expect(groups.plays.map((s) => s.id)).toEqual(['sub-jan', 'sub-pim'])
    expect(groups.others.map((s) => s.id)).toEqual(['sub-anna', 'sub-mila'])
  })

  it('leaves the first group empty when nobody on the list plays the Position', () => {
    const groups = groupForPosition(TEAM_LIST, 'pos-middle')
    expect(groups.plays).toEqual([])
    expect(groups.others).toHaveLength(4)
  })
})
