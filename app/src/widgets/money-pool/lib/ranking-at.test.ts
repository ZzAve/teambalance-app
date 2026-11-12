import { describe, expect, it } from 'vitest'
import type { Payment } from '@shared/api/money-pool'
import { playbackFrames, playbackSteps, rankDeltas } from './ranking-at'
import { toppers } from './toppers'

const pay = (date: string, amount: number, memberId?: string, direction: Payment['direction'] = 'In'): Payment => ({
  id: `${date}-${amount}-${memberId}`,
  date,
  name: 'x',
  amount,
  direction,
  memberId,
  counterpartyName: undefined,
  receiptVersion: undefined,
})
const nameOf = (id: string) => id.toUpperCase()
const TODAY = '2026-11-09'
// Newest first, like the API.
const PAYMENTS = [
  pay('2026-10-20', 300, 'b'),
  pay('2026-10-20', 100, 'a'),
  pay('2026-10-10', 250, 'a'),
  pay('2026-10-05', 50, 'c'),
  pay('2026-10-05', 99, undefined),
  pay('2026-10-04', 80, 'a', 'Out'),
]

describe('playbackFrames', () => {
  it('has one frame per day with attributed income, oldest first', () => {
    expect(playbackFrames(PAYMENTS, 'season', TODAY, nameOf).map((f) => f.date)).toEqual(['2026-10-05', '2026-10-10', '2026-10-20'])
  })

  it('never lowers a member total from one frame to the next', () => {
    const frames = playbackFrames(PAYMENTS, 'season', TODAY, nameOf)
    const totalOf = (i: number, id: string) => frames[i].ranking.find((r) => r.memberId === id)?.total ?? 0
    for (let i = 1; i < frames.length; i++) for (const id of ['a', 'b', 'c']) expect(totalOf(i, id)).toBeGreaterThanOrEqual(totalOf(i - 1, id))
  })

  it('ends on the same ranking as toppers', () => {
    expect(playbackFrames(PAYMENTS, 'season', TODAY, nameOf).at(-1)?.ranking).toEqual(toppers(PAYMENTS, 'season', TODAY, nameOf).ranking)
  })

  it('respects the period', () => {
    expect(playbackFrames(PAYMENTS, 'last30', TODAY, nameOf).map((f) => f.date)).toEqual(['2026-10-10', '2026-10-20'])
  })

  it('lists roster members without money in every frame, at zero', () => {
    const frames = playbackFrames(PAYMENTS, 'season', TODAY, nameOf, ['z'])
    for (const f of frames) expect(f.ranking.at(-1)).toEqual(expect.objectContaining({ memberId: 'z', total: 0 }))
    expect(frames[0].ranking.map((r) => r.memberId)).toEqual(['c', 'z'])
  })

  it('has no frames without attributed income', () => {
    expect(playbackFrames([pay('2026-10-01', 5)], 'season', TODAY, nameOf)).toEqual([])
  })
})

describe('playbackSteps', () => {
  it('visits every frame normally', () => {
    expect(playbackSteps(4, false)).toEqual([0, 1, 2, 3])
  })

  it('visits start, middle and end under reduced motion', () => {
    expect(playbackSteps(10, true)).toEqual([0, 4, 9])
    expect(playbackSteps(5, true)).toEqual([0, 2, 4])
    expect(playbackSteps(3, true)).toEqual([0, 1, 2])
    expect(playbackSteps(1, true)).toEqual([0])
    expect(playbackSteps(0, true)).toEqual([])
  })
})

describe('rankDeltas', () => {
  const at = (memberId: string, rank: number) => ({ memberId, total: 0, rank })

  it('gives each member who moved the number of places, up as positive', () => {
    const deltas = rankDeltas([at('a', 1), at('b', 2), at('c', 3)], [at('c', 1), at('a', 2), at('b', 3)])
    expect(deltas).toEqual(new Map([['c', 2], ['a', -1], ['b', -1]]))
  })

  it('leaves out members who kept their rank, and members new to the ranking', () => {
    expect(rankDeltas([at('a', 1), at('b', 2)], [at('a', 1), at('b', 2), at('d', 3)])).toEqual(new Map())
  })
})
