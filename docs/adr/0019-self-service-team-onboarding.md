# ADR-0019: Self-service team onboarding — startup migration runner + code-gated create-team

- Status: Accepted
- Date: 2026-08-03
- Amends: [ADR-0001](0001-product-ambition-hobby-tool-built-to-grow.md) (team creation is back-office in v1)
- Relates to: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md) (magic-link auth, invite onboarding), [ADR-0013](0013-member-profile-position-role-management.md) (member/position/role)

> Numbering note: the originating PRD (#154) named this ADR-0015. By the time it was written, 0015
> was already taken (session lifetime), so it lands at **0019**. Shipped code that referenced
> "ADR-0015" for onboarding was corrected to point here.

## Context

ADR-0001 deferred self-service team creation: teams were born from back-office SQL
(`docs/ops/provision-team.md`), and each tenant schema was migrated **by hand** through the Flyway
docker CLI. Nothing in prod ever called the (already idempotent) `TenantSchemaManager.provisionTenantSchema`
— only the dev seeder and the e2e initializer did. Two gaps followed from that:

- **Onboarding didn't scale past the owner.** Every new team was a manual psql + docker-Flyway ritual.
- **Tenant schemas could silently drift.** A new tenant migration only reached a schema if someone
  remembered to run the CLI against it; restarting the app migrated `public` only.

We want authenticated, abuse-resistant **self-service team creation**, with **every tenant schema
kept migrated automatically** at startup. This reverses ADR-0001's "back-office in v1" stance while
keeping the schema-per-team multitenancy model unchanged.

Opening team creation to logged-in users also opens an abuse surface (an authenticated stranger
spinning up schemas at will), so creation is gated behind one-time **creation codes** minted by a
platform admin.

## Decision

### 1. Startup tenant-migration runner

`StartupTenantMigrationRunner` (`infrastructure/multitenancy`) iterates `public.teams`
(`TeamRepository.findAllSchemaNames()`) and calls the idempotent `provisionTenantSchema` for each,
bringing every tenant schema to head at boot. It is an `InitializingBean` (mirroring
`PlatformSchemaInitializer`) with `@DependsOn("platformSchemaInitializer")`, so it runs during context
refresh, **after** `public.teams` exists and **before** boot is "done" — closing the startup race.
This retires the manual docker-Flyway step for existing teams.

- **Idempotent:** `CREATE SCHEMA IF NOT EXISTS` + Flyway `migrate` against `db/tenant-migration`
  (history in `flyway_tenant_schema_history`, separate from the platform `flyway_schema_history`).
  Re-running against an already-current schema is a no-op.
- **No distributed lock.** Prod is effectively single-instance; concurrent boots would rely on
  Flyway's history-table lock. Documented limitation, not engineered around.
- **Shipped failure behaviour — fail-fast:** the runner iterates straight through; a per-tenant
  migration failure propagates out of `afterPropertiesSet` and **fails boot**. The PRD's
  isolate-and-continue + a base/prod fail-open config flag was **not** built — the current runner is
  always fail-closed. This is acceptable for the current single-team prod but is the first thing to
  revisit before onboarding many tenants (a bad tenant migration would down the whole app). Tracked
  as a follow-up, not part of this ADR's shipped scope.

### 2. Code-gated create-team endpoint

`POST /api/teams` (Wirespec `teams.ws`; **never hand-edit generated code**). A logged-in, teamless
user becomes the founding admin of a new team.

- **Request `{ name, slug, creationCode }` → `201 { id, name, slug }`.** `schema_name` is never
  exposed.
- **User-editable, validated-not-derived slug (amends #154's original derived-slug design; from the
  #158 create-team-screen grill).** The caller owns the address; the backend **validates** it
  (`TeamNaming.validate`) rather than deriving it: format `^[a-z0-9]+(-[a-z0-9]+)*$`, length **≤ 58**.
  `schema_name = "team_" + slug.replace('-','_')` is the one thing still server-computed and hidden,
  and the 58-cap keeps it within Postgres' **63-byte** identifier limit. Over-long slugs are
  **rejected, never truncated** — a truncated `schema_name` would no longer match the schema actually
  created and would break `SET search_path` routing. The slug whitelist is the injection boundary:
  `team_` + slug can only ever be `[a-z0-9_]`.
- **`name` is non-unique; `slug` is unique.** The only naming collision is the slug.
- **Error contract (machine-readable `code` on each):**
  - `400 INVALID_NAME` — blank or > 100 chars (placed on the name field).
  - `400 INVALID_SLUG` — bad format or > 58 chars (placed on the slug field).
  - `403 INVALID_CREATION_CODE` — **opaque**: unknown, consumed, and expired codes are
    indistinguishable, so a caller can't enumerate codes or probe their state.
  - `409 ALREADY_IN_TEAM` vs `409 TEAM_SLUG_TAKEN` — **two distinct codes the frontend depends on**
    (different copy, different behaviour): already a member of a team, vs the slug is taken. No
    auto-suffixing on collision — the caller picks another slug.

### 3. Provision-first ordering

`TeamService.createTeam` orders the steps so a partial failure never strands a consumed code:

1. reject if the caller already belongs to a team (`409 ALREADY_IN_TEAM`; v1 one-team-per-user);
2. validate name + slug, derive `schema_name` (`400` on bad input);
3. pre-check slug uniqueness (`409`) and code redeemability (opaque `403`) — clean rejects before any write;
4. **provision** the tenant schema (idempotent, own connection, commits independently);
5. **atomically** consume the code and insert `teams` + founding `team_members` in one transaction
   (`TeamRegistrar`). The consume is a single conditional `UPDATE … WHERE consumed_at IS NULL AND
   (expires_at IS NULL OR expires_at > now())` requiring 1 row affected — so a code is spendable at
   most once even under a race.

If step 4 fails, nothing is consumed and the user simply retries. If step 5 loses a race, the only
residue is a **harmless empty orphan schema**, self-healed long-term by the startup runner.

### 4. Creation codes + platform-admin identity

- **`public.team_creation_codes`** (`code` unique, `created_at`, nullable `expires_at`,
  `consumed_at`, `consumed_by_user_id`, `created_team_id`). One-time; `created_team_id` records which
  team a spent code produced (for the admin surface).
- **Platform-admin allowlist** `teambalance.platform-admins: ${PLATFORM_ADMIN_EMAILS:}` —
  **empty default = fail-closed** (nobody is an admin). `PlatformAdminGateway` reads it. This is the
  v1 platform-admin model (config, not a DB role); a DB-backed model is out of scope.

### 5. Founder & tenant starting state

The creator becomes a `team_members` **ADMIN** with `onboarded_at = now()` (skips `/welcome`) and
`position_id NULL`. The new team starts with an **empty** position vocabulary (the admin curates it
at `/members`). The tenant schema needs nothing extra beyond the standard `db/tenant-migration`
baseline (event types seeded by tenant `V002`, `team_settings` by its migration).

### 6. `/auth/me` gains `team`

`AuthenticatedUser` now carries `team: TeamRef?` (`{ id, name, slug } | null`, via `auth.ws`). The
frontend's has-a-team route gate reads **this** — it must **not** infer teamlessness from
`role == null`.

### 7. Notifications — fire-and-forget

On successful creation, `TeamNotifier` (backed by the existing Scaleway TEM adapter) sends the founder
a "your team `<name>` is ready" mail and the platform admins a "code consumed → team `<name>` created
by `<founder email>`" audit mail. Both are best-effort behind a broad catch: a mail failure is logged
and **never** fails a committed creation.

### 8. `sport` dropped

Self-service creation collects only name + slug + code. `teams.sport` (never surfaced in API/UI,
single placeholder value) is dropped in platform migration `V007__drop_teams_sport.sql` (auto-pinned
`public`). Post-drop insert sites (dev/e2e seeds, ITs, the runbook) omit it; the test-only seed
`V1_1__seed_demo_data.sql` still sets it because it runs at v1.1, before the drop.

### 9. Owner codes-admin surface (Slice 4)

`GET/POST/DELETE /api/admin/creation-codes` (Wirespec `creation-codes.ws`), behind
`PlatformAdminGateway`. List/mint/revoke codes. Revoking an unknown code → `404`; revoking a
**consumed** code → `409 CREATION_CODE_CONSUMED` (a consumed code is an audit record, not a pending
invite to withdraw). Frontend at `features/manage-creation-codes`.

### 10. Slice 3 (plain-HTML tracer) dropped

The PRD's throwaway plain-HTML create-team tracer was dropped: the polished #158 React/FSD screen
(`features/create-team`, PR #173) replaces it and carries the **single** create-team e2e itself
(the cross-tenant-provisioning + code-gate seam — the one new seam not covered by the login/attendance
flows). Net e2e count unchanged.

## Consequences

- **Onboarding a new team is now:** mint a creation code (codes-admin UI, or back-office SQL) → the
  user self-creates via the create-team screen. Existing teams' schemas stay at head automatically.
  The runbook (`docs/ops/provision-team.md`) is rewritten around this; the manual per-team
  docker-Flyway step is retired.
- **One-team-per-user** matches routing's `ORDER BY … LIMIT 1`. Multi-team membership + a team
  switcher are deferred to **#143**. Public/www marketing signup + a resetting demo team are **#152**.
- **Boot cost rises slightly** (tenant migrations run at startup). Kept cheap by idempotency, but see
  §1: the runner is currently fail-fast, so a broken tenant migration downs the app — revisit the
  isolate-and-continue design before scaling tenant count. A prior prod outage was a scale-to-zero DB
  boot-wedge, so startup DB work stays a watched cost.
- **Guardrail preserved:** platform Flyway stays pinned to `spring.flyway.schemas:[public]` and its
  own `flyway_schema_history`; tenant Flyway uses `flyway_tenant_schema_history`. Regressing the pin
  previously misplaced a migration into a tenant schema (incident PR #120).
</content>
</invoke>
