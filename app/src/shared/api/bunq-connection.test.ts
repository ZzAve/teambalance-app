import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BunqConnectUnavailableError,
  BunqConnectionError,
  bunqAccountsQueryOptions,
  bunqAuthorizeUrlOf,
  bunqConnectionQueryOptions,
  disconnectBunq,
  isBunqGrantRejected,
  pickBunqAccount,
  startBunqConnection,
} from './bunq-connection'
import { shouldRetryWake } from './retry-policy'
import { api } from './wirespec-client'

function stub(status: number, json = '') {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ status, headers: new Headers(), text: vi.fn().mockResolvedValue(json) }),
  )
}

const run = <T,>(options: { queryFn?: unknown }) => (options.queryFn as () => Promise<T>)()

// The authorize url is navigated to, so only an http(s) address from a 201 may become one.
describe('bunqAuthorizeUrlOf', () => {
  it('returns the url of a 201', () => {
    expect(bunqAuthorizeUrlOf({ status: 201, body: { url: 'https://oauth.bunq.com/auth?state=s' } })).toBe(
      'https://oauth.bunq.com/auth?state=s',
    )
  })

  it('accepts http, which the local fake Bunq page uses', () => {
    expect(bunqAuthorizeUrlOf({ status: 201, body: { url: 'http://localhost:8080/internal/fake-bunq/authorize' } })).toBe(
      'http://localhost:8080/internal/fake-bunq/authorize',
    )
  })

  it.each(['javascript:alert(1)', 'data:text/html,x', '//evil.example/x', '/relative', ''])(
    'refuses %j as a url',
    (url) => {
      expect(() => bunqAuthorizeUrlOf({ status: 201, body: { url } })).toThrow('Bunq connection url is not a web address')
    },
  )

  it('refuses a 201 without a url', () => {
    expect(() => bunqAuthorizeUrlOf({ status: 201, body: {} })).toThrow('Bunq connection url is not a web address')
    expect(() => bunqAuthorizeUrlOf({ status: 201 })).toThrow('Bunq connection url is not a web address')
  })

  it('reports a 404 (connecting switched off) and a 403 as unavailable', () => {
    expect(() => bunqAuthorizeUrlOf({ status: 404 })).toThrow(BunqConnectUnavailableError)
    expect(() => bunqAuthorizeUrlOf({ status: 403 })).toThrow(BunqConnectUnavailableError)
  })

  it('refuses any other status', () => {
    expect(() => bunqAuthorizeUrlOf({ status: 200, body: { url: 'https://oauth.bunq.com/auth' } })).toThrow(
      'Starting the Bunq connection failed with status 200',
    )
  })
})

// Through the real client, with the payloads the API sends. The status has no optional fields, so there
// is nothing to normalise; these prove the contract's shapes and statuses are read as the app expects.
describe('the Bunq connection through the real client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads the status', async () => {
    stub(200, '{"connectAvailable":true,"connected":true,"accountPicked":false}')

    await expect(run(bunqConnectionQueryOptions)).resolves.toEqual({
      connectAvailable: true,
      connected: true,
      accountPicked: false,
    })
  })

  it('fails the status read for a non-admin (403)', async () => {
    stub(403)

    await expect(run(bunqConnectionQueryOptions)).rejects.toThrow('You are not allowed to see the Bunq connection.')
  })

  it('starts a connection with a POST and returns the Bunq page', async () => {
    stub(201, '{"url":"https://oauth.bunq.com/auth?state=s"}')

    await expect(startBunqConnection()).resolves.toBe('https://oauth.bunq.com/auth?state=s')
    expect(fetch).toHaveBeenCalledWith(
      '/api/team/money-pool/connection',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('hands a 404 over as a response, and starting fails on it as unavailable', async () => {
    stub(404)

    await expect(api.startBunqConnection()).resolves.toMatchObject({ status: 404 })
    await expect(startBunqConnection()).rejects.toBeInstanceOf(BunqConnectUnavailableError)
  })
})

// The account endpoints, through the real client. A refusal carries its status, which keeps the shared
// retry policy from retrying a 4xx as if the backend were still waking up.
describe('the Bunq accounts through the real client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads the accounts and the pick', async () => {
    stub(200, '{"accounts":[{"id":"a1","name":"Teamkas"},{"id":"a2","name":"Privé"}],"selectedAccountId":"a1"}')

    await expect(run(bunqAccountsQueryOptions)).resolves.toEqual({
      accounts: [
        { id: 'a1', name: 'Teamkas' },
        { id: 'a2', name: 'Privé' },
      ],
      selectedAccountId: 'a1',
    })
  })

  it('reads no pick as undefined, not as the null the server writes', async () => {
    stub(200, '{"accounts":[{"id":"a1","name":"Teamkas"}],"selectedAccountId":null}')

    const accounts = await run<{ selectedAccountId?: string }>(bunqAccountsQueryOptions)

    expect(accounts.selectedAccountId).toBeUndefined()
  })

  it.each([403, 404, 422])('fails the accounts read on a %i with that status, so it is not retried', async (status) => {
    stub(status)

    const error = await run(bunqAccountsQueryOptions).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(BunqConnectionError)
    expect(error).toMatchObject({ status })
    expect(shouldRetryWake(0, error)).toBe(false)
  })

  it('tells a rejected grant (422) from every other refusal', () => {
    expect(isBunqGrantRejected(new BunqConnectionError(422))).toBe(true)
    expect(isBunqGrantRejected(new BunqConnectionError(404))).toBe(false)
    expect(isBunqGrantRejected(new Error('boom'))).toBe(false)
  })

  it('picks with a PUT of the account id', async () => {
    stub(204)

    await expect(pickBunqAccount('a2')).resolves.toBeUndefined()
    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('/api/team/money-pool/connection/account')
    expect(init?.method).toBe('PUT')
    expect(new TextDecoder().decode(init?.body as Uint8Array)).toBe('{"accountId":"a2"}')
  })

  it.each([400, 403, 404, 422])('fails a pick on a %i with that status', async (status) => {
    stub(status)

    await expect(pickBunqAccount('a2')).rejects.toMatchObject({ status })
  })

  it('disconnects with a DELETE', async () => {
    stub(204)

    await expect(disconnectBunq()).resolves.toBeUndefined()
    expect(fetch).toHaveBeenCalledWith(
      '/api/team/money-pool/connection',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('fails a disconnect that is refused (403)', async () => {
    stub(403)

    await expect(disconnectBunq()).rejects.toMatchObject({ status: 403 })
  })
})
