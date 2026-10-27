import { describe, expect, it } from 'vitest'
import { nullsToUndefined } from './money-pool'

// The server writes an absent optional field as JSON null; the generated types (and every
// `=== undefined` check on them) say undefined.
describe('nullsToUndefined', () => {
  it('turns a cleared beer price and count into undefined, so no Beer Counter is shown', () => {
    const pool = nullsToUndefined({ state: 'Connected', balance: 18750, payments: [], beerPrice: null, beerCount: null })

    expect(pool.beerPrice).toBeUndefined()
    expect(pool.beerCount).toBeUndefined()
    expect(pool.balance).toBe(18750)
  })

  it('turns a cleared price and link in the settings into undefined', () => {
    const settings = nullsToUndefined({ enabled: true, beerPrice: null, bunqMeLink: null })

    expect(settings).toEqual({ enabled: true, beerPrice: undefined, bunqMeLink: undefined })
  })

  it('keeps values that are set, including zero and false', () => {
    expect(nullsToUndefined({ enabled: false, beerPrice: 0, bunqMeLink: 'https://bunq.me/x' })).toEqual({
      enabled: false,
      beerPrice: 0,
      bunqMeLink: 'https://bunq.me/x',
    })
  })
})
