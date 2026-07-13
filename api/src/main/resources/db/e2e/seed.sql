-- E2e seed fixture — applied only under the `e2e` Spring profile by E2eEnvironmentInitializer,
-- AFTER Flyway (platform) and provisionTenantSchema('team_test') have run.
-- Pure INSERTs only (no DDL); idempotent so repeated backend starts against the same DB are safe.

INSERT INTO public.teams (id, name, slug, sport, schema_name)
VALUES ('e2e00000-0000-0000-0000-000000000001', 'E2E Test Team', 'e2e-test-team', 'volleyball', 'team_test')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, email, display_name)
VALUES ('e2e00000-0000-0000-0000-000000000002', 'e2e@example.com', 'E2E Tester')
ON CONFLICT DO NOTHING;

INSERT INTO public.team_members (id, team_id, user_id, role)
VALUES (
    'e2e00000-0000-0000-0000-000000000003',
    'e2e00000-0000-0000-0000-000000000001',
    'e2e00000-0000-0000-0000-000000000002',
    'ADMIN'
)
ON CONFLICT DO NOTHING;
