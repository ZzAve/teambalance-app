import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nullsToUndefined } from './money-pool'
import { api } from './wirespec-client'

export type { BunqConnectionStatus } from './generated/model/BunqConnectionStatus'
export type { BunqAccount } from './generated/model/BunqAccount'
export type { BunqAccounts } from './generated/model/BunqAccounts'

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

/**
 * A Bunq connection request the API refused (403, 404, 422). It carries the status so the shared retry
 * policy treats it as a real client error and does not retry it.
 */
export class BunqConnectionError extends Error {
  constructor(readonly status: number) {
    super(`The Bunq connection request failed with status ${status}`)
  }
}

/** The stored Bunq access cannot be used any more (422 BUNQ_REJECTED): the Admin connects again. */
export function isBunqGrantRejected(error: unknown): boolean {
  return error instanceof BunqConnectionError && error.status === 422
}

type AccountsResponse = Awaited<ReturnType<typeof api.getBunqAccounts>>

/** The accounts of a 200; any other declared status is a refusal. */
export function bunqAccountsOf(response: AccountsResponse) {
  if (response.status !== 200) throw new BunqConnectionError(response.status)
  return nullsToUndefined(response.body)
}

// The accounts the team's grant covers and the one the Money page reads. Admin-only; 404 while the
// team is not connected, so it is only read where the status says it is.
export const bunqAccountsQueryOptions = queryOptions({
  queryKey: ['money-pool', 'connection', 'accounts'],
  queryFn: async () => bunqAccountsOf(await api.getBunqAccounts()),
})

export function useBunqAccounts(enabled = true) {
  return useQuery({ ...bunqAccountsQueryOptions, enabled })
}

export async function pickBunqAccount(accountId: string): Promise<void> {
  const response = await api.putBunqAccount({ body: { accountId } })
  if (response.status !== 204) throw new BunqConnectionError(response.status)
}

export async function disconnectBunq(): Promise<void> {
  const response = await api.disconnectBunq()
  if (response.status !== 204) throw new BunqConnectionError(response.status)
}

// The pool, the status and the accounts all hang under ['money-pool'], and both change all three.
export function usePickBunqAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: pickBunqAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['money-pool'] }),
  })
}

export function useDisconnectBunq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disconnectBunq,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['money-pool'] }),
  })
}
