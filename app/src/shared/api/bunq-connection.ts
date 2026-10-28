import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from './wirespec-client'

export type { BunqConnectionStatus } from './generated/model/BunqConnectionStatus'

// Whether the Admin can connect Bunq here, and whether the team already has. Admin-only (403 otherwise),
// so it is only read where the viewer is an Admin.
export const bunqConnectionQueryOptions = queryOptions({
  queryKey: ['money-pool', 'connection'],
  queryFn: async () => {
    const res = await api.getBunqConnection()
    if (res.status === 403) throw new Error('You are not allowed to see the Bunq connection.')
    return res.body
  },
})

export function useBunqConnection(enabled = true) {
  return useQuery({ ...bunqConnectionQueryOptions, enabled })
}

/** Connecting is switched off for this deployment (the API answers 404), or the Admin may not start it. */
export class BunqConnectUnavailableError extends Error {
  constructor() {
    super('Connecting Bunq is not available.')
  }
}

/**
 * The Bunq approval page in a start response. The client hands over the declared statuses (201, 403,
 * 404) and throws on any other. The url is navigated to, so anything but an http(s) address is an error
 * (a `javascript:` url must never reach `window.location`).
 */
export function bunqAuthorizeUrlOf(response: { status: number; body?: unknown }): string {
  if (response.status === 403 || response.status === 404) throw new BunqConnectUnavailableError()
  if (response.status !== 201) throw new Error(`Starting the Bunq connection failed with status ${response.status}`)
  const url = (response.body as { url?: unknown } | undefined)?.url
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) throw new Error('Bunq connection url is not a web address')
  return url
}

// Asks the server for the Bunq page where the Admin approves access.
export async function startBunqConnection(): Promise<string> {
  return bunqAuthorizeUrlOf(await api.startBunqConnection())
}
