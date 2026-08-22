# ADR-0021: The Active Team — explicit, session-carried tenant resolution

- Status: Accepted
- Date: 2026-08-22
- Amends: [ADR-0019](0019-self-service-team-onboarding.md) (§3 one-team-per-user, §6 `/auth/me`'s singular `team`)
- Relates to: [ADR-0014](0014-jdbc-backed-shared-sessions-survive-restart.md) (JDBC sessions), [ADR-0015](0015-session-lifetime-long-sliding-idle-plus-absolute-cap.md) (session lifetime), [ADR-0022](0022-platform-admin-act-as.md) (act-as rides this seam)
- Resolves: #143

## Context

Tenant routing was hard-wired to one team per user. `findTeamRoutingByUserId` resolved it as:

```sql
SELECT tm.team_id, t.schema_name FROM public.team_members tm
JOIN public.teams t ON t.id = tm.team_id
WHERE tm.user_id = :userId AND tm.active
ORDER BY tm.team_id LIMIT 1
```

ADR-0019 §3 matched that constraint by rejecting create-team with `409 ALREADY_IN_TEAM`.

**That guard never closed the hole.** It lives only in `TeamService.createTeam`; the invite path does
not have it. `JpaTeamMemberRepositoryAdapter.addMember` checks membership *of the team being joined*
and nothing else, so accepting an invite to a second team writes a second `team_members` row today.
The routing query then picks between them by **UUID order** — arbitrary, and then *sticky*, because
`TenantRoutingSession` memoizes the resolved pair on the session. The member's other team does not
error; it silently does not exist for them. #143 recorded this as unreachable. It was not.

This is latent while there is one team per club and becomes real the moment a club runs several
teams — the Tovo rollout ([#239](https://github.com/ZzAve/teambalance-app/issues/239)) — where
double membership (a player who also trains another squad, a season-long fill-in) is ordinary.

## Decision

### 1. One mechanism: the Active Team

A request is scoped to exactly one **Active Team**, **explicitly selected and never inferred**.
`AuthorizationService`'s `findRole(teamId, userId)` remains the single authorization chokepoint and
answers from one of two sources: a real `team_members` row, or the **Virtual Member** synthesized by
**Act-as** (ADR-0022).

`ORDER BY … LIMIT 1` is **deleted, not sidestepped**. `findTeamRoutingByUserId` and
`findTeamIdByUserId` stop meaning "resolve the user's team" and become "resolve *this* team for this
user, and verify they may have it" — the team id is an input, not a discovery.

A single seam was chosen over letting act-as add a parallel resolution path. Two tenant-resolution
paths in a schema-per-tenant app is the shape cross-tenant leaks are made of: the day one path is
fixed and the other is not, a write lands in the wrong schema and nothing in the type system notices.

### 2. Session-carried, with the team slug in the URL

The Active Team lives on the session. Team-scoped URLs carry the team **slug** (`/t/:slug/…`) so a
link shared by a teammate opens for anyone entitled to it; opening one performs an **authorized
switch** of the Active Team. The slug is already unique and already the team's public address
(ADR-0019 §2); `schema_name` stays hidden.

**Rejected: request-carried tenancy** (every API call names its team, no session Active Team). It is
the better fit on two counts — it deletes the memo-staleness problem below rather than solving it,
and it lets two browser tabs sit in different teams. It was rejected because the app is an installed
**PWA**: a deep link opening in the PWA would need the team threaded through every subsequent in-app
navigation, and `scope`/`start_url` handling gets awkward. Keeping the installed app's navigation
team-less won. Revisit if tab-per-team ergonomics become a real complaint.

Consequence accepted deliberately: `TenantRoutingSession`'s memoized `(schema, teamId)` pair is now a
**correctness** concern, not just a cache. It must be invalidated on every switch, and any future
team-keyed cache inherits that obligation.

### 3. Last-used is remembered; there is one kind of switch

The Active Team is persisted per user (`public.users.last_active_team_id`, nullable) and written on
every switch — including a switch caused by opening a shared link. On login: the remembered team if it
is still a valid active membership → otherwise their sole membership → otherwise force a choice.

Persisting per user rather than per session is deliberate: a session-only memory is lost exactly when
it is most useful, at a fresh magic-link login on a phone.

**One kind of switch** was chosen over distinguishing deliberate switches from link-induced ones. The
cost is real and known: tapping a teammate's link for your secondary team re-homes your default, so
you may open the app later and find yourself in the other team. That is a one-tap correction and it is
*self-evident from the UI*, because the switcher always names the current team. The alternative buys
marginally better defaults at the price of a rule no user can see and every future contributor has to
rediscover.

### 4. Contract changes

- **ADR-0019 §3 is lifted**: `409 ALREADY_IN_TEAM` no longer gates create-team.
- **ADR-0019 §6 is amended**: `/auth/me`'s `team: TeamRef?` becomes `teams: TeamRef[]` plus an
  `activeTeam`. The frontend route gate's question changes from "do you have a team" to "do you have
  *any* team, and which is active", and gains a third branch for a teamless **Platform Admin**
  (ADR-0022).
- **`AuthorizationService`'s security-contract comment is reworded.** It currently forbids `teamId`
  from being "a raw request parameter". Under this ADR the team id *is* a caller-influenced input,
  made safe by being validated at the one chokepoint. The prohibition it should carry instead: a
  supplied team id that fails `findRole` resolves to **no tenant**, and "not yours" must be
  indistinguishable from "does not exist" so the id space cannot be probed.
- **`acceptInvitation` stops being fire-and-forget**: joining a team makes it the Active Team, so the
  member lands where they just accepted.

## Non-goals

No cross-team data views or aggregation. No simultaneously-active roles across teams — one Active
Team, one role, at a time. No cross-team identity merging (see ADR-0022: the two accounts a
platform-running player holds must never be linked or auto-switched between).

## Consequences

- The silent-misrouting bug is fixed by construction rather than guarded against, and the `LIMIT 1`
  leaves the codebase.
- Every team-scoped screen gains a team slug in its route, and the switcher becomes permanent UI.
- Session memo invalidation is now load-bearing; a missed invalidation is a cross-tenant read.
- Act-as (ADR-0022) builds no tenant-resolution machinery of its own — it supplies a second
  authorization source to this one.
