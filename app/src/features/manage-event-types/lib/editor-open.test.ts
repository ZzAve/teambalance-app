import { describe, expect, it } from 'vitest'
import { isEditorOpen } from './editor-open'

describe('isEditorOpen', () => {
  it('is closed with nothing being edited', () => {
    expect(isEditorOpen({ hasDraft: false, submitted: false })).toBe(false)
  })

  it('is open while a draft is being edited', () => {
    expect(isEditorOpen({ hasDraft: true, submitted: false })).toBe(true)
  })

  // Optimistic: the admin sees the save land immediately rather than watching a spinner.
  it('closes as soon as the draft is submitted', () => {
    expect(isEditorOpen({ hasDraft: true, submitted: true })).toBe(false)
  })

  // The point of the whole rule: a rejected save must not cost the admin what they typed.
  it('comes back when the save is rejected, so the draft is not lost', () => {
    expect(isEditorOpen({ hasDraft: true, submitted: true, errorCode: 'EVENT_TYPE_NAME_TAKEN' })).toBe(true)
  })

  // An error with nothing being edited is a failed archive, not a failed save — nothing to reopen.
  it('stays closed for an error raised outside the editor', () => {
    expect(isEditorOpen({ hasDraft: false, submitted: false, errorCode: 'LAST_EVENT_TYPE' })).toBe(false)
  })
})
