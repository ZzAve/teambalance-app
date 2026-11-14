import type { Breadcrumb, ErrorEvent } from '@sentry/react'
import { bugsinkOptions } from './error-reporting'

const DSN = 'https://publickey@bugsink.example/2'

type Named = { name: string }
const integration = (name: string): Named => ({ name })

describe('bugsinkOptions', () => {
  it.each([undefined, '', '   '])('returns no options (the SDK does not start) for the DSN %j', (dsn) => {
    expect(bugsinkOptions({ dsn, release: 'abc' })).toBeNull()
  })

  it('sends no PII, no traces, no replay and no browser sessions', () => {
    const options = bugsinkOptions({ dsn: DSN, release: '0123abc' })!

    expect(options).toMatchObject({ dsn: DSN, release: '0123abc', environment: 'prod' })
    // SDK v11 replaced sendDefaultPii with dataCollection, whose defaults collect user info (the
    // server infers the IP), cookies, headers, bodies and URL query parameters.
    expect(options.dataCollection).toEqual({
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    })
    expect(options.tracesSampleRate).toBe(0)
    expect(options).not.toHaveProperty('replaysSessionSampleRate')
    expect(options).not.toHaveProperty('replaysOnErrorSampleRate')
    expect(Object.keys(options)).not.toContain('initialScope')

    const kept = (options.integrations as (defaults: Named[]) => Named[])(
      ['GlobalHandlers', 'BrowserSession', 'Dedupe', 'Breadcrumbs'].map(integration),
    )
    expect(kept.map((i) => i.name)).toEqual(['GlobalHandlers', 'Dedupe', 'Breadcrumbs'])
  })

  it('removes the query, hash and headers from the request of an event', () => {
    const options = bugsinkOptions({ dsn: DSN, release: undefined })!
    const event = {
      request: {
        url: 'https://app.teambalance.nl/auth/verify?token=secret#x',
        headers: { Referer: 'https://app.teambalance.nl/invite/secret?x=1', 'User-Agent': 'Firefox' },
        cookies: { SESSION: 'secret' },
        query_string: 'token=secret',
      },
    } as unknown as ErrorEvent

    const sent = options.beforeSend!(event, {}) as ErrorEvent

    expect(sent.request).toEqual({ url: 'https://app.teambalance.nl/auth/verify' })
    expect(JSON.stringify(sent)).not.toContain('secret')
  })

  it('removes the token of an invite path from the request URL', () => {
    const options = bugsinkOptions({ dsn: DSN, release: undefined })!
    const event = { request: { url: 'https://app.teambalance.nl/invite/abc123' } } as ErrorEvent

    const sent = options.beforeSend!(event, {}) as ErrorEvent

    expect(sent.request?.url).toBe('https://app.teambalance.nl/invite/:token')
  })

  it('removes the query and invite tokens from the URLs of navigation and fetch breadcrumbs', () => {
    const options = bugsinkOptions({ dsn: DSN, release: undefined })!
    const navigation: Breadcrumb = {
      category: 'navigation',
      data: { from: '/auth/verify?token=secret', to: '/invite/secret' },
    }
    const fetch: Breadcrumb = {
      category: 'fetch',
      data: { url: 'https://api.teambalance.nl/api/auth/verify?token=secret', status_code: 400 },
    }

    expect(options.beforeBreadcrumb!(navigation)!.data).toEqual({ from: '/auth/verify', to: '/invite/:token' })
    expect(options.beforeBreadcrumb!(fetch)!.data).toEqual({
      url: 'https://api.teambalance.nl/api/auth/verify',
      status_code: 400,
    })
  })
})
