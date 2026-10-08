import { describe, expect, it } from 'vitest'
import { summarizeMutations } from './mutation-group'

class FirstError extends Error {}
class SecondError extends Error {}

describe('summarizeMutations', () => {
  it('reports nothing for idle mutations', () => {
    expect(summarizeMutations(FirstError, { error: null, isPending: false })).toEqual({ error: null, isSaving: false })
  })

  it('reports saving when any mutation is pending', () => {
    const { isSaving } = summarizeMutations(
      FirstError,
      { error: null, isPending: false },
      { error: null, isPending: true },
    )
    expect(isSaving).toBe(true)
  })

  it('returns the first error of the given class and ignores others', () => {
    const wanted = new FirstError('wanted')
    const { error } = summarizeMutations(
      FirstError,
      { error: new SecondError('other'), isPending: false },
      { error: wanted, isPending: false },
      { error: new FirstError('later'), isPending: false },
    )
    expect(error).toBe(wanted)
  })
})
