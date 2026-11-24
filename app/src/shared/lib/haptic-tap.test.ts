import { afterEach, describe, expect, it, vi } from 'vitest'
import { hapticTap } from './haptic-tap'

describe('hapticTap', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('gives one short buzz where the Vibration API exists', () => {
    const vibrate = vi.fn().mockReturnValue(true)
    vi.stubGlobal('navigator', { vibrate })
    hapticTap()
    expect(vibrate).toHaveBeenCalledWith(10)
  })

  it('does nothing where the Vibration API is missing (iOS Safari, desktop Firefox)', () => {
    vi.stubGlobal('navigator', {})
    expect(() => hapticTap()).not.toThrow()
  })
})
