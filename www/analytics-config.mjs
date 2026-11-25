// Plausible config for the landing page (teambalance.nl). Its paths (/, /en/, /privacy/) hold no
// tokens or IDs, so the tracker sends its own pageviews. Query strings, fragments and custom
// properties are still removed, as in the SPA (app/src/shared/lib/analytics.ts).

const withoutQueryAndHash = (url) => url.replace(/[?#].*$/, '')

/** The tracker config, or null when there is no domain: then the tracker must not start. */
export const plausibleConfig = (domain) => {
  if (!domain?.trim()) return null
  return {
    domain: domain.trim(),
    // The tracker is served from teambalance.nl, so its default endpoint would be teambalance.nl too.
    endpoint: 'https://plausible.io/api/event',
    autoCapturePageviews: true,
    outboundLinks: false,
    fileDownloads: false,
    formSubmissions: false,
    logging: false,
    transformRequest: (payload) => {
      const scrubbed = { ...payload, u: withoutQueryAndHash(payload.u), r: payload.r ? withoutQueryAndHash(payload.r) : payload.r }
      delete scrubbed.p
      return scrubbed
    },
  }
}
