# Back-office: Provisioning a Team

> **When to use this:** Self-service Team creation is deferred (ADR-0001, ADR-0008).
> Until that is built, the owner provisions new Teams manually using this procedure.

## Prerequisites

- Psql access to the database (local: `make db` starts Postgres on `localhost:5432`)
- The team's: name, slug (URL-safe), sport, and the owner's email address
- A list of initial Members with their display names and Roles (ADR-0009)

## Step 1 — Insert the Team row

Choose a slug and a schema name. The schema name must be a valid Postgres identifier
(lowercase, underscores, no spaces). Convention: `team_<slug_with_underscores>`.

```sql
INSERT INTO teams (name, slug, sport, schema_name)
VALUES (
    'Setpoint VT',          -- Team name
    'setpoint-vt',          -- URL slug
    'Volleyball',           -- Sport (free text)
    'team_setpoint_vt'      -- Postgres schema name (must be unique)
)
RETURNING id, schema_name;
```

Note the returned `id` and `schema_name` — you need both in subsequent steps.

## Step 2 — Provision the tenant schema

The tenant schema holds events, attendances, and transactions for this Team.
Call the Spring Boot actuator endpoint (or run the Flyway migration directly) to
create and migrate the schema.

**Option A — via API (preferred in dev/prod):**

```bash
# Replace <schema_name> with the value from Step 1
curl -X POST http://localhost:8080/internal/admin/teams/<schema_name>/provision
```

> This endpoint is not yet implemented. Until it is, use Option B.

**Option B — direct Flyway via psql:**

```sql
-- Create the schema
CREATE SCHEMA IF NOT EXISTS "team_setpoint_vt";
```

Then restart the application — on startup `TenantSchemaManager` will detect the new
schema and run `db/tenant-migration/` against it. Alternatively, trigger it manually
via the `TenantSchemaManager` bean in a dev console.

## Step 3 — Seed the owner as Admin Member

Upsert the owner into `users` (creates the platform-level identity), then add a
`team_members` row with `role = 'ADMIN'` and their team position in `team_role`.

```sql
-- Create the user (idempotent)
INSERT INTO users (email, display_name)
VALUES ('owner@example.com', 'Jan de Vries')
ON CONFLICT (email) DO NOTHING;

-- Add as Admin team member
INSERT INTO team_members (team_id, user_id, role, team_role)
VALUES (
    '<team_id from Step 1>',
    (SELECT id FROM users WHERE email = 'owner@example.com'),
    'ADMIN',          -- Admin permission (see CONTEXT.md)
    'Setter'          -- Role: team-defined position (ADR-0009)
);
```

## Step 4 — Seed remaining Members (one Role each)

Each Member gets exactly one `team_role` (ADR-0009). Repeat for each person:

```sql
INSERT INTO users (email, display_name)
VALUES ('lisa@example.com', 'Lisa Bakker')
ON CONFLICT (email) DO NOTHING;

INSERT INTO team_members (team_id, user_id, role, team_role)
VALUES (
    '<team_id from Step 1>',
    (SELECT id FROM users WHERE email = 'lisa@example.com'),
    'USER',           -- User permission (see CONTEXT.md)
    'Libero'          -- Role (ADR-0009)
);
```

> **One role per member** is an ADR-0009 constraint. The attendance summary partitions
> cleanly by role. Do not leave `team_role` NULL.

## Verification

After completing the steps, confirm the Team is correctly set up:

```sql
-- Should return exactly 1 row
SELECT t.name, t.slug, t.schema_name
FROM teams t WHERE t.slug = 'setpoint-vt';

-- Should return 1 Admin and N Users, each with a non-null team_role
SELECT u.email, u.display_name, tm.role, tm.team_role
FROM team_members tm
JOIN users u ON u.id = tm.user_id
JOIN teams t ON t.id = tm.team_id
WHERE t.slug = 'setpoint-vt'
ORDER BY tm.role DESC, u.display_name;

-- Tenant schema should exist
SELECT schema_name FROM information_schema.schemata
WHERE schema_name = 'team_setpoint_vt';
```

A Member seeded here can subsequently log in once the magic-link flow (ADR-0008) is
live — the `users.email` column is the identity key.

## References

- [ADR-0001](../adr/0001-product-ambition-hobby-tool-built-to-grow.md) — hobby tool, built to grow; team creation is back-office in v1
- [ADR-0008](../adr/0008-auth-magic-link-and-shareable-invite.md) — magic-link auth, invite onboarding
- [ADR-0009](../adr/0009-attendance-model-roles-in-audience-deferred.md) — one role per member, roles in v1
- [CONTEXT.md](../../CONTEXT.md) — vocabulary: Team, Member, Role, Admin, User
