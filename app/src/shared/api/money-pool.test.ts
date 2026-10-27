import { afterEach, describe, expect, it, vi } from 'vitest'
import { moneyPoolQueryOptions, moneyPoolSettingsQueryOptions, nullsToUndefined } from './money-pool'

// The server writes an absent optional field as JSON null; the generated types (and every
// `=== undefined` check on them) say undefined.
describe('nullsToUndefined', () => {
  it('turns a null beer price and count into undefined and keeps the other fields', () => {
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

// The real API writes absent optionals as JSON null; these are the payloads it sends, read through the
// actual client. Removing the normaliser from a query would put a null back into the Views' props.
describe('money pool queries', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function stubBody(json: string) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 200, headers: new Headers(), text: vi.fn().mockResolvedValue(json) }),
    )
  }

  const run = <T,>(options: { queryFn?: unknown }) => (options.queryFn as () => Promise<T>)()

  it('reads a Connected pool without a beer price as absent, payments untouched', async () => {
    stubBody(
      '{"state":"Connected","balance":18750,"payments":[{"date":"2026-10-22","name":"Lisa de Vries","amount":2000,"direction":"In"}],"beerPrice":null,"beerCount":null}',
    )

    const pool = await run<Record<string, unknown>>(moneyPoolQueryOptions)

    expect(pool.beerPrice).toBeUndefined()
    expect(pool.beerCount).toBeUndefined()
    expect(pool.balance).toBe(18750)
    expect(pool.payments).toEqual([{ date: '2026-10-22', name: 'Lisa de Vries', amount: 2000, direction: 'In' }])
  })

  it('reads an Off pool as having no balance, payments or beer figures', async () => {
    stubBody('{"state":"Off","balance":null,"payments":null,"beerPrice":null,"beerCount":null}')

    const pool = await run<Record<string, unknown>>(moneyPoolQueryOptions)

    expect(pool.state).toBe('Off')
    expect([pool.balance, pool.payments, pool.beerPrice, pool.beerCount]).toEqual([undefined, undefined, undefined, undefined])
  })

  it('reads cleared settings as absent', async () => {
    stubBody('{"enabled":true,"beerPrice":null,"bunqMeLink":null}')

    const settings = await run<Record<string, unknown>>(moneyPoolSettingsQueryOptions)

    expect(settings.enabled).toBe(true)
    expect(settings.beerPrice).toBeUndefined()
    expect(settings.bunqMeLink).toBeUndefined()
  })
})
