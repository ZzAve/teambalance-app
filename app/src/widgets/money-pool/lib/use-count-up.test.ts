import { describe, expect, it } from 'vitest'
import { countUp } from './use-count-up'

// A hand-driven animation clock: `step(ms)` runs the pending frame at that time.
function clock() {
  let now = 0
  let pending: ((t: number) => void) | null = null
  return {
    frames: {
      now: () => now,
      request: (cb: (t: number) => void) => ((pending = cb), 1),
      cancel: () => (pending = null),
    },
    step(ms: number) {
      now = ms
      const cb = pending
      pending = null
      cb?.(now)
    },
    get waiting() {
      return pending !== null
    },
  }
}

describe('countUp', () => {
  it('shows the target at once when inactive, as under reduced motion', () => {
    const c = clock()
    const written: number[] = []
    countUp((v) => written.push(v), { start: 0, target: 5000, active: false, duration: 600 }, c.frames)
    expect(written).toEqual([5000])
    expect(c.waiting).toBe(false)
  })

  it('starts at the start value and ends exactly on the target', () => {
    const c = clock()
    const written: number[] = []
    countUp((v) => written.push(v), { start: 0, target: 4501, active: true, duration: 600 }, c.frames)
    expect(written).toEqual([0])
    c.step(300)
    expect(written.at(-1)).toBeGreaterThan(0)
    expect(written.at(-1)).toBeLessThan(4501)
    c.step(600)
    expect(written.at(-1)).toBe(4501)
    expect(c.waiting).toBe(false)
  })

  it('waits out the delay at the start value', () => {
    const c = clock()
    const written: number[] = []
    countUp((v) => written.push(v), { start: 0, target: 1000, active: true, duration: 200, delay: 300 }, c.frames)
    c.step(250)
    expect(written.at(-1)).toBe(0)
  })

  it('writes nothing more once cancelled, and a new run from the last value ends on its own target', () => {
    const c = clock()
    const written: number[] = []
    const write = (v: number) => written.push(v)
    const cancel = countUp(write, { start: 0, target: 5000, active: true, duration: 600 }, c.frames)
    c.step(100)
    const reached = written.at(-1)!
    cancel()
    expect(c.waiting).toBe(false)
    countUp(write, { start: reached, target: 2000, active: true, duration: 250 }, c.frames)
    expect(written.at(-1)).toBe(reached)
    c.step(400)
    expect(written.at(-1)).toBe(2000)
  })
})
