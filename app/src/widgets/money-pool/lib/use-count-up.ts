import { useLayoutEffect, useRef, type RefObject } from 'react'

interface CountUpOptions {
  /** Off: the text is the target at once, and a run in progress stops there. */
  active: boolean
  /** Count from here; without it, from the value shown last. */
  from?: number
  duration: number
  delay?: number
}

/**
 * Counts the text of `ref` to `target`, through `format`, with an exponential ease-out. It writes the
 * DOM, not state, so a frame costs no render; the element's React text is the target, which is what
 * shows when the run ends or is cancelled. A new target, options or unmount cancel the run.
 */
export function useCountUp(ref: RefObject<HTMLElement | null>, target: number, format: (n: number) => string, { active, from, duration, delay = 0 }: CountUpOptions) {
  const shown = useRef(target)
  // A layout effect, so the start value is in place before the browser paints the new target.
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const start = from ?? shown.current
    if (!active || start === target) {
      shown.current = target
      element.textContent = format(target)
      return
    }
    const begin = performance.now() + delay
    const write = (value: number) => {
      shown.current = value
      element.textContent = format(value)
    }
    write(start)
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(Math.max((now - begin) / duration, 0), 1)
      // In steps of 50 cents, so the cents do not flicker; the last frame is exact.
      write(progress === 1 ? target : Math.round((start + (target - start) * (1 - 2 ** (-10 * progress))) / 50) * 50)
      if (progress < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [ref, target, format, active, from, duration, delay])
}
