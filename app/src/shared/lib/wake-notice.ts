import { WAKING_AFTER_MS } from '@shared/ui/ColdStartSplash'
import { i18n } from '@shared/i18n/i18n'

export const ESCALATE_AFTER_MS = 8_000
export const MIN_VISIBLE_MS = 800

interface WakeState {
  startedAt: number | null
  idleSince: number | null
  elapsedMs: number
  show: boolean
}

export const initialWakeState: WakeState = { startedAt: null, idleSince: null, elapsedMs: 0, show: false }

/**
 * Requests form one continuous wait while the notice is showing, until the app has been idle for
 * MIN_VISIBLE_MS. During that idle window the start time and last elapsed time are kept, so the
 * notice neither disappears nor changes its copy, and a request that follows soon after counts toward
 * the same wait. Before the notice shows, any idle moment ends the wait.
 */
export function nextWakeState(prev: WakeState, { busy, now }: { busy: boolean; now: number }): WakeState {
  if (busy) {
    const startedAt = prev.startedAt ?? now
    const elapsedMs = now - startedAt
    return { startedAt, idleSince: null, elapsedMs, show: elapsedMs >= WAKING_AFTER_MS }
  }
  if (!prev.show) return initialWakeState
  const idleSince = prev.idleSince ?? now
  if (now - idleSince >= MIN_VISIBLE_MS) return initialWakeState
  return { ...prev, idleSince }
}

export function wakeMessageFor(elapsedMs: number): string {
  return i18n.t(elapsedMs < ESCALATE_AFTER_MS ? 'sharedLib.wake.first' : 'sharedLib.wake.second')
}
