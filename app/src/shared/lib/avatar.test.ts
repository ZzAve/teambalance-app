import { describe, expect, it } from 'vitest'
import { avatarColor, avatarInitials } from './avatar'

// Pure, non-rendering logic: a UUID-keyed avatar colour and initials. The colour must be stable
// per person across every listing and survive display-name changes, so it hashes the UUID — not
// the name — into a fixed 6-entry palette of CSS-var tokens.
const PALETTE = [
  'var(--color-blue)',
  'var(--color-green)',
  'var(--color-gold)',
  'var(--color-red)',
  'var(--color-purple)',
  'var(--color-orange)',
]

describe('avatarColor', () => {
  it('returns the same colour for the same UUID across repeated calls', () => {
    const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    expect(avatarColor(uuid)).toBe(avatarColor(uuid))
  })

  it('always returns one of the six palette tokens', () => {
    const uuids = [
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      '00000000-0000-0000-0000-000000000000',
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      '123e4567-e89b-12d3-a456-426614174000',
    ]
    for (const uuid of uuids) {
      expect(PALETTE).toContain(avatarColor(uuid))
    }
  })

  it('handles distinct sample UUIDs without throwing', () => {
    expect(() => avatarColor('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).not.toThrow()
    expect(() => avatarColor('123e4567-e89b-12d3-a456-426614174000')).not.toThrow()
  })
})

describe('avatarInitials', () => {
  it('takes the first character of the first two words, uppercased', () => {
    expect(avatarInitials('jane doe')).toBe('JD')
  })

  it('handles a single word', () => {
    expect(avatarInitials('madonna')).toBe('M')
  })
})
