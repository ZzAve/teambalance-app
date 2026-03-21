-- Demo team and users for development. Remove before production.

INSERT INTO teams (id, name, slug, sport, schema_name) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Setpoint VT', 'setpoint-vt', 'Volleyball', 'team_setpoint_vt');

INSERT INTO users (id, email, display_name) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'jan@example.com', 'Jan de Vries'),
    ('b0000000-0000-0000-0000-000000000002', 'lisa@example.com', 'Lisa Bakker'),
    ('b0000000-0000-0000-0000-000000000003', 'tom@example.com', 'Tom Visser'),
    ('b0000000-0000-0000-0000-000000000004', 'emma@example.com', 'Emma Jansen'),
    ('b0000000-0000-0000-0000-000000000005', 'daan@example.com', 'Daan Mulder'),
    ('b0000000-0000-0000-0000-000000000006', 'sophie@example.com', 'Sophie van Dijk');

INSERT INTO team_members (team_id, user_id, role, team_role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ADMIN', 'Setter'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'USER', 'Libero'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'USER', 'Middle'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'USER', 'Outside'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'USER', 'Outside'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'USER', 'Setter');
