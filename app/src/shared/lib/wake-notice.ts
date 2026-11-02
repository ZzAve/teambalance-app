import { WAKING_AFTER_MS } from '@shared/ui/ColdStartSplash'

export const ESCALATE_AFTER_MS = 8_000
export const MIN_VISIBLE_MS = 800

export interface WakeState {
  startedAt: number | null
  idleSince: number | null
  elapsedMs: number
  show: boolean
}

export const initialWakeState: WakeState = { startedAt: null, idleSince: null, elapsedMs: 0, show: false }

/**
 * Requests form one continuous wait until the app has been idle for MIN_VISIBLE_MS. During that idle
 * window the start time and last elapsed time are kept, so a shown notice neither disappears nor
 * changes its copy, and a request that follows soon after counts toward the same wait.
 */
export function nextWakeState(prev: WakeState, { busy, now }: { busy: boolean; now: number }): WakeState {
  if (busy) {
    const startedAt = prev.startedAt ?? now
    const elapsedMs = now - startedAt
    return { startedAt, idleSince: null, elapsedMs, show: elapsedMs >= WAKING_AFTER_MS }
  }
  if (prev.startedAt === null) return initialWakeState
  const idleSince = prev.idleSince ?? now
  if (now - idleSince >= MIN_VISIBLE_MS) return initialWakeState
  return { ...prev, idleSince }
}

export function wakeMessageFor(elapsedMs: number): string {
  return elapsedMs < ESCALATE_AFTER_MS ? 'Waking the server back up…' : 'Still on it — thanks for hanging in there'
}
