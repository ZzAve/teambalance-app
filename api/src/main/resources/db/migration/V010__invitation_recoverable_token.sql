-- ADR-0025: the Invite Link becomes recoverable at rest, so an admin can see and re-copy the team's
-- current link after a page refresh instead of being forced to mint a new one.
--
-- `token` (the salted hash) keeps its job: it is still what the accept path matches on. The new
-- column carries the same token under AES-256-GCM, read only by the admin-only GET.
ALTER TABLE invitations
    ADD COLUMN token_encrypted VARCHAR(255);

-- Every pre-existing invitation is hash-only, so its plaintext is unrecoverable and it can never be
-- surfaced. It is also unknowable which of a team's live tokens was the one actually shared: until
-- now the frontend minted a fresh link on every dialog-open, so teams accumulated an unbounded
-- number of concurrently-valid links. Expiring them collapses that accumulated exposure and leaves
-- every team at the one-active-link invariant the application now maintains.
--
-- Teams with a link in circulation must generate a new one.
UPDATE invitations
SET expires_at = now()
WHERE expires_at > now();

-- "One active link per team" is deliberately NOT a partial unique index: active-ness is
-- `expires_at > now()`, and Postgres requires an index predicate to be IMMUTABLE, which now() is
-- not. Expressing it in the schema would mean adding a separate revoked-flag column purely to give
-- the index something immutable to bite on, and then keeping two representations of the same fact in
-- sync. The invariant lives in InvitationService instead: generateInviteLink returns the existing
-- active link rather than minting a second, and rotate expires-and-mints inside one transaction.
