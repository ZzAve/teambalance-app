import { describe, expect, it } from 'vitest'
import { directionFromIndices } from './view-transition-direction'

// Pure, non-rendering logic: which way the page slide should run. The router stamps a
// monotonically increasing index on every history entry, so a *decreasing* index is the only
// honest signal of a pop (browser Back / swipe-back). Everything else — a push, a lateral tab
// switch at the same depth, the first mount, a hard refresh — slides forward.
describe('directionFromIndices', () => {
  it('reads a decreasing index as back (browser Back)', () => {
    expect(directionFromIndices(3, 2)).toBe('back')
  })

  it('reads a multi-entry jump backwards as back (history.go(-3))', () => {
    expect(directionFromIndices(5, 2)).toBe('back')
  })

  it('reads an increasing index as forward (drilling in)', () => {
    expect(directionFromIndices(2, 3)).toBe('forward')
  })

  it('reads an increasing index as forward even when the path gets shorter', () => {
    // The old length heuristic called this "back": /events/42 -> / is a *push*, not a pop.
    expect(directionFromIndices(0, 1)).toBe('forward')
  })

  it('treats an equal index as forward (replace navigation, no pop)', () => {
    expect(directionFromIndices(4, 4)).toBe('forward')
  })

  it('treats the first mount (no previous index) as forward', () => {
    expect(directionFromIndices(undefined, 0)).toBe('forward')
  })

  it('treats a mid-history first mount (hard refresh) as forward', () => {
    // A reload keeps the entry's index (say 7) but there is no previous render to compare to.
    expect(directionFromIndices(undefined, 7)).toBe('forward')
  })

  it('falls back to forward when the next index is missing', () => {
    // A history entry written by something other than the router carries no index.
    expect(directionFromIndices(3, undefined)).toBe('forward')
  })

  it('falls back to forward when neither index is known', () => {
    expect(directionFromIndices(undefined, undefined)).toBe('forward')
  })
})
