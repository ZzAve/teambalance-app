interface AccountsQuery {
  isSuccess: boolean
  isError: boolean
  isFetching: boolean
}

/**
 * Which shell the account list shows. A retry after a failure is a fetch in error status, and a paused
 * retry is neither fetching nor failed, so `isError` alone would flash the error during a retry. While a
 * disconnect is under way or done the accounts are a 404 on purpose, so neither shell shows: the list
 * keeps what it had until the section is replaced.
 */
export function accountsShell(query: AccountsQuery, disconnecting: boolean) {
  if (disconnecting) return { isLoading: false, isError: false }
  const failed = query.isError && !query.isFetching
  return { isLoading: !query.isSuccess && !failed, isError: failed }
}
