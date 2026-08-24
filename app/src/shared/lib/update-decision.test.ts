import { describe, expect, it } from 'vitest'
import { decideUpdateAction, type UpdateSignals } from './update-decision'

// The plan's decision table IS the test matrix: each row is one situation → one action.
const base: UpdateSignals = {
  hasController: true,
  hasInteracted: false,
  visibility: 'visible',
  isDirty: false,
}

describe('decideUpdateAction', () => {
  it('activates on a first install — no existing controller, nothing to prompt', () => {
    expect(decideUpdateAction({ ...base, hasController: false })).toBe('activate')
    // First install wins even over dirty state: there is no prior version to preserve work against.
    expect(
      decideUpdateAction({ ...base, hasController: false, isDirty: true, hasInteracted: true }),
    ).toBe('activate')
  })

  it('auto-applies silently when the tab is hidden and clean', () => {
    expect(
      decideUpdateAction({ ...base, hasInteracted: true, visibility: 'hidden' }),
    ).toBe('auto')
  })

  it('auto-applies on a fresh load before the user has interacted', () => {
    expect(decideUpdateAction({ ...base, hasInteracted: false })).toBe('auto')
  })

  it('defers to the next safe seam when focused, interacted, and clean', () => {
    expect(decideUpdateAction({ ...base, hasInteracted: true })).toBe('defer')
  })

  it('prompts when there is unsaved / in-flight state', () => {
    expect(decideUpdateAction({ ...base, hasInteracted: true, isDirty: true })).toBe('prompt')
  })

  it('protects dirty state even when the tab is hidden — never silently reload away work', () => {
    expect(
      decideUpdateAction({ ...base, hasInteracted: true, visibility: 'hidden', isDirty: true }),
    ).toBe('prompt')
  })
})
