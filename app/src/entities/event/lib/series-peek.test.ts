import { describe, expect, it } from 'vitest'
import type { Event } from '@shared/api/events'
import { makeEvent } from '@shared/testing/event-fixtures'
import { buildSeriesPeek } from './series-peek'

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

// Five occurrences, deliberately out of order to prove sorting.
const siblings = [
  event('c', '2026-09-15T18:30:00Z'),
  event('a', '2026-09-01T18:30:00Z'),
  event('e', '2026-09-29T18:30:00Z'),
  event('b', '2026-09-08T18:30:00Z'),
  event('d', '2026-09-22T18:30:00Z'),
]

describe('buildSeriesPeek', () => {
  it('returns null for a single (non-series) event', () => {
    expect(buildSeriesPeek([event('a', '2026-09-01T18:30:00Z')], 'a')).toBeNull()
  })

  it('returns null when the current event is not among the siblings', () => {
    expect(buildSeriesPeek(siblings, 'missing')).toBeNull()
  })

  it('shows first-two + last-two with a "+N more" gap for a long series', () => {
    const peek = buildSeriesPeek(siblings, 'c')!
    expect(peek.total).toBe(5)
    expect(peek.head.map((e) => e.id)).toEqual(['a', 'b'])
    expect(peek.tail.map((e) => e.id)).toEqual(['d', 'e'])
    expect(peek.hiddenCount).toBe(1) // 'c' sits in the collapsed middle
  })

  it('reports the current occurrence position within the sorted series', () => {
    expect(buildSeriesPeek(siblings, 'a')!.currentPosition).toBe(1)
    expect(buildSeriesPeek(siblings, 'c')!.currentPosition).toBe(3)
    expect(buildSeriesPeek(siblings, 'e')!.currentPosition).toBe(5)
  })

  it('marks the current occurrence when it is visible in the head or tail', () => {
    const peek = buildSeriesPeek(siblings, 'a')!
    expect(peek.head.find((e) => e.id === 'a')?.isCurrent).toBe(true)
    expect(peek.head.find((e) => e.id === 'b')?.isCurrent).toBe(false)
  })

  it('shows every occurrence inline with no gap for a short series', () => {
    const short = [event('a', '2026-09-01T18:30:00Z'), event('b', '2026-09-08T18:30:00Z'), event('c', '2026-09-15T18:30:00Z')]
    const peek = buildSeriesPeek(short, 'b')!
    expect(peek.head.map((e) => e.id)).toEqual(['a', 'b', 'c'])
    expect(peek.tail).toEqual([])
    expect(peek.hiddenCount).toBe(0)
  })
})
