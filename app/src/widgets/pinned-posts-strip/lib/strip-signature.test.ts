import { describe, expect, it } from 'vitest'
import { stripSignature } from './strip-signature'

const rotation = { id: 'a', postedAt: '2026-11-01T10:00:00Z', edits: [] }
const closing = { id: 'b', postedAt: '2026-11-02T10:00:00Z', edits: [] }

describe('stripSignature', () => {
  it('does not depend on the order of the posts', () => {
    expect(stripSignature([rotation, closing])).toBe(stripSignature([closing, rotation]))
  })

  it('changes when a post is pinned or unpinned', () => {
    expect(stripSignature([rotation, closing])).not.toBe(stripSignature([rotation]))
  })

  it('changes when a pinned post is edited', () => {
    const edited = { ...rotation, edits: [{ editedAt: '2026-11-03T10:00:00Z' }] }
    expect(stripSignature([edited])).not.toBe(stripSignature([rotation]))
  })
})
