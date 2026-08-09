-- Self-service onboarding (ADR-0015) creates teams from a name + creation code only — no sport is
-- collected. The column was never surfaced in the API or UI and carried a single placeholder value,
-- so drop it. Auto-pinned to `public` by spring.flyway.schemas (application.yml).
--
-- Note: the test-only seed V1_1__seed_demo_data.sql still inserts a sport value; it runs at version 1.1
-- (before this drop), reflecting the schema as it was then — exactly like it still seeds the legacy
-- team_role column that V003 later drops. Post-migration insert sites (dev/e2e seeds, ITs, the runbook)
-- run after this drop and therefore omit sport.
ALTER TABLE teams DROP COLUMN sport;
