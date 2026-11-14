import type { Payment } from '@shared/api/money-pool'
import { countsAsIncoming, periodPayments, rankTotals, type Topper, type TopperPeriod } from './toppers'

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
    .filter((p) => countsAsIncoming(p) && p.memberId)
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
