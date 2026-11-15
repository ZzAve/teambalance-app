import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { prefersReducedMotion } from './prefers-reduced-motion'

/** Set on <html> while a transition runs; global.css names the cards and hero only under it. */
const ACTIVE_CLASS = 'list-motion'

const canAnimate = () => typeof document.startViewTransition === 'function' && !prefersReducedMotion()

/**
 * The value to render, committed inside a view transition when its signature changes.
 * A value whose signature is the one on screen passes through at once. A null signature (nothing
 * stable to animate from or to, such as a skeleton) and an unavailable API or reduced motion commit
 * the value directly. Until the transition commits, the value last rendered stays on screen, so the
 * old snapshot shows the page as the viewer last saw it. The committed value is always the latest
 * one, also when changes follow each other faster than a transition runs.
 */
export function useViewTransitionValue<T>(value: T, signature: string | null): T {
  const [shownSignature, setShownSignature] = useState(signature)
  const latestSignature = useRef(signature)
  const lastRendered = useRef(value)
  const running = useRef(0)

  const changed = signature !== shownSignature
  const animated = changed && signature !== null && shownSignature !== null && canAnimate()

  if (changed && !animated) setShownSignature(signature)

  // The previous render's value has to come from a ref: state would re-render on every new object.
  // eslint-disable-next-line react-hooks/refs
  const rendered = animated ? lastRendered.current : value

  useLayoutEffect(() => {
    latestSignature.current = signature
    lastRendered.current = rendered
  })

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
        flushSync(() => setShownSignature(latestSignature.current))
      })
      .finished.then(end, end)
  }, [animated, signature])

  useLayoutEffect(() => {
    const root = document.documentElement
    return () => root.classList.remove(ACTIVE_CLASS)
  }, [])

  return rendered
}
