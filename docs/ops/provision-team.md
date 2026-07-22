# Back-office: Provisioning a Team

> **When to use this:** Self-service Team creation is deferred (ADR-0001, ADR-0008).
> Until that is built, the owner provisions new Teams manually using this procedure.
>
> **Prod reality check (read this first):** there is **no** provisioning API. Nothing in
> prod triggers `TenantSchemaManager` — it's called only by `DemoDataSeeder` (`@Profile("dev")`)
> and the e2e initializer. A `/internal/admin/.../provision` endpoint was never built and is
> now blocked by the prod `/internal/*` lockdown (PR #86). So the tenant schema must be
> migrated **directly against the database** (Step 2). Restarting the app migrates only the
> `public` schema, never a tenant schema.

## Prerequisites

- Psql access to the database.
  - Local: `make db` starts Postgres on `localhost:5432`.
  - Prod: Scaleway Serverless SQL — database name `teambalance`, JDBC needs `?sslmode=require`.
    Credentials are secrets (container env `SPRING_DATASOURCE_*` / Secret Manager). Never print them.
- **Docker** (for Step 2 — the tenant migration runs via the Flyway CLI image; no local `flyway`/`psql` needed).
- A local checkout of this repo (Step 2 mounts `api/src/main/resources/db/tenant-migration/`).
- The team's: name, slug (URL-safe), sport.
- The owner's email + display name. (Positions are optional up front — see Step 3.)

## Step 1 — Insert the Team + owner (one transaction)

The schema name must be a valid Postgres identifier (lowercase, underscores, no spaces).
Convention: `team_<slug_with_underscores>`, and it must be **unique** (can't reuse `public`).

This one transaction creates the team, the owner's platform identity, an initial position,
and the owner's admin membership — CTEs thread the generated ids so nothing is copy-pasted.
No `ON CONFLICT` (its `DO NOTHING` silently no-ops on *any* constraint clash, not just the
intended key — misleading for a first insert).

```sql
BEGIN;

WITH t AS (
    INSERT INTO public.teams (name, slug, sport, schema_name)
    VALUES ('Setpoint VT', 'setpoint-vt', 'Volleyball', 'team_setpoint_vt')
    RETURNING id
),
u AS (
    INSERT INTO public.users (email, display_name)
    VALUES ('owner@example.com', 'Jan de Vries')
    RETURNING id
),
p AS (
    -- Optional: seed one position so /welcome has something to pick (see Step 3).
    INSERT INTO public.team_positions (team_id, label)
    SELECT t.id, 'Setter' FROM t
    RETURNING id
)
INSERT INTO public.team_members (team_id, user_id, role, position_id, onboarded_at)
SELECT t.id, u.id, 'ADMIN', p.id, now()   -- see Step 3 for the /welcome alternative
FROM t, u, p;

-- Eyeball before committing (ROLLBACK; instead if anything looks wrong):
SELECT tm.role, tm.onboarded_at, u.email, u.display_name, tp.label AS position,
       t.slug, t.schema_name
FROM public.team_members tm
JOIN public.users u  ON u.id = tm.user_id
JOIN public.teams t  ON t.id = tm.team_id
LEFT JOIN public.team_positions tp ON tp.id = tm.position_id
WHERE t.slug = 'setpoint-vt';

COMMIT;
```

Note the `schema_name` (`team_setpoint_vt`) — you need it in Step 2.

> **Schema shape (post-#90 / ADR-0013):** `team_members` has **no** `team_role` column.
> Permission is `role` (CHECK `'USER' | 'ADMIN'`, default `'USER'`). Playing **position** is
> `position_id` → FK `public.team_positions` (per-team vocabulary; labels unique
> case-insensitively per team). `onboarded_at` (nullable) drives the `/welcome` flow.

## Step 2 — Provision + migrate the tenant schema

The tenant schema holds events, attendances, transactions, and event types for this Team.
Run Flyway directly against the DB via the Flyway CLI docker image — this mirrors
`TenantSchemaManager` exactly (creates the schema, applies `db/tenant-migration/`, and records
a proper `flyway_schema_history`). Running raw DDL instead would leave the history table empty.

```bash
docker run --rm \
  -e FLYWAY_PASSWORD='<DB_PASSWORD>' \
  -v "$(git rev-parse --show-toplevel)/api/src/main/resources/db/tenant-migration:/flyway/sql:ro" \
  flyway/flyway:11 \
  -url="jdbc:postgresql://<HOST>:5432/<DB>?sslmode=require" \
  -user="<DB_USER>" \
  -schemas="team_setpoint_vt" \
  -table="flyway_schema_history" \
  -baselineOnMigrate=true -baselineVersion=0 \
  migrate
```

- Fill `<HOST>/<DB>/<DB_USER>` from your DB connection (prod `<DB>` is `teambalance`).
- Pass the password via `FLYWAY_PASSWORD` to keep it out of shell history.
- Flyway creates the schema itself (no separate `CREATE SCHEMA` needed) and applies the tenant
  migrations (currently `V001__tenant_baseline`, `V002__seed_event_types`,
  `V003__attendance_changed_by`). Expect *"Successfully applied N migrations"*.

> This **must** run before the owner logs in — the app resolves the tenant from the team
> context and queries `events` in the tenant schema; if the schema/tables don't exist yet, the
> events view errors.

## Step 3 — The owner's position & onboarding: two options

`team_members.onboarded_at` gates the post-login `/welcome` flow (ADR-0013): a member with
`onboarded_at IS NULL` is routed to `/welcome` to set their own display name + position.

- **Option A — seed fully (used in Step 1 above):** set `position_id` and stamp
  `onboarded_at = now()`. The owner skips `/welcome` and lands straight in the team. Use this
  when the SPA isn't yet on the member-management build, or you just want them fully set up.
- **Option B — let them self-onboard:** insert the membership with `position_id = NULL` and
  `onboarded_at = NULL` (drop the `p` CTE and those two values in Step 1). On first login the
  owner goes through `/welcome`. Note: `/welcome` only lets a member *pick* an existing
  position — it can't create one, and if the team has **zero** positions the picker is hidden
  (member stays unassigned). So seed at least one position first if you want them to choose.

## Step 4 — Add the remaining Members

Preferred path is **self-service via the Invite Link** (ADR-0008 / ADR-0013), not back-office SQL:

1. As an admin, open **`/members`** and add the team's real **positions** first (Libero,
   Middenaanvaller, etc.) — otherwise every invitee is forced to pick the single seeded one.
2. Generate the **Invite Link** and share it. Each joiner enters their email → magic link →
   joins as `role='USER'` with `onboarded_at=NULL` → `/welcome` captures their name + position.
3. Promote any co-admins from the `/members` roster (symmetric promote/demote, last-admin floor).

Back-office SQL for a member is still possible (same shape as Step 1's `users` + `team_members`
inserts, `role='USER'`), but prefer the invite flow so people set their own name/position.

## Verification

```sql
-- Team row (exactly 1)
SELECT name, slug, schema_name FROM public.teams WHERE slug = 'setpoint-vt';

-- Members: 1 Admin + N Users, with their positions
SELECT u.email, u.display_name, tm.role, tp.label AS position, tm.onboarded_at
FROM public.team_members tm
JOIN public.users u ON u.id = tm.user_id
JOIN public.teams t ON t.id = tm.team_id
LEFT JOIN public.team_positions tp ON tp.id = tm.position_id
WHERE t.slug = 'setpoint-vt'
ORDER BY tm.role DESC, u.display_name;

-- Tenant schema exists and is migrated
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'team_setpoint_vt';
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'team_setpoint_vt' ORDER BY table_name;   -- events, attendances, transactions, event_types, ...
SELECT name FROM team_setpoint_vt.event_types ORDER BY name;   -- Match, Other, Training (baseline seed)
SELECT count(*) AS events FROM team_setpoint_vt.events;         -- 0 (fresh team)
```

**The real proof** is a login: the owner requests a magic link (their `users.email` is the
identity key), clicks it, and lands in the team with an empty events list — no error on the
events view confirms the tenant schema is wired correctly.

## References

- [ADR-0001](../adr/0001-product-ambition-hobby-tool-built-to-grow.md) — hobby tool, built to grow; team creation is back-office in v1
- [ADR-0008](../adr/0008-auth-magic-link-and-shareable-invite.md) — magic-link auth, invite onboarding
- [ADR-0009](../adr/0009-attendance-model-roles-in-audience-deferred.md) — roles/audience model in v1
- [ADR-0013](../adr/0013-member-profile-position-role-management.md) — member profile, position vocabulary & role management (`/welcome`, `/members`); supersedes the "back-office only" parts of ADR-0009
- [CONTEXT.md](../../CONTEXT.md) — vocabulary: Team, Member, Role, Admin, User, Position
