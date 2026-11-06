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

-- Ten more players (fictional names). Together with Sanne and Coach Kees the roster is 12.
INSERT INTO public.users (id, email, display_name)
VALUES ('d0000000-0000-0000-0001-000000000001', 'lotte@demo.teambalance.nl', 'Lotte Hendriks'),
       ('d0000000-0000-0000-0001-000000000002', 'daan@demo.teambalance.nl', 'Daan Bosman'),
       ('d0000000-0000-0000-0001-000000000003', 'femke@demo.teambalance.nl', 'Femke de Boer'),
       ('d0000000-0000-0000-0001-000000000004', 'bram@demo.teambalance.nl', 'Bram Kuipers'),
       ('d0000000-0000-0000-0001-000000000005', 'noor@demo.teambalance.nl', 'Noor van Leeuwen'),
       ('d0000000-0000-0000-0001-000000000006', 'sem@demo.teambalance.nl', 'Sem Dijkstra'),
       ('d0000000-0000-0000-0001-000000000007', 'anouk@demo.teambalance.nl', 'Anouk Meijer'),
       ('d0000000-0000-0000-0001-000000000008', 'thijs@demo.teambalance.nl', 'Thijs Vermeulen'),
       ('d0000000-0000-0000-0001-000000000009', 'julia@demo.teambalance.nl', 'Julia Brouwer'),
       ('d0000000-0000-0000-0001-000000000010', 'fleur@demo.teambalance.nl', 'Fleur Smeets')
ON CONFLICT DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role, onboarded_at)
SELECT 'd0000000-0000-0000-0000-000000000001', u.id, 'USER', now()
FROM public.users u
WHERE u.id::text LIKE 'd0000000-0000-0000-0001-%'
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO team_de_smashers.positions (id, label)
VALUES ('d0000000-0000-0000-0002-000000000001', 'Spelverdeler'),
       ('d0000000-0000-0000-0002-000000000002', 'Buiten'),
       ('d0000000-0000-0000-0002-000000000003', 'Midden'),
       ('d0000000-0000-0000-0002-000000000004', 'Diagonaal'),
       ('d0000000-0000-0000-0002-000000000005', 'Libero')
ON CONFLICT DO NOTHING;

-- The profile holds the name, position and shirt number a member has in this team. Coach Kees plays no position.
INSERT INTO team_de_smashers.member_profiles (user_id, display_name, position_id, shirt_number)
VALUES ('d0000000-0000-0000-0000-000000000011', 'Sanne', 'd0000000-0000-0000-0002-000000000002', 7),
       ('d0000000-0000-0000-0000-000000000012', 'Coach Kees', NULL, NULL),
       ('d0000000-0000-0000-0001-000000000001', 'Lotte Hendriks', 'd0000000-0000-0000-0002-000000000001', 1),
       ('d0000000-0000-0000-0001-000000000002', 'Daan Bosman', 'd0000000-0000-0000-0002-000000000001', 9),
       ('d0000000-0000-0000-0001-000000000003', 'Femke de Boer', 'd0000000-0000-0000-0002-000000000002', 4),
       ('d0000000-0000-0000-0001-000000000004', 'Bram Kuipers', 'd0000000-0000-0000-0002-000000000002', 11),
       ('d0000000-0000-0000-0001-000000000005', 'Noor van Leeuwen', 'd0000000-0000-0000-0002-000000000003', 5),
       ('d0000000-0000-0000-0001-000000000006', 'Sem Dijkstra', 'd0000000-0000-0000-0002-000000000003', 8),
       ('d0000000-0000-0000-0001-000000000007', 'Anouk Meijer', 'd0000000-0000-0000-0002-000000000004', 10),
       ('d0000000-0000-0000-0001-000000000008', 'Thijs Vermeulen', 'd0000000-0000-0000-0002-000000000004', 14),
       ('d0000000-0000-0000-0001-000000000009', 'Julia Brouwer', 'd0000000-0000-0000-0002-000000000005', 2),
       ('d0000000-0000-0000-0001-000000000010', 'Fleur Smeets', 'd0000000-0000-0000-0002-000000000005', 3)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO team_de_smashers.substitutes (id, name, position_id, created_by, shirt_number)
VALUES ('d0000000-0000-0000-0003-000000000001', 'Joris Hoekstra', 'd0000000-0000-0000-0002-000000000002',
        'd0000000-0000-0000-0000-000000000012', 15)
ON CONFLICT DO NOTHING;

