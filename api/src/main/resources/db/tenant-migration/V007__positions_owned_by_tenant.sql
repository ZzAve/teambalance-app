-- Positions become tenant data (ADR-0026, amending ADR-0013 §"Position is a fixed per-team
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

-- One row per member per team, holding the profile that belongs to THIS team: what they are called
-- here and what they play here. Both were platform columns before — display_name on public.users and
-- position_id on public.team_members — which under ADR-0023's multi-team membership meant renaming
-- yourself in one team renamed you in every team you belong to. That is a live defect, not a
-- hypothetical one, and splitting the row is what fixes it.
--
-- user_id carries no foreign key: it names a public.users row, and identity is the one genuinely
-- platform-wide thing. That is the residual cross-schema edge after this move, and it points from
-- tenant data at the platform rather than the other way round.
--
-- ON DELETE SET NULL, not CASCADE: deleting a position must leave the member — and their name — in
-- place and merely unassign them (ADR-0013), which was a PositionService responsibility precisely
-- because no foreign key could span the schemas. Cascading here would delete the whole profile.
CREATE TABLE member_profiles (
    user_id      UUID PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    position_id  UUID NULL REFERENCES positions(id) ON DELETE SET NULL,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_member_profiles_position ON member_profiles (position_id);

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

-- The profile carries the name each member already has, so nobody is renamed by this migration; the
-- platform copy stays behind as the teamless fallback.
--
-- The position is LEFT joined to `positions` rather than trusting tm.position_id: the insert above
-- can legitimately skip a row (a label already present in this schema keeps the id it already had),
-- and carrying an assignment whose position was skipped would point at nothing. A plain join would
-- instead drop the member's whole profile, which is why it is an outer one — they keep their name
-- and simply arrive unassigned.
INSERT INTO member_profiles (user_id, display_name, position_id)
SELECT tm.user_id, u.display_name, p.id
FROM   public.team_members tm
JOIN   public.teams t ON t.id = tm.team_id
JOIN   public.users u ON u.id = tm.user_id
LEFT   JOIN positions p ON p.id = tm.position_id
WHERE  t.schema_name = current_schema()
ON CONFLICT (user_id) DO NOTHING;
