import { describe, expect, it } from 'vitest'
import { ESCALATE_AFTER_MS, isWakeVisible, MIN_VISIBLE_MS, wakeMessageFor } from './wake-notice'

const idle = { busy: false, elapsedMs: 0, shownAt: null, now: 10_000 }

describe('isWakeVisible', () => {
  it('stays hidden while a request is still within the warm-backend window', () => {
    expect(isWakeVisible({ ...idle, busy: true, elapsedMs: 2_499 })).toBe(false)
  })

  it('shows once a request has been busy for 2.5 s', () => {
    expect(isWakeVisible({ ...idle, busy: true, elapsedMs: 2_500 })).toBe(true)
  })

  it('stays hidden when nothing is in flight and it was never shown', () => {
    expect(isWakeVisible(idle)).toBe(false)
  })

  it('holds for the minimum visible time after the last request settles', () => {
    expect(isWakeVisible({ ...idle, shownAt: 10_000 - (MIN_VISIBLE_MS - 1) })).toBe(true)
  })

  it('hides once the minimum visible time has passed', () => {
    expect(isWakeVisible({ ...idle, shownAt: 10_000 - MIN_VISIBLE_MS })).toBe(false)
  })

  it('stays visible while busy past the threshold, however long ago it was first shown', () => {
    expect(isWakeVisible({ busy: true, elapsedMs: 9_000, shownAt: 0, now: 10_000 })).toBe(true)
  })
})

describe('wakeMessageFor', () => {
  it('uses the first line from the start up to the escalation point', () => {
    expect(wakeMessageFor(-1)).toBe('Waking the server back up…')
    expect(wakeMessageFor(0)).toBe('Waking the server back up…')
    expect(wakeMessageFor(ESCALATE_AFTER_MS - 1)).toBe('Waking the server back up…')
  })

  it('switches to the second line at the escalation point', () => {
    expect(wakeMessageFor(ESCALATE_AFTER_MS)).toBe('Still on it — thanks for hanging in there')
  })

  it('never claims anything was saved', () => {
    expect(wakeMessageFor(0)).not.toMatch(/saved/i)
    expect(wakeMessageFor(ESCALATE_AFTER_MS)).not.toMatch(/saved/i)
  })
})
