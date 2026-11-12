import { useLayoutEffect, useRef, type RefObject } from 'react'

interface CountUpOptions {
  /** Off: the text is the target at once, and a run in progress stops there. */
  active: boolean
  /** Count from here; without it, from the value shown last. */
  from?: number
  duration: number
  delay?: number
}

interface Frames {
  now: () => number
  request: (callback: (time: number) => void) => number
  cancel: (id: number) => void
}

const browserFrames: Frames = {
  now: () => performance.now(),
  request: (callback) => requestAnimationFrame(callback),
  cancel: (id) => cancelAnimationFrame(id),
}

/**
 * One run from `start` to `target` with an exponential ease-out, written through `write` once a frame.
 * Inactive, or with nothing to count, it writes the target once. Returns the cancel; the last frame is exactly the target.
 */
export function countUp(
  write: (value: number) => void,
  { start, target, active, duration, delay = 0 }: { start: number; target: number; active: boolean; duration: number; delay?: number },
  frames: Frames = browserFrames,
): () => void {
  if (!active || start === target) {
    write(target)
    return () => {}
  }
  const begin = frames.now() + delay
  write(start)
  let frame = frames.request(function tick(now) {
    const progress = Math.min(Math.max((now - begin) / duration, 0), 1)
    // In steps of 50 cents, so the cents do not flicker.
    write(progress === 1 ? target : Math.round((start + (target - start) * (1 - 2 ** (-10 * progress))) / 50) * 50)
    if (progress < 1) frame = frames.request(tick)
  })
  return () => frames.cancel(frame)
}

/**
 * Counts the text of `ref` to `target`, through `format`. It writes the DOM, not state, so a frame costs no
 * render; the element's React text is the target, which is what shows when the run ends or is cancelled. A new
 * target, options or unmount cancel the run, and the next one starts from the value shown last.
 */
export function useCountUp(ref: RefObject<HTMLElement | null>, target: number, format: (n: number) => string, { active, from, duration, delay = 0 }: CountUpOptions) {
  const shown = useRef(target)
  // A layout effect, so the start value is in place before the browser paints the new target.
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const write = (value: number) => {
      shown.current = value
      element.textContent = format(value)
    }
    return countUp(write, { start: from ?? shown.current, target, active, duration, delay })
  }, [ref, target, format, active, from, duration, delay])
}
