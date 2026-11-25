import * as plausible from '@plausible-analytics/tracker'
import type { PlausibleConfig, PlausibleRequestPayload } from '@plausible-analytics/tracker'

/**
 * Cookieless page analytics with Plausible (EU). Only the production deploy sets VITE_PLAUSIBLE_DOMAIN;
 * every other build (dev, e2e, demo, Storybook, tests) has no domain, so it loads no tracker code and
 * sends nothing.
 *
 * Privacy: no member ID, email or name, and no custom properties. The app sends its own pageviews
 * with the route template (`/t/$slug/events/$eventId`), never the real path: real paths hold the team
 * slug, IDs and the invite token. Query strings and fragments are removed (the magic-link token is in
 * the query). A referrer from the app itself is dropped, because it is a real path.
 */
export interface AnalyticsEnv {
  /** The site domain as set in Plausible, e.g. app.teambalance.nl. Unset = no analytics. */
  domain: string | undefined
  /** The event endpoint, e.g. a proxy on an own domain. Unset = Plausible's default endpoint. */
  endpoint: string | undefined
  /** The origin of the page, the base of each pageview URL. */
  origin: string
}

interface Match {
  fullPath: string
  status: string
  /** Set by TanStack Router 1.170 on the match that renders the not-found component (internal field). */
  _notFound?: boolean
  /** The name of that flag in older router versions. */
  globalNotFound?: boolean
}

/** The part of the TanStack router that the analytics needs. */
export interface PageviewRouter {
  state: { matches: readonly Match[] }
  subscribe: (type: 'onResolved', fn: (event: { pathChanged: boolean }) => void) => () => void
}

interface Tracker {
  init: (config: PlausibleConfig) => void
  track: (eventName: string, options: { url?: string }) => void
}

const NOT_FOUND = '/404'

function withoutQueryAndHash(url: string): string {
  return url.replace(/[?#].*$/, '')
}

function safeReferrer(referrer: string | null | undefined, origin: string): string | null {
  if (!referrer) return null
  try {
    if (new URL(referrer).origin === origin) return null
  } catch {
    return null
  }
  return withoutQueryAndHash(referrer)
}

/** The tracker config, or null when there is no domain: then the tracker must not start. */
export function plausibleConfig({ domain, endpoint, origin }: AnalyticsEnv): PlausibleConfig | null {
  if (!domain?.trim()) return null
  return {
    domain: domain.trim(),
    ...(endpoint?.trim() ? { endpoint: endpoint.trim() } : {}),
    autoCapturePageviews: false,
    hashBasedRouting: false,
    outboundLinks: false,
    fileDownloads: false,
    formSubmissions: false,
    logging: false,
    transformRequest: (payload: PlausibleRequestPayload) => {
      const scrubbed = { ...payload, u: withoutQueryAndHash(payload.u), r: safeReferrer(payload.r, origin) }
      delete scrubbed.p
      return scrubbed
    },
  }
}

/** The URL of a pageview: the route template of the deepest match, or /404 when nothing matched. */
export function pageviewUrl(origin: string, matches: readonly Match[]): string | null {
  if (matches.length === 0) return null
  if (matches.some((m) => m._notFound || m.globalNotFound || m.status === 'notFound')) return origin + NOT_FOUND
  return origin + withoutQueryAndHash(matches[matches.length - 1].fullPath)
}

const defaultEnv = (): AnalyticsEnv => ({
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
  endpoint: import.meta.env.VITE_PLAUSIBLE_ENDPOINT,
  origin: window.location.origin,
})

// Vite replaces the variable at build time: without a domain this is `undefined` and Rollup drops the
// tracker from the bundle. With a domain the tracker is in the main chunk, not in a lazy chunk: an ad
// blocker that blocks a `plausible-*.js` chunk would make the chunk-reload handler reload the page.
const bundledTracker: Tracker | undefined = import.meta.env.VITE_PLAUSIBLE_DOMAIN ? plausible : undefined

/**
 * Starts the tracker when the build has a domain, and sends one pageview each time the router resolves
 * a new path.
 */
export function startAnalytics(
  router: PageviewRouter,
  env: AnalyticsEnv = defaultEnv(),
  tracker: Tracker | undefined = bundledTracker,
) {
  const config = plausibleConfig(env)
  if (!config || !tracker) return
  tracker.init(config)
  router.subscribe('onResolved', (event) => {
    if (!event.pathChanged) return
    const url = pageviewUrl(env.origin, router.state.matches)
    if (url) tracker.track('pageview', { url })
  })
}
