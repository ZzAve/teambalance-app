import { describe, expect, it } from 'vitest'
import { accountsShell } from './accounts-shell'

const loading = { isSuccess: false, isError: false, isFetching: true }
const loaded = { isSuccess: true, isError: false, isFetching: false }
const failed = { isSuccess: false, isError: true, isFetching: false }

describe('accountsShell', () => {
  it('is loading until the first answer', () => {
    expect(accountsShell(loading, false)).toEqual({ isLoading: true, isError: false })
  })

  it('shows neither shell once loaded', () => {
    expect(accountsShell(loaded, false)).toEqual({ isLoading: false, isError: false })
  })

  it('is an error once a read failed and nothing is retrying', () => {
    expect(accountsShell(failed, false)).toEqual({ isLoading: false, isError: true })
  })

  it('is loading, not an error, while a failed read is being retried', () => {
    expect(accountsShell({ ...failed, isFetching: true }, false)).toEqual({ isLoading: true, isError: false })
  })

  // The refetch after a Disconnect is a 404, which must not show up as a failure before the section goes.
  it.each([failed, { ...failed, isFetching: true }, loading, loaded])(
    'shows neither shell while a disconnect is pending or done (%j)',
    (query) => {
      expect(accountsShell(query, true)).toEqual({ isLoading: false, isError: false })
    },
  )
})
