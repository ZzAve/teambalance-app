const BUNQ_ME_PREFIX = 'https://bunq.me/'

/** The pool is off or has no bunq.me link, so there is nothing to pay to. */
export class TopUpUnavailableError extends Error {
  constructor() {
    super('Top-up is not available for this team.')
  }
}

/**
 * The payment url in a top-up response. The client does not throw on a non-2xx, and the url is
 * navigated to, so anything but a bunq.me page from a 200 is an error.
 */
export function topUpUrlOf(response: { status: number; body?: unknown }): string {
  if (response.status === 404) throw new TopUpUnavailableError()
  if (response.status !== 200) throw new Error(`Top-up link failed with status ${response.status}`)
  const url = (response.body as { url?: unknown } | undefined)?.url
  if (typeof url !== 'string' || !url.startsWith(BUNQ_ME_PREFIX)) throw new Error('Top-up link is not a bunq.me page')
  return url
}
