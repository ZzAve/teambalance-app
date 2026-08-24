# ADR-0026: A member's team profile is owned by the tenant

- Status: Accepted
- Date: 2026-08-23
- Amends: [ADR-0013](0013-member-profile-position-role-management.md) (§"Position is a fixed per-team
  vocabulary" — `team_positions` in the `public` schema, and `team_members.position_id`)
- Relates to: [ADR-0023](0023-active-team-explicit-tenant-resolution.md) (the Active Team seam),
  [ADR-0024](0024-platform-admin-act-as.md) (whose fail-safe rests on schema routing)

## Context

ADR-0013 put the position vocabulary in the **platform** schema — `public.team_positions`, keyed by
`team_id` — hung the assignment off `public.team_members.position_id`, and left the member's display
name on `public.users`. At the time that was unremarkable: one team per club, and a
`WHERE team_id = ?` predicate reads much like a tenant.

Three things since have made it wrong.

**A position is team data by every other measure.** It is defined by a team, means nothing outside
it, and is curated by that team's admins. Reading it out of `public` says the opposite — that it is
platform-wide, keyed by team as an afterthought.

**A team-scoped edit was writing platform data.** `applyMemberEdit` ran
`UPDATE public.users SET display_name`, so once [ADR-0023](0023-active-team-explicit-tenant-resolution.md)
made multi-team membership real, renaming yourself in one team renamed you in **every** team you
belong to. That is a live defect on `main`, not a modelling preference — and the same is true of the
position, which a member can only hold one of across all their teams.

**It sits outside the guarantee the tenancy work now rests on.** `TenantContext` documents:

> platform entities are `@Table(schema = "public")` and so **remain reachable regardless** [of
> whether a tenant resolved]

and ADR-0024 §3 builds act-as safety directly on the other half of that: a lapsed act-as resolves to
`__no_tenant__`, so "a write can never be misdirected by a lapse; it can only fail." That guarantee
is **schema-level**. Team-scoped data living in `public` does not get it — it stays readable with no
tenant resolved, protected only by an application-level predicate. Today the write paths gate on
`requireCurrentTeamId()`, so this is a weakened guarantee rather than a demonstrated hole; but it is
a guarantee the rest of the tenancy design assumes it has.

It also blocked a foreign key. #219's roster targets are tenant rows naming position ids, and no
foreign key can span schemas — so that PR carried write-time validation, a delete-time cascade and a
read-time filter to do by hand what a constraint does for free.

## Decision

### 1. Positions become tenant rows

`positions(id, label, created_at)` in each tenant schema. **No `team_id` column** — the schema is the
team — and the label is unique within the schema rather than per `(team_id, label)`.

### 2. The member's team profile moves with them

`member_profiles(user_id, display_name, position_id)` in the tenant schema, `user_id` as the primary
key — which *is* the one-position-per-member rule, with no separate index to keep in step with it.

**Both** team-scoped profile fields live here: what someone is called in this team, and what they
play in it. `public.team_members` keeps membership and permission role; `public.users` keeps identity
(id, email). That split is the point: who may act and in which team is a platform fact, while what
someone is called and plays is a fact about a team's own game — and under ADR-0023 a player in two
squads may legitimately differ in both.

### 2a. The platform name survives, but becomes write-once

`public.users.display_name` stays as the **teamless fallback** — `/auth/me` serves it to a caller with
no Active Team, and joining a team seeds the profile from it — but nothing user-facing writes it any
more. `AuthService` already derived it from the email prefix on first sign-in; only the team-scoped
edit ever changed it, which was the bug.

**Rejected: a global name the user can edit and each team overrides.** It reads well until someone
changes the global one, and then every team has to decide whether to follow — a rule with no
defensible answer and no way for a member to predict it. Making the platform copy derived and
immutable buys the same "start from the name you already use" ergonomics with none of that.

**Rejected: dropping the column and deriving from the email at read time.** Cleaner on paper, but
today's edits write there, so real people have curated names in it that would be silently discarded.

### 3. What the boundary looks like afterwards

| Reference | Before | After |
|---|---|---|
| roster targets → positions (#219) | cross-schema, app-enforced | **real foreign key** |
| member → position | real FK, in `public` | **real foreign key**, in the tenant |
| member → display name | on `public.users`, shared by every team | per tenant |
| `member_profiles.user_id` → `public.users` | — | cross-schema, no FK |

The residual cross-schema reference is tenant data naming a **platform identity**, which is the one
thing that genuinely is platform-wide. It points from the tenant at the platform, not the reverse.

`ON DELETE SET NULL` on `member_profiles.position_id` replaces application code: ADR-0013 says
deleting a position in use resets its members to unassigned, which was `PositionService`'s job
*precisely because* no foreign key could span the schemas. The database does it now — `SET NULL`
rather than `CASCADE`, because the profile also carries the member's name and deleting a position
must not delete that.

### 4. No method takes a team id any more

`PositionRepository.listByTeam(teamId)` becomes `list()`, `create(teamId, label)` becomes
`create(label)`, `existsInTeam(teamId, id)` becomes `exists(id)`. Passing a team id would invite a
caller to name a team other than the one the connection is routed to — the exact divergence ADR-0023
removed from tenant resolution. Services still take a team id, but to **authorize**, not to find rows.

### 5. Expand now, contract later

This ADR delivers the **expand** half only: the tenant tables are created and backfilled, and the
application reads and writes them. `public.team_positions`, `public.team_members.position_id` and
`public.users.display_name` remain — the first two unread, the third still serving the teamless
fallback described in §2a.

They cannot be dropped in the same release. `StartupTenantMigrationRunner` is
`@DependsOn("platformSchemaInitializer")`, so **every platform migration runs before any tenant
migration** — a platform migration dropping the source would execute before the tenant migration that
copies from it. The drop is a separate, later change, once every environment has run the backfill.

## Consequences

- **The member summary now requires a routed tenant.** It joins the tenant's `member_profiles`, so
  calling it unrouted fails loudly against `__no_tenant__` instead of quietly reading `public`. That
  is the intended behaviour — it is the same guarantee ADR-0024 relies on, now extended to positions —
  but it is a real contract change for any caller that ran without a tenant.
- **#219 loses its workaround.** The write-time `UNKNOWN_ROSTER_POSITION` check and the roster half of
  the position-delete cascade become unnecessary; a foreign key covers both.
- Ids are preserved through the backfill, so anything already holding a position id — roster targets,
  a client, a bookmarked payload — stays valid. Names are carried across too, so nobody is renamed by
  the migration.
- Reads fall back to the platform name (`COALESCE(mp.display_name, u.display_name)`) for a member
  with no profile row yet, so a member seeded outside the backfill is not nameless.
- **Per-team display-name uniqueness stays an application check** (ADR-0013's `NAME_TAKEN`) rather
  than becoming a unique index, even though the tenant schema now makes one expressible. The test
  fixtures point several teams at one schema, so the index would reject fixtures that production
  would never produce. Worth revisiting once each spec owns its schema.
- The platform tables linger until the contract step. Until then the test helper writes both sides,
  and a reader has two places to look, which is the cost of doing this safely.
