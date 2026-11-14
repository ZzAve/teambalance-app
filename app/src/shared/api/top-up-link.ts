import { ApiError, apiErrorOf } from './api-error'

const BUNQ_ME_PREFIX = 'https://bunq.me/'

/** The in-app page the demo build opens instead of the pool's bunq.me page. */
export const DEMO_TOP_UP_PATH = '/demo-top-up'

/** The demo team's seeded link only has to look like a bunq.me page (the API and topUpUrlOf require it); nothing pays. */
export function topUpDestination(url: string, demo: boolean): string {
  return demo ? DEMO_TOP_UP_PATH : url
}

/** The pool is off or has no bunq.me link, so there is nothing to pay to. */
export class TopUpUnavailableError extends ApiError {
  constructor() {
    super(404, 'FAILED', 'Top-up is not available for this team.')
  }
}

/**
 * The payment url in a top-up response. The client hands over the declared statuses (200, 403 acting
 * as the team, 404) and throws on any other. The url is navigated to, so anything but a bunq.me page
 * from a 200 is an error.
 */
export function topUpUrlOf(response: { status: number; body?: unknown }): string {
  if (response.status === 404) throw new TopUpUnavailableError()
  if (response.status !== 200) throw apiErrorOf(response, `Top-up link failed with status ${response.status}`)
  const url = (response.body as { url?: unknown } | undefined)?.url
  if (typeof url !== 'string' || !url.startsWith(BUNQ_ME_PREFIX)) throw new Error('Top-up link is not a bunq.me page')
  return url
}
