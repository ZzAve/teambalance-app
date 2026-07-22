import { afterEach, describe, expect, it } from 'vitest'
import { savePendingInviteToken, takePendingInviteTokenForEmail } from './invitations'

// Pure client-side gate for the pending-invite-token carry (no network, no rendering). The RTL
// invite-flow test proves the cross-page-load round trip end to end; this covers the security
// branch it can't cheaply force — a verified user whose email does NOT match the one the invite
// was requested with must not silently inherit someone else's invite.
afterEach(() => localStorage.clear())

describe('pending invite token gate', () => {
  it('hands the token back when the verified email matches the one it was saved for', () => {
    savePendingInviteToken('invite-abc', 'newbie@example.com')
    expect(takePendingInviteTokenForEmail('newbie@example.com')).toBe('invite-abc')
  })

  it('withholds the token when a different email verifies (no silently accepting someone else\'s invite)', () => {
    savePendingInviteToken('invite-abc', 'newbie@example.com')
    expect(takePendingInviteTokenForEmail('someone-else@example.com')).toBeNull()
  })

  it('returns null when no invite token was pending', () => {
    expect(takePendingInviteTokenForEmail('newbie@example.com')).toBeNull()
  })

  it('always clears both keys, even on an email mismatch, so a stale token can never leak into a later sign-in', () => {
    savePendingInviteToken('invite-abc', 'newbie@example.com')

    takePendingInviteTokenForEmail('someone-else@example.com')

    expect(localStorage.getItem('tb-pending-invite-token')).toBeNull()
    expect(localStorage.getItem('tb-pending-invite-email')).toBeNull()
  })
})
