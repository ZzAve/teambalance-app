import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

/** Set on <html> while a transition runs; global.css names the cards and hero only under it. */
const ACTIVE_CLASS = 'list-motion'

function canAnimate(): boolean {
  return (
    typeof document.startViewTransition === 'function' &&
    !(typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  )
}

/**
 * The value to render, committed inside a view transition when its signature changes.
 * A value whose signature is the one on screen passes through at once. A null signature (nothing
 * stable to animate from or to, such as a skeleton) and an unavailable API or reduced motion commit
 * the value directly. The committed value is always the latest one, also when changes follow each
 * other faster than a transition runs.
 */
export function useViewTransitionValue<T>(value: T, signature: string | null): T {
  const [shown, setShown] = useState({ value, signature })
  const latest = useRef({ value, signature })
  const running = useRef(0)

  useLayoutEffect(() => {
    latest.current = { value, signature }
  })

  const changed = signature !== shown.signature
  const animated = changed && signature !== null && shown.signature !== null && canAnimate()

  if (changed && !animated) setShown({ value, signature })

  useLayoutEffect(() => {
    if (!animated) return
    const root = document.documentElement
    const id = ++running.current
    root.classList.add(ACTIVE_CLASS)
    const end = () => {
      if (running.current === id) root.classList.remove(ACTIVE_CLASS)
    }
    document
      .startViewTransition(() => {
        flushSync(() => setShown(latest.current))
      })
      .finished.then(end, end)
  }, [animated, signature])

  useEffect(() => {
    const root = document.documentElement
    return () => root.classList.remove(ACTIVE_CLASS)
  }, [])

  return changed ? shown.value : value
}
