import { useEffect, useState } from 'react'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { isWakeVisible } from './wake-notice'

const TICK_MS = 500

/**
 * Whether requests have been waiting long enough to tell the user the backend may be waking up.
 * Counts every in-flight query and mutation except offline-paused ones. Elapsed time is measured
 * from the moment the count left zero, so overlapping requests measure from the oldest one.
 */
export function useWakeNotice(): { show: boolean; elapsedMs: number } {
  const busy = useIsFetching() + useIsMutating({ predicate: (m) => !m.state.isPaused }) > 0
  const [elapsedMs, setElapsedMs] = useState(0)
  const [shownAt, setShownAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!busy) return
    const startedAt = Date.now()
    const timer = setInterval(() => {
      const current = Date.now()
      setNow(current)
      setElapsedMs(current - startedAt)
    }, TICK_MS)
    return () => {
      clearInterval(timer)
      setElapsedMs(0)
    }
  }, [busy])

  const show = isWakeVisible({ busy, elapsedMs, shownAt, now })
  if (show && shownAt === null) setShownAt(now)
  if (!show && shownAt !== null) setShownAt(null)

  const holding = !busy && shownAt !== null
  useEffect(() => {
    if (!holding) return
    const timer = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(timer)
  }, [holding])

  return { show, elapsedMs }
}
