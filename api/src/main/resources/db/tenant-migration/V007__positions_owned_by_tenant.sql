-- Positions become tenant data (ADR-0025, amending ADR-0013 §"Position is a fixed per-team
-- vocabulary"). A position is a thing a team defines about how it plays; reading it out of the
-- platform schema made it look global, and left it outside the schema-routing guarantee that
-- ADR-0024's act-as safety rests on (TenantContext: platform entities "remain reachable regardless"
-- of whether a tenant resolved, so a lapse fails loudly for tenant tables and silently succeeds for
-- these).
--
-- EXPAND half of an expand/contract move. The platform tables are left in place and simply stop
-- being read: PlatformSchemaInitializer runs every platform migration before
-- StartupTenantMigrationRunner runs any tenant one, so a platform migration dropping the source
-- would execute before this file could copy from it. The DROP is a separate, later release.

-- The schema IS the team, so there is no team_id column and the label is unique within the schema.
CREATE TABLE positions (
    id         UUID PRIMARY KEY,
    label      VARCHAR(50)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uq_positions_label ON positions (lower(label));

-- One position per member, matching what team_members.position_id expressed: a nullable single
-- value, here modelled as the row's presence. user_id carries no foreign key — it names a
-- public.users row, and identity is the one thing that is genuinely platform-wide. That is the
-- residual cross-schema edge after this move, and it points the right way.
--
-- ON DELETE CASCADE replaces application code: ADR-0013 says deleting a position in use reassigns
-- its members to NULL, which was a PositionService responsibility precisely because no foreign key
-- could span the schemas. Now the database does it.
CREATE TABLE member_positions (
    user_id     UUID PRIMARY KEY,
    position_id UUID NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_member_positions_position ON member_positions (position_id);

-- Backfill from the platform tables for THIS tenant only. current_schema() identifies the team via
-- public.teams.schema_name, which is how every tenant schema is addressed.
--
-- Ids are copied verbatim rather than regenerated: event_type_position_targets and
-- event_position_targets (#219) already reference them, as does any client holding one. A fresh
-- gen_random_uuid() here would silently orphan every one of those.
-- Bare ON CONFLICT (any unique violation, not just the primary key): in production a schema belongs
-- to exactly one team, but the test and e2e fixtures point several teams at `public`, so the same
-- label can arrive twice and would otherwise trip uq_positions_label and fail the migration.
INSERT INTO positions (id, label, created_at)
SELECT tp.id, tp.label, tp.created_at
FROM   public.team_positions tp
JOIN   public.teams t ON t.id = tp.team_id
WHERE  t.schema_name = current_schema()
ON CONFLICT DO NOTHING;

-- Joined to `positions` rather than trusting tm.position_id: the insert above can legitimately skip
-- a row (a label already present in this schema keeps the id it already had), and copying an
-- assignment whose position was skipped would point at nothing. The foreign key would reject it —
-- which is how this was found — but the right answer is to carry over only assignments whose
-- position actually landed here, exactly as a target naming an absent position is ignored.
INSERT INTO member_positions (user_id, position_id)
SELECT tm.user_id, tm.position_id
FROM   public.team_members tm
JOIN   public.teams t ON t.id = tm.team_id
JOIN   positions p ON p.id = tm.position_id
WHERE  t.schema_name = current_schema()
  AND  tm.position_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;
