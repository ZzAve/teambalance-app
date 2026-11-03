import { useEffect, useState } from 'react'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { initialWakeState, nextWakeState } from './wake-notice'

const TICK_MS = 500

/**
 * Whether requests have been waiting long enough to tell the user the backend may be waking up.
 * Counts every in-flight query and mutation except offline-paused ones; the timing rules live in
 * `nextWakeState`.
 */
export function useWakeNotice(): { show: boolean; elapsedMs: number } {
  const busy = useIsFetching() + useIsMutating({ predicate: (m) => !m.state.isPaused }) > 0
  const [state, setState] = useState(initialWakeState)
  const active = busy || state.startedAt !== null

  useEffect(() => {
    if (!active) return
    const step = () => setState((prev) => nextWakeState(prev, { busy, now: Date.now() }))
    const first = setTimeout(step)
    const timer = setInterval(step, TICK_MS)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [busy, active])

  return { show: state.show, elapsedMs: state.elapsedMs }
}
