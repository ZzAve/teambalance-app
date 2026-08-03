-- Record which team a creation code produced (NULL until create-team consumes it). Lets the
-- codes-admin surface (#154 Slice 4) show the team a code was redeemed into. FK to teams with
-- ON DELETE SET NULL, so deleting a team never blocks on the historical code record. Auto-pinned
-- to `public` by spring.flyway.schemas (application.yml).
ALTER TABLE team_creation_codes
    ADD COLUMN created_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
