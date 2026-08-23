# Back-office: Onboarding a Team

> **What changed (ADR-0019):** team creation is now **self-service**. A logged-in, teamless user
> creates their team from a **name + slug + one-time creation code** via the create-team screen
> (`POST /api/teams`), which provisions the tenant schema itself. Back-office onboarding is now just
> **minting a creation code** and handing it over.
>
> Two manual rituals from the old procedure are **retired**:
> - **Per-team tenant migration by hand is gone.** The `StartupTenantMigrationRunner` brings *every*
>   `public.teams` schema to head on every boot (idempotent), and create-team provisions a brand-new
>   schema inline. You no longer run the Flyway docker CLI per team. See the emergency fallback below
>   only if the app can't boot.
> - **Inserting `teams` / `team_members` rows by hand is no longer the happy path** — the founder's
>   self-service create does it, atomically, in the right order.

## Onboarding a new team (happy path)

### Step 1 — Mint a creation code

**Preferred: the codes-admin UI (ADR-0019 Slice 4).** A platform admin (an email in
`PLATFORM_ADMIN_EMAILS` / `teambalance.platform-admins`) opens the creation-codes admin surface and
mints a code (optionally with an expiry). List/revoke live there too.

**Fallback: back-office SQL** (if the UI isn't reachable). One row in `public.team_creation_codes`:

```sql
-- code: any unguessable string you hand to the founder. NULL expires_at = never expires;
-- set a timestamptz to make it time-boxed. consumed_* stay NULL until the founder redeems it.
INSERT INTO public.team_creation_codes (code, expires_at)
VALUES ('choose-an-unguessable-code', NULL)   -- or now() + interval '7 days'
RETURNING code, created_at, expires_at;
```

Hand the `code` to the founder over a trusted channel. It is single-use: the create-team endpoint
consumes it atomically (`consumed_at IS NULL AND (expires_at IS NULL OR expires_at > now())`), so it
can be spent at most once.

### Step 2 — The founder self-creates

The founder logs in (magic link → their `users.email` is the identity key). While **teamless** the
has-any-team route gate (driven by `/auth/me`'s `teams` list) lands them on the create-team screen;
since #143 a founder who already plays in a Team can reach it too, from the Team switcher. They enter:

- **Team name** — free text, ≤ 100 chars, **not** required to be unique.
- **Slug** — the URL address, **user-editable and validated**: `^[a-z0-9]+(-[a-z0-9]+)*$`, ≤ 58 chars,
  **unique**. `schema_name = "team_" + slug` (hyphens → underscores) is computed server-side and never
  shown.
- **Creation code** — from Step 1.

`POST /api/teams` then, in order: validates name/slug (`400 INVALID_NAME` / `400 INVALID_SLUG`); rejects a taken slug
(`409 TEAM_SLUG_TAKEN`) or a bad/expired/consumed code (opaque `403 INVALID_CREATION_CODE`);
**provisions the tenant schema** (`db/tenant-migration`, recorded in `flyway_tenant_schema_history`);
then **atomically** consumes the code and inserts the `teams` row + the founder's `team_members`
row (ADMIN, `onboarded_at = now()`, `position_id NULL`); and finally makes the new team the
founder's **Active Team**, so they land straight in the new, empty team rather than staying in
whichever team they were in before (ADR-0021).

The founder is now the team's admin. From there, onboarding the rest of the team is the ordinary
in-app flow (unchanged, ADR-0008 / ADR-0013):

1. At **`/members`**, add the team's real **positions** (Libero, Middenaanvaller, …) first — otherwise
   invitees have nothing meaningful to pick.
2. Share the **Invite Link**. Each joiner enters their email → magic link → joins as `role='USER'`,
   `onboarded_at=NULL` → `/welcome` captures their name + position.
3. Promote co-admins from the `/members` roster (symmetric promote/demote, last-admin floor).

## Verification

```sql
-- The code was consumed and points at the new team:
SELECT code, consumed_at, consumed_by_user_id, created_team_id
FROM public.team_creation_codes WHERE code = 'choose-an-unguessable-code';

-- Team row + founding admin (note: schema_name is server-derived from the slug; sport is gone, ADR-0019):
SELECT t.name, t.slug, t.schema_name, u.email, tm.role, tm.onboarded_at
FROM public.teams t
JOIN public.team_members tm ON tm.team_id = t.id
JOIN public.users u ON u.id = tm.user_id
WHERE t.slug = '<slug>';

-- Tenant schema exists and is migrated:
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'team_<slug_underscored>';
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'team_<slug_underscored>' ORDER BY table_name;   -- events, attendances, transactions, event_types, …
```

The real proof is the founder landing in the team with an empty events list and no error on the
events view — confirming the tenant schema is wired correctly.

## Emergency fallback — manual tenant provisioning

You should not need this: the startup runner keeps existing schemas at head and create-team
provisions new ones. Reach for it only if the app **can't boot** (so the runner never runs) and a
tenant schema must be migrated out-of-band. It mirrors `TenantSchemaAdapter.provisionTenantSchema`
exactly — creates the schema, applies `db/tenant-migration/`, and records
`flyway_tenant_schema_history`. Running raw DDL instead would leave the history table empty.

```bash
docker run --rm \
  -e FLYWAY_PASSWORD='<DB_PASSWORD>' \
  -v "$(git rev-parse --show-toplevel)/api/src/main/resources/db/tenant-migration:/flyway/sql:ro" \
  flyway/flyway:11 \
  -url="jdbc:postgresql://<HOST>:5432/<DB>?sslmode=require" \
  -user="<DB_USER>" \
  -schemas="team_<slug_underscored>" \
  -table="flyway_tenant_schema_history" \
  -baselineOnMigrate=true -baselineVersion=0 \
  migrate
```

- Fill `<HOST>/<DB>/<DB_USER>` from your DB connection (prod `<DB>` is `teambalance`); pass the
  password via `FLYWAY_PASSWORD` to keep it out of shell history.
- Note `-table="flyway_tenant_schema_history"` — the **tenant** history table, kept separate from the
  platform `flyway_schema_history` (ADR-0019 guardrail; regressing the split misplaced a migration in
  prod once, PR #120).

> **Never** point platform Flyway (`db/migration`) at a tenant schema, and never unpin
> `spring.flyway.schemas:[public]`. Platform migrations belong in `public` only.

## References

- [ADR-0019](../adr/0019-self-service-team-onboarding.md) — self-service onboarding: startup migration
  runner, code-gated create-team, `sport` dropped (amends ADR-0001)
- [ADR-0001](../adr/0001-product-ambition-hobby-tool-built-to-grow.md) — hobby tool, built to grow (the
  "team creation is back-office in v1" stance this reverses)
- [ADR-0008](../adr/0008-auth-magic-link-and-shareable-invite.md) — magic-link auth, invite onboarding
- [ADR-0013](../adr/0013-member-profile-position-role-management.md) — member profile, position
  vocabulary & role management (`/welcome`, `/members`)
- [CONTEXT.md](../../CONTEXT.md) — vocabulary: Team, Member, Role, Admin, User, Position
</content>
