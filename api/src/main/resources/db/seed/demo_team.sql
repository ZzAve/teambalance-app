-- Guest-login demo team (ADR-0043), applied by DemoTeamSeeder when teambalance.demo.enabled is on,
-- AFTER Flyway and provisionTenant('team_de_smashers'). Pure INSERTs, idempotent.
-- The ids are the literals in DemoPersona.

INSERT INTO public.teams (id, name, slug, schema_name)
VALUES ('d0000000-0000-0000-0000-000000000001', 'VC De Smashers', 'de-smashers', 'team_de_smashers')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, email, display_name)
VALUES ('d0000000-0000-0000-0000-000000000011', 'sanne@demo.teambalance.nl', 'Sanne'),
       ('d0000000-0000-0000-0000-000000000012', 'kees@demo.teambalance.nl', 'Coach Kees')
ON CONFLICT DO NOTHING;

-- onboarded_at is stamped so the guest skips the /welcome gate and lands on events.
INSERT INTO public.team_members (id, team_id, user_id, role, onboarded_at)
VALUES (
    'd0000000-0000-0000-0000-000000000021',
    'd0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000011',
    'USER',
    now()
), (
    'd0000000-0000-0000-0000-000000000022',
    'd0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000012',
    'ADMIN',
    now()
)
ON CONFLICT (id) DO UPDATE SET onboarded_at = EXCLUDED.onboarded_at;

-- One upcoming event. No attendance row: NOT_RESPONDED is the absence of a row.
INSERT INTO team_de_smashers.events (uuid, event_type_id, title, description, start_time, end_time, location, created_by)
SELECT
    'd0000000-0000-0000-0000-000000000031',
    et.id,
    'Training',
    'Wekelijkse training',
    now() + interval '3 days',
    now() + interval '3 days 2 hours',
    'Sporthal De Smash',
    'd0000000-0000-0000-0000-000000000011'
FROM team_de_smashers.event_types et
WHERE et.name = 'Training'
ON CONFLICT DO NOTHING;
