-- Issue #342: a Magic Link requested from an Invite Link remembers which invitation it came from, so
-- joining survives the email being opened somewhere else.
--
-- Until now the invite token was carried between the two page loads (/invite/:token, then the emailed
-- /auth/verify) in the joiner's localStorage. That is per browser profile, not per person: opening the
-- email on a laptop after tapping the link on a phone, or in Safari after tapping it in WhatsApp's
-- in-app browser, lost it. The server never heard about the invite at all, so it could not repair it.
--
-- The reference lives here rather than in the emailed URL. A magic link is single-use and expires in
-- 15 minutes; an Invite Link is reusable and lives until an admin rotates it. Putting the invite token
-- in the email would have written a long-lived join credential into every joiner's mailbox, with a
-- lifetime nobody reading "this link expires in 15 minutes" would expect. Carrying an id instead adds
-- nothing recoverable to the database, so ADR-0025's threat model is unchanged.
--
-- Auto-pinned to `public` by spring.flyway.schemas (application.yml).
ALTER TABLE magic_link_tokens
    ADD COLUMN invitation_id UUID REFERENCES invitations(id) ON DELETE SET NULL;

-- The binding is to this one magic link, not to the email address. That is deliberate: anyone can
-- request a magic link for any address, so an email-keyed pending invite would let an attacker attach
-- a team to a sign-in the recipient requested themselves. Bound to the row, an invite can only ride
-- the one link it was requested with.
COMMENT ON COLUMN magic_link_tokens.invitation_id IS
    'The Invite Link this sign-in was requested from, accepted on verification; null for an ordinary login.';
