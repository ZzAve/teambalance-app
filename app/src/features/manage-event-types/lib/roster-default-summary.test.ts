import { describe, expect, it } from 'vitest'
import type { RosterRequirement } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'
import { rosterDefaultSummary } from './roster-default-summary'

const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
]

const req = (overrides: Partial<RosterRequirement> = {}): RosterRequirement => ({
  trackRoster: true,
  totalTarget: undefined,
  positionTargets: [],
  ...overrides,
})

describe('rosterDefaultSummary', () => {
  it('says so when the type tracks no roster', () => {
    expect(rosterDefaultSummary(req({ trackRoster: false }), POSITIONS)).toBe('No roster')
  })

  // The state most easily mistaken for a bug: tracked, but nothing to fall short of. It has to say
  // what it is rather than render as an empty cell.
  it('names the tracked-but-unrequired state explicitly', () => {
    expect(rosterDefaultSummary(req(), POSITIONS)).toBe('Tracked, nothing required')
  })

  it('lists the per-position counts', () => {
    const r = req({ positionTargets: [{ positionId: 'p1', count: 2 }, { positionId: 'p2', count: 1 }] })
    expect(rosterDefaultSummary(r, POSITIONS)).toBe('2 Setter · 1 Libero')
  })

  it('appends the total after the positions', () => {
    const r = req({ totalTarget: 12, positionTargets: [{ positionId: 'p1', count: 2 }] })
    expect(rosterDefaultSummary(r, POSITIONS)).toBe('2 Setter · 12 total')
  })

  it('shows a lone total on its own', () => {
    expect(rosterDefaultSummary(req({ totalTarget: 8 }), POSITIONS)).toBe('8 total')
  })

  // A target can outlive its position for the instant between the delete's two writes. The summary
  // skips it rather than printing a raw uuid at an admin.
  it('skips a target whose position no longer exists', () => {
    const r = req({ positionTargets: [{ positionId: 'gone', count: 2 }, { positionId: 'p1', count: 1 }] })
    expect(rosterDefaultSummary(r, POSITIONS)).toBe('1 Setter')
  })

  it('falls back to the tracked-but-unrequired wording when every target is stale', () => {
    const r = req({ positionTargets: [{ positionId: 'gone', count: 2 }] })
    expect(rosterDefaultSummary(r, POSITIONS)).toBe('Tracked, nothing required')
  })
})
