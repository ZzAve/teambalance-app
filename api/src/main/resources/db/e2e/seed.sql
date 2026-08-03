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

INSERT INTO team_test.attendances (uuid, event_id, user_id, state, changed_by)
SELECT
    'e2e00000-0000-0000-0000-000000000005',
    e.id,
    'e2e00000-0000-0000-0000-000000000002',
    'NOT_RESPONDED',
    'e2e00000-0000-0000-0000-000000000002'
FROM team_test.events e
WHERE e.uuid = 'e2e00000-0000-0000-0000-000000000004'
ON CONFLICT DO NOTHING;
