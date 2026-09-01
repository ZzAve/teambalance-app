-- ADR-0024 §5 (issue #240): memberless team creation by a Platform Admin, plus an Admin-granting,
-- single-use Invite Link that hands a prepared team over to its first Admin.
--
-- Auto-pinned to `public` by spring.flyway.schemas (application.yml).

-- 1. Team-creation provenance. The platform owner needs to see which teams were created, when, and by
--    whom, uniformly across BOTH create paths — the self-service founder flow and the new memberless
--    admin flow. `created_at` already answers "when"; `created_by` answers "by whom" without having to
--    join through team_creation_codes (which the memberless path never touches). Nullable: pre-existing
--    teams have no recorded creator. FK ON DELETE SET NULL, matching team_creation_codes.created_team_id
--    — deleting a user never blocks on this historical record.
ALTER TABLE teams
    ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- 2. The Role an Invite Link grants. Default 'USER' keeps every existing link, and the ordinary
--    self-service mint, exactly as before (ADR-0025's "one link, many joiners"). Only an explicitly
--    ADMIN-minted handover link carries 'ADMIN'.
ALTER TABLE invitations
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER',
    ADD CONSTRAINT valid_invitation_role CHECK (role IN ('USER', 'ADMIN'));

-- 3. Single-use marker for ADMIN links. An ADMIN grant with the shareable link's many-joiner semantics
--    would hand Admin to everyone the recipient forwards it to, so an ADMIN link is spent on first
--    accept (ADR-0024 §5, decided in #240). `consumed_at` is set by the one accept that wins the
--    conditional consume; NULL means unspent. USER links never set it — they stay reusable. Kept NULL
--    for every existing row by leaving it nullable with no default.
ALTER TABLE invitations
    ADD COLUMN consumed_at TIMESTAMPTZ;
