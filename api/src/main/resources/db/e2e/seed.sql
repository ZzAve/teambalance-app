-- E2e seed fixture — applied only under the `e2e` Spring profile by E2eEnvironmentInitializer,
-- AFTER Flyway (platform) and provisionTenantSchema('team_test') have run.
-- Pure INSERTs only (no DDL); idempotent so repeated backend starts against the same DB are safe.

INSERT INTO public.teams (id, name, slug, schema_name)
VALUES ('e2e00000-0000-0000-0000-000000000001', 'E2E Test Team', 'e2e-test-team', 'team_test')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, email, display_name)
VALUES ('e2e00000-0000-0000-0000-000000000002', 'e2e@example.com', 'E2E Tester')
ON CONFLICT DO NOTHING;

-- onboarded_at is stamped (not NULL) so the seeded admin skips the /welcome gate and lands on
-- events — otherwise the login/attendance/auth-guard specs would all bounce to onboarding.
-- Upsert (not DO NOTHING) on the PK so a warm local DB whose row predates this column still gets
-- stamped — a plain insert would be skipped and leave onboarded_at NULL.
INSERT INTO public.team_members (id, team_id, user_id, role, onboarded_at)
VALUES (
    'e2e00000-0000-0000-0000-000000000003',
    'e2e00000-0000-0000-0000-000000000001',
    'e2e00000-0000-0000-0000-000000000002',
    'ADMIN',
    now()
)
ON CONFLICT (id) DO UPDATE SET onboarded_at = EXCLUDED.onboarded_at;

-- A creation code for the self-service create-team e2e (#158). Reset to unconsumed on every backend
-- boot (this seed runs once per `make e2e`), so a warm local DB can re-run the spec without a wipe —
-- the spec pairs it with a per-run-unique founder email, keeping the flow idempotent across re-runs.
INSERT INTO public.team_creation_codes (code, consumed_at, consumed_by_user_id)
VALUES ('E2E-CREATE-TEAM', NULL, NULL)
ON CONFLICT (code) DO UPDATE SET consumed_at = NULL, consumed_by_user_id = NULL;

-- Tenant data for the change-attendance flow (team_test is provisioned before this runs).
-- Event types are seeded per-tenant by tenant-migration V002; resolve the FK by name.
-- start_time is relative so the event stays on the upcoming list; the uuid conflict keeps
-- re-runs from duplicating it (stale start_time on a long-lived local DB is acceptable —
-- CI is always fresh, locally `docker-compose down -v` resets).
-- end_time is required even though the column is nullable: the Event domain model is non-null.
INSERT INTO team_test.events (uuid, event_type_id, title, description, start_time, end_time, location, created_by)
SELECT
    'e2e00000-0000-0000-0000-000000000004',
    et.id,
    'E2E Training',
    'Seeded for the change-attendance e2e flow',
    now() + interval '7 days',
    now() + interval '7 days 2 hours',
    'E2E Sporthal',
    'e2e00000-0000-0000-0000-000000000002'
FROM team_test.event_types et
WHERE et.name = 'Training'
ON CONFLICT DO NOTHING;

-- No attendance row is seeded for the event above, deliberately. NOT_RESPONDED *is* the absence of a
-- row (ADR-0009, ADR-0020): it is resolved by outer-joining the roster, never stored. A materialized
-- NOT_RESPONDED row therefore reads as a blank while behaving as an answer, which breaks any
-- create-only write - Bulk Attend counts such an event as fillable but its guard finds a row and
-- skips it, so the "Attend N" count can never reach zero. The seeded user starts not-responded on
-- the event with no row at all, which is what a real not-responded member looks like.
DELETE FROM team_test.attendances WHERE uuid = 'e2e00000-0000-0000-0000-000000000005';

-- --- Second Team, for the team-switching flow (#143, ADR-0021) -------------------------------
-- A second tenant with its own schema and its own event, so "the data followed the switch" is an
-- observable fact rather than an assumption: each Team's events list names an event the other Team
-- does not have.
--
-- Its admin is a SEPARATE user, deliberately. The shared e2e user must stay a Member of exactly one
-- Team: every other spec signs in as them and expects to land somewhere, and a second membership
-- would (correctly) make that landing a choice instead.

INSERT INTO public.teams (id, name, slug, schema_name)
VALUES ('e2e00000-0000-0000-0000-000000000011', 'E2E Second Team', 'e2e-second-team', 'team_test_two')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, email, display_name)
VALUES ('e2e00000-0000-0000-0000-000000000012', 'e2e-second@example.com', 'E2E Second Admin')
ON CONFLICT DO NOTHING;

INSERT INTO public.team_members (id, team_id, user_id, role, onboarded_at)
VALUES (
    'e2e00000-0000-0000-0000-000000000013',
    'e2e00000-0000-0000-0000-000000000011',
    'e2e00000-0000-0000-0000-000000000012',
    'ADMIN',
    now()
)
ON CONFLICT (id) DO UPDATE SET onboarded_at = EXCLUDED.onboarded_at;

INSERT INTO team_test_two.events (uuid, event_type_id, title, description, start_time, end_time, location, created_by)
SELECT
    'e2e00000-0000-0000-0000-000000000014',
    et.id,
    'E2E Second Team Match',
    'Seeded so the second Team''s events list is distinguishable from the first',
    now() + interval '8 days',
    now() + interval '8 days 2 hours',
    'E2E Second Sporthal',
    'e2e00000-0000-0000-0000-000000000012'
FROM team_test_two.event_types et
WHERE et.name = 'Match'
ON CONFLICT DO NOTHING;
