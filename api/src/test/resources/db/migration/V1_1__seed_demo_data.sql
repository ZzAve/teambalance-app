-- Demo team and users, test fixture only.
--
-- This lives in src/test/resources so it is merged into classpath:db/migration ONLY on the test
-- classpath — provisionPlatformSchema() (TenantSchemaManager) picks it up in Kotest ITs but it is
-- absent from the production jar, so prod applies just V001, V002. Versioned V1_1 so it slots
-- between the platform schema (V001) and magic-link tokens (V002) without breaking the prod
-- sequence. The dev-run equivalent is db/seed/demo_data.sql (loaded by DemoDataSeeder, @Profile dev).

INSERT INTO teams (id, name, slug, sport, schema_name) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Setpoint VT', 'setpoint-vt', 'Volleyball', 'team_setpoint_vt');

INSERT INTO users (id, email, display_name) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'jan@example.com', 'Jan de Vries'),
    ('b0000000-0000-0000-0000-000000000002', 'lisa@example.com', 'Lisa Bakker'),
    ('b0000000-0000-0000-0000-000000000003', 'tom@example.com', 'Tom Visser'),
    ('b0000000-0000-0000-0000-000000000004', 'emma@example.com', 'Emma Jansen'),
    ('b0000000-0000-0000-0000-000000000005', 'daan@example.com', 'Daan Mulder'),
    ('b0000000-0000-0000-0000-000000000006', 'sophie@example.com', 'Sophie van Dijk');

-- NOTE: this migration runs at version 1.1, BEFORE V003 introduces team_positions and drops team_role,
-- so it still seeds the legacy team_role column. V003's backfill then promotes these to positions —
-- which conveniently exercises the migration on every test run (Setter/Libero/Middle/Outside survive).
INSERT INTO team_members (team_id, user_id, role, team_role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ADMIN', 'Setter'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'USER', 'Libero'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'USER', 'Middle'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'USER', 'Outside'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'USER', 'Outside'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'USER', 'Setter');
