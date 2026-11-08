import { describe, expect, it } from 'vitest'
import { hidesBottomNav } from './signed-out-routes'

describe('hidesBottomNav', () => {
  it('hides the tab bar on the demo persona picker and the demo top-up page', () => {
    expect(hidesBottomNav('/demo')).toBe(true)
    expect(hidesBottomNav('/demo-top-up')).toBe(true)
  })

  it('keeps it on in-app routes', () => {
    expect(hidesBottomNav('/t/de-smashers/money')).toBe(false)
    expect(hidesBottomNav('/account')).toBe(false)
    expect(hidesBottomNav('/demonstration')).toBe(false)
  })
})
