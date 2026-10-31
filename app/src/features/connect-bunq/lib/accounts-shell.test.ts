import { describe, expect, it } from 'vitest'
import { accountsShell } from './accounts-shell'

const loading = { isSuccess: false, isError: false, isFetching: true }
const loaded = { isSuccess: true, isError: false, isFetching: false }
const failed = { isSuccess: false, isError: true, isFetching: false }

const idle = { isPending: false, isSuccess: false }
const pending = { isPending: true, isSuccess: false }
const done = { isPending: false, isSuccess: true }

const statusLoaded = { isError: false, isFetching: false }
const statusFailed = { isError: true, isFetching: false }

describe('accountsShell', () => {
  it('is loading until the first answer', () => {
    expect(accountsShell(loading, idle, statusLoaded)).toEqual({ isLoading: true, isError: false })
  })

  it('shows neither shell once loaded', () => {
    expect(accountsShell(loaded, idle, statusLoaded)).toEqual({ isLoading: false, isError: false })
  })

  it('is an error once a read failed and nothing is retrying', () => {
    expect(accountsShell(failed, idle, statusLoaded)).toEqual({ isLoading: false, isError: true })
  })

  it('is loading, not an error, while a failed read is being retried', () => {
    expect(accountsShell({ ...failed, isFetching: true }, idle, statusLoaded)).toEqual({ isLoading: true, isError: false })
  })

  // The refetch after a Disconnect is a 404, which must not show up as a failure before the section goes.
  it.each([failed, { ...failed, isFetching: true }, loading, loaded])(
    'shows neither shell while a disconnect is pending (%j)',
    (query) => {
      expect(accountsShell(query, pending, statusLoaded)).toEqual({ isLoading: false, isError: false })
    },
  )

  it.each([failed, { ...failed, isFetching: true }, loading, loaded])(
    'shows neither shell after a disconnect while the status read has not failed (%j)',
    (query) => {
      expect(accountsShell(query, done, statusLoaded)).toEqual({ isLoading: false, isError: false })
      expect(accountsShell(query, done, { isError: true, isFetching: true })).toEqual({ isLoading: false, isError: false })
    },
  )

  // Without the status the section stays, so the shells have to say what the accounts read says.
  it('shows the accounts shells again once the status read after a disconnect failed', () => {
    expect(accountsShell(failed, done, statusFailed)).toEqual({ isLoading: false, isError: true })
    expect(accountsShell(loaded, done, statusFailed)).toEqual({ isLoading: false, isError: false })
  })

  it('keeps the mask while the disconnect itself is pending, whatever the status says', () => {
    expect(accountsShell(failed, pending, statusFailed)).toEqual({ isLoading: false, isError: false })
  })
})
