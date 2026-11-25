import type { PlausibleRequestPayload } from '@plausible-analytics/tracker'
import { pageviewUrl, plausibleConfig, startAnalytics, type PageviewRouter } from './analytics'

const ORIGIN = 'https://app.teambalance.nl'

describe('plausibleConfig', () => {
  it.each([undefined, '', '   '])('returns no config (the tracker does not start) for the domain %j', (domain) => {
    expect(plausibleConfig({ domain, endpoint: undefined, origin: ORIGIN })).toBeNull()
  })

  it('switches off every automatic capture: the app sends its own pageviews', () => {
    const config = plausibleConfig({ domain: 'app.teambalance.nl', endpoint: undefined, origin: ORIGIN })!

    expect(config).toMatchObject({
      domain: 'app.teambalance.nl',
      autoCapturePageviews: false,
      outboundLinks: false,
      fileDownloads: false,
      formSubmissions: false,
      hashBasedRouting: false,
    })
    // Plausible ignores localhost unless this is on; keep that.
    expect(config.captureOnLocalhost).not.toBe(true)
    expect(config).not.toHaveProperty('customProperties')
    expect(config).not.toHaveProperty('endpoint')
  })

  it('uses the endpoint when one is set (a proxy, or a local receiver)', () => {
    const config = plausibleConfig({
      domain: 'app.teambalance.nl',
      endpoint: 'https://app.teambalance.nl/stats/api/event',
      origin: ORIGIN,
    })!

    expect(config.endpoint).toBe('https://app.teambalance.nl/stats/api/event')
  })

  describe('transformRequest', () => {
    const transform = plausibleConfig({ domain: 'app.teambalance.nl', endpoint: undefined, origin: ORIGIN })!
      .transformRequest!
    const payload = (over: Partial<PlausibleRequestPayload>): PlausibleRequestPayload => ({
      n: 'pageview',
      u: `${ORIGIN}/login`,
      d: 'app.teambalance.nl',
      ...over,
    })

    it('removes the query string and the fragment from the URL', () => {
      expect(transform(payload({ u: `${ORIGIN}/auth/verify?token=s3cret#x` }))!.u).toBe(`${ORIGIN}/auth/verify`)
    })

    it('drops a referrer from the app itself: it can hold a real path with a token or an ID', () => {
      expect(transform(payload({ r: `${ORIGIN}/invite/abc123?x=1` }))!.r).toBeNull()
    })

    it('keeps an external referrer without its query string and fragment', () => {
      expect(transform(payload({ r: 'https://mail.example/inbox?id=42#msg' }))!.r).toBe('https://mail.example/inbox')
    })

    it('drops a referrer that is not a URL', () => {
      expect(transform(payload({ r: 'not a url' }))!.r).toBeNull()
    })

    it('never sends custom properties (the Starter plan has none, and they could hold PII)', () => {
      expect(transform(payload({ p: { email: 'a@b.c' } }))).not.toHaveProperty('p')
    })
  })
})

describe('pageviewUrl', () => {
  const match = (fullPath: string, extra: object = {}) => ({ fullPath, status: 'success' as const, ...extra })

  it('sends the route template of the deepest match, not the real path', () => {
    expect(pageviewUrl(ORIGIN, [match('/'), match('/t/$slug'), match('/t/$slug/events/$eventId')])).toBe(
      `${ORIGIN}/t/$slug/events/$eventId`,
    )
  })

  it.each(['/invite/$token', '/auth/verify', '/login', '/t/$slug/'])('keeps the template %s as it is', (fullPath) => {
    expect(pageviewUrl(ORIGIN, [match('/'), match(fullPath)])).toBe(`${ORIGIN}${fullPath}`)
  })

  it('sends /404 for a URL that no route matches', () => {
    // TanStack Router 1.170 marks the match that renders the not-found component with `_notFound`;
    // older versions used `globalNotFound`.
    expect(pageviewUrl(ORIGIN, [match('/', { _notFound: true })])).toBe(`${ORIGIN}/404`)
    expect(pageviewUrl(ORIGIN, [match('/'), match('/t/$slug', { _notFound: true })])).toBe(`${ORIGIN}/404`)
    expect(pageviewUrl(ORIGIN, [match('/', { globalNotFound: true })])).toBe(`${ORIGIN}/404`)
    expect(pageviewUrl(ORIGIN, [match('/'), match('/t/$slug', { status: 'notFound' })])).toBe(`${ORIGIN}/404`)
  })

  it('sends nothing when there are no matches', () => {
    expect(pageviewUrl(ORIGIN, [])).toBeNull()
  })
})

describe('startAnalytics', () => {
  type Listener = (event: { pathChanged: boolean }) => void
  const ON = { domain: 'app.teambalance.nl', endpoint: undefined, origin: ORIGIN }

  function fakeRouter(matches: { fullPath: string; status: 'success' }[]) {
    let listener: Listener | undefined
    const router: PageviewRouter = {
      state: { matches },
      subscribe: (_type, fn) => {
        listener = fn
        return () => {}
      },
    }
    return { router, resolve: (pathChanged: boolean) => listener!({ pathChanged }) }
  }

  it('starts no tracker and subscribes to nothing without a domain', () => {
    const tracker = { init: vi.fn(), track: vi.fn() }
    const subscribe = vi.fn()

    startAnalytics({ state: { matches: [] }, subscribe }, { ...ON, domain: undefined }, tracker)

    expect(tracker.init).not.toHaveBeenCalled()
    expect(subscribe).not.toHaveBeenCalled()
  })

  it('starts no tracker when the build has no tracker code', () => {
    const subscribe = vi.fn()

    startAnalytics({ state: { matches: [] }, subscribe }, ON, undefined)

    expect(subscribe).not.toHaveBeenCalled()
  })

  it('sends one template pageview for each path change, and none for a reload of the same path', () => {
    const tracker = { init: vi.fn(), track: vi.fn() }
    const { router, resolve } = fakeRouter([
      { fullPath: '/', status: 'success' },
      { fullPath: '/t/$slug/events/$eventId', status: 'success' },
    ])

    startAnalytics(router, ON, tracker)
    resolve(true)
    resolve(false)

    expect(tracker.init).toHaveBeenCalledWith(expect.objectContaining({ autoCapturePageviews: false }))
    expect(tracker.init).toHaveBeenCalledBefore(tracker.track)
    expect(tracker.track).toHaveBeenCalledTimes(1)
    expect(tracker.track).toHaveBeenCalledWith('pageview', { url: `${ORIGIN}/t/$slug/events/$eventId` })
  })
})
