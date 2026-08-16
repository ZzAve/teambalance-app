import { describe, expect, it } from 'vitest'
import type { Event } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { buildAffectedPreview } from './series-affected'

// Built from the shared fixture so a new field on the generated Event contract lands in one place.
// Series logic reads only ids and times; the rest is here to satisfy the type.
const event = (id: string, startTime: string): Event =>
  makeEvent({
    id,
    eventType: { id: 'et-1', name: 'Training', color: '#225C9C' },
    title: 'Training',
    startTime,
    endTime: startTime,
    recurringGroup: 'group-1',
    attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
  })

// Four occurrences, deliberately out of order to prove chronological sorting.
const siblings = [
  event('c', '2026-09-15T18:30:00Z'),
  event('a', '2026-09-01T18:30:00Z'),
  event('d', '2026-09-22T18:30:00Z'),
  event('b', '2026-09-08T18:30:00Z'),
]

describe('buildAffectedPreview', () => {
  it('returns null when the current occurrence is not among the siblings', () => {
    expect(buildAffectedPreview(siblings, 'missing', 'ALL')).toBeNull()
  })

  it('orders occurrences chronologically and flags the current one', () => {
    const preview = buildAffectedPreview(siblings, 'b', 'THIS')!
    expect(preview.nodes.map((n) => n.id)).toEqual(['a', 'b', 'c', 'd'])
    expect(preview.nodes.filter((n) => n.isCurrent).map((n) => n.id)).toEqual(['b'])
  })

  it('THIS affects only the current occurrence', () => {
    const preview = buildAffectedPreview(siblings, 'b', 'THIS')!
    expect(preview.affectedCount).toBe(1)
    expect(preview.total).toBe(4)
    expect(preview.nodes.filter((n) => n.affected).map((n) => n.id)).toEqual(['b'])
  })

  it('THIS_AND_FOLLOWING affects the current occurrence and every later one', () => {
    const preview = buildAffectedPreview(siblings, 'b', 'THIS_AND_FOLLOWING')!
    expect(preview.affectedCount).toBe(3)
    expect(preview.nodes.filter((n) => n.affected).map((n) => n.id)).toEqual(['b', 'c', 'd'])
    // The earlier occurrence is untouched.
    expect(preview.nodes.find((n) => n.id === 'a')!.affected).toBe(false)
  })

  it('ALL affects every occurrence regardless of which one is current', () => {
    const preview = buildAffectedPreview(siblings, 'c', 'ALL')!
    expect(preview.affectedCount).toBe(4)
    expect(preview.nodes.every((n) => n.affected)).toBe(true)
  })

  it('THIS_AND_FOLLOWING on the last occurrence affects only it', () => {
    const preview = buildAffectedPreview(siblings, 'd', 'THIS_AND_FOLLOWING')!
    expect(preview.affectedCount).toBe(1)
    expect(preview.nodes.filter((n) => n.affected).map((n) => n.id)).toEqual(['d'])
  })

  it('a single-occurrence series is fully affected by any scope', () => {
    const one = [event('solo', '2026-09-01T18:30:00Z')]
    for (const scope of ['THIS', 'THIS_AND_FOLLOWING', 'ALL'] as const) {
      const preview = buildAffectedPreview(one, 'solo', scope)!
      expect(preview.affectedCount).toBe(1)
      expect(preview.total).toBe(1)
    }
  })
})
