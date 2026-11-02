import { WAKING_AFTER_MS } from '@shared/ui/ColdStartSplash'

export const ESCALATE_AFTER_MS = 8_000
export const MIN_VISIBLE_MS = 800

interface WakeVisibility {
  busy: boolean
  elapsedMs: number
  shownAt: number | null
  now: number
}

export function wakeMessageFor(elapsedMs: number): string {
  return elapsedMs < ESCALATE_AFTER_MS ? 'Waking the server back up…' : 'Still on it — thanks for hanging in there'
}

export function isWakeVisible({ busy, elapsedMs, shownAt, now }: WakeVisibility): boolean {
  if (busy && elapsedMs >= WAKING_AFTER_MS) return true
  return shownAt !== null && now - shownAt < MIN_VISIBLE_MS
}
