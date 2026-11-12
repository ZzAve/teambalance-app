import type { Payment } from '@shared/api/money-pool'
import { periodPayments, rankTotals, type Topper, type TopperPeriod } from './toppers'

export interface PlaybackFrame {
  /** ISO calendar date; the ranking is as of the end of that day. */
  date: string
  ranking: Topper[]
}

/**
 * The ranking after each payment day in the period, oldest first, built in one pass over the payments
 * (running totals, one sort per day) so playback only indexes into the result.
 */
export function playbackFrames(payments: Payment[], period: TopperPeriod, today: string, nameOf: (memberId: string) => string, memberIds: readonly string[] = []): PlaybackFrame[] {
  const attributed = periodPayments(payments, period, today)
    .filter((p) => p.direction === 'In' && p.memberId)
    .reverse() // the API sends newest first
  const totals = new Map<string, number>()
  const frames: PlaybackFrame[] = []
  attributed.forEach((p, i) => {
    totals.set(p.memberId!, (totals.get(p.memberId!) ?? 0) + p.amount)
    if (attributed[i + 1]?.date !== p.date) frames.push({ date: p.date, ranking: rankTotals(totals, nameOf, memberIds) })
  })
  return frames
}

/** The frame indexes a playback visits: all of them, or only start, middle and end under reduced motion. */
export function playbackSteps(frameCount: number, reducedMotion: boolean): number[] {
  const all = Array.from({ length: frameCount }, (_, i) => i)
  if (!reducedMotion || frameCount <= 3) return all
  return [0, Math.floor((frameCount - 1) / 2), frameCount - 1]
}

/** How many places each member moved from one ranking to the next, up as positive; members who kept their rank or are new are left out. */
export function rankDeltas(previous: Topper[], next: Topper[]): Map<string, number> {
  const before = new Map(previous.map((r) => [r.memberId, r.rank]))
  const deltas = new Map<string, number>()
  for (const r of next) {
    const was = before.get(r.memberId)
    if (was !== undefined && was !== r.rank) deltas.set(r.memberId, was - r.rank)
  }
  return deltas
}
