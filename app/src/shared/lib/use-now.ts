import { useEffect, useState } from 'react'

const ONE_MINUTE = 60_000

/**
 * A clock that actually ticks. Reading `new Date()` during render freezes time until something
 * unrelated re-renders, which on a screen left open overnight means yesterday's event still says
 * "Tomorrow" and a countdown stands still. One minute is the coarsest tick that keeps a
 * minutes-resolution countdown honest.
 *
 * Returns one `Date` per tick, so every consumer on the page reads the same instant and their
 * answers cannot disagree.
 */
export function useNow(intervalMs: number = ONE_MINUTE): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
