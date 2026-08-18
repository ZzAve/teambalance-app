import { describe, expect, it } from 'vitest'
import { makeEvent } from '@shared/testing/event-fixtures'
import { groupByType } from './group-by-type'

const TRAINING = { id: 'et-training', name: 'Training', color: '#22c55e' }
const MATCH = { id: 'et-match', name: 'Match', color: '#3b82f6' }
const SOCIAL = { id: 'et-social', name: 'Social', color: '#f59e0b' }

const evt = (id: string, eventType: typeof TRAINING) => makeEvent({ id, eventType })

describe('groupByType', () => {
  it('returns no groups for an empty batch', () => {
    expect(groupByType([])).toEqual([])
  })

  it('gives each type its own group', () => {
    const groups = groupByType([evt('a', TRAINING), evt('b', MATCH), evt('c', TRAINING)])
    expect(groups.map((g) => [g.typeName, g.events.length])).toEqual([['Training', 2], ['Match', 1]])
  })

  it('orders by size, so the biggest commitment leads', () => {
    const groups = groupByType([evt('a', MATCH), evt('b', TRAINING), evt('c', TRAINING), evt('d', TRAINING)])
    expect(groups.map((g) => g.typeName)).toEqual(['Training', 'Match'])
  })

  it('breaks a size tie by name, so the row does not reshuffle', () => {
    expect(groupByType([evt('a', SOCIAL), evt('b', MATCH)]).map((g) => g.typeName))
      .toEqual(['Match', 'Social'])
  })

  it('keeps every event of a type in its group', () => {
    const groups = groupByType([evt('a', TRAINING), evt('b', TRAINING)])
    expect(groups[0].events.map((e) => e.id)).toEqual(['a', 'b'])
  })
})