-- Two past and four upcoming events, relative to the seed time. The reset re-seeds hourly, so they stay current; a
-- plain re-run moves the times of the events that already exist.
INSERT INTO team_de_smashers.events (uuid, event_type_id, title, description, start_time, end_time, location, created_by)
SELECT e.uuid::uuid, et.id, e.title, e.description, e.start_time, e.start_time + e.duration, e.location,
       'd0000000-0000-0000-0000-000000000012'::uuid
FROM (VALUES
    ('d0000000-0000-0000-0000-000000000032', 'Training', 'Training', 'Wekelijkse training',
        now() - interval '9 days', interval '2 hours', 'Sporthal De Smash'),
    ('d0000000-0000-0000-0000-000000000033', 'Match', 'Thuiswedstrijd tegen VC Blokkade', 'Competitie, poule B',
        now() - interval '3 days', interval '2 hours 30 minutes', 'Sporthal De Smash'),
    ('d0000000-0000-0000-0000-000000000031', 'Training', 'Training', 'Wekelijkse training',
        now() + interval '1 day', interval '2 hours', 'Sporthal De Smash'),
    ('d0000000-0000-0000-0000-000000000034', 'Match', 'Thuiswedstrijd tegen Spikers ''88', 'Competitie, poule B',
        now() + interval '5 days', interval '2 hours 30 minutes', 'Sporthal De Smash'),
    ('d0000000-0000-0000-0000-000000000035', 'Match', 'Uitwedstrijd bij VC Het Net', 'Competitie, poule B. Verzamelen bij de hal.',
        now() + interval '9 days', interval '2 hours 30 minutes', 'Sporthal De Hoek'),
    ('d0000000-0000-0000-0000-000000000036', 'Other', 'Teamborrel', 'Even bijpraten na de wedstrijd',
        now() + interval '13 days', interval '3 hours', 'Café De Libero')
) AS e(uuid, type_name, title, description, start_time, duration, location)
JOIN team_de_smashers.event_types et ON et.name = e.type_name
ON CONFLICT (uuid) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time;

-- Past events: everyone has answered, a stable mix of states. NOT_RESPONDED is the absence of a row.
INSERT INTO team_de_smashers.attendances (event_id, user_id, state, changed_by)
SELECT e.id, p.user_id,
       CASE abs(hashtext(p.user_id::text || e.uuid::text)) % 6 WHEN 0 THEN 'ABSENT' WHEN 1 THEN 'MAYBE' ELSE 'ATTENDING' END,
       p.user_id
FROM team_de_smashers.events e
CROSS JOIN team_de_smashers.member_profiles p
WHERE e.uuid IN ('d0000000-0000-0000-0000-000000000032', 'd0000000-0000-0000-0000-000000000033')
ON CONFLICT (event_id, user_id) DO NOTHING;

-- The next event (the training) is half-answered, and not by Sanne, who is the one who answers it in the demo.
INSERT INTO team_de_smashers.attendances (event_id, user_id, state, changed_by)
SELECT e.id, a.user_id::uuid, a.state, a.user_id::uuid
FROM team_de_smashers.events e
CROSS JOIN (VALUES
    ('d0000000-0000-0000-0001-000000000001', 'ATTENDING'),
    ('d0000000-0000-0000-0001-000000000002', 'ATTENDING'),
    ('d0000000-0000-0000-0001-000000000003', 'MAYBE'),
    ('d0000000-0000-0000-0001-000000000005', 'ATTENDING'),
    ('d0000000-0000-0000-0001-000000000006', 'ABSENT'),
    ('d0000000-0000-0000-0001-000000000009', 'ATTENDING')
) AS a(user_id, state)
WHERE e.uuid = 'd0000000-0000-0000-0000-000000000031'
ON CONFLICT (event_id, user_id) DO NOTHING;

-- The substitute is called in for the home match.
INSERT INTO team_de_smashers.substitute_attendances (event_id, substitute_id, state, changed_by)
SELECT e.id, 'd0000000-0000-0000-0003-000000000001', 'ATTENDING', 'd0000000-0000-0000-0000-000000000012'
FROM team_de_smashers.events e
WHERE e.uuid = 'd0000000-0000-0000-0000-000000000034'
ON CONFLICT (event_id, substitute_id) DO NOTHING;

-- The pool's top-up link. The demo build's Top up button opens the in-app demo page instead of following it; the
-- value only has to be a bunq.me page, which the API and the SPA both require. MoneyPoolService refuses to change it.
-- The Bunq connection is written by DemoTeamSeeder: its grant is encrypted for this team, which SQL cannot do.
UPDATE team_de_smashers.money_pool_settings SET bunq_me_link = 'https://bunq.me/demo' WHERE id = 1;
