interface AccountsQuery {
  isSuccess: boolean
  isError: boolean
  isFetching: boolean
}

interface DisconnectMutation {
  isPending: boolean
  isSuccess: boolean
}

interface StatusQuery {
  isError: boolean
  isFetching: boolean
  /** What the status read answered last: the team has a connection. */
  isConnected: boolean
}

/**
 * Which shell the account list shows. A retry after a failure is a fetch in error status, and a paused
 * retry is neither fetching nor failed, so `isError` alone would flash the error during a retry. While a
 * disconnect is under way or done the accounts are a 404 on purpose, so neither shell shows: the list
 * keeps what it had until the section is replaced. If the status read that follows a disconnect failed,
 * the section is not replaced, so the shells show again. The same holds when that read, once it has answered,
 * still says connected (another tab connected again): the section stays and the shells must not stay hidden.
 */
export function accountsShell(query: AccountsQuery, disconnect: DisconnectMutation, status: StatusQuery) {
  const statusFailed = status.isError && !status.isFetching
  const sectionStays = statusFailed || (status.isConnected && !status.isFetching)
  if (disconnect.isPending || (disconnect.isSuccess && !sectionStays)) return { isLoading: false, isError: false }
  const failed = query.isError && !query.isFetching
  return { isLoading: !query.isSuccess && !failed, isError: failed }
}
