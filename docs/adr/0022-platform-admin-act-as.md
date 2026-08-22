# ADR-0022: Platform Admin Act-as — entering a team you are not a member of

- Status: Accepted
- Date: 2026-08-22
- Builds on: [ADR-0021](0021-active-team-explicit-tenant-resolution.md) (the Active Team seam)
- Amends: [ADR-0019](0019-self-service-team-onboarding.md) (§4 platform-admin identity, §5 founder becomes a member)
- Relates to: [#237](https://github.com/ZzAve/teambalance-app/issues/237) (general audit log — deliberately decoupled)

## Context

Running the platform means setting teams up for people: provisioning a club's squads and prepping a
season of events so members arrive to something ready rather than empty. That is **writing inside a
team you do not play in**.

The obvious route — join all of them — is wrong for a reason the domain makes plain. Per
[ADR-0009](0009-attendance-model-roles-in-audience-deferred.md) the attendance summary's denominator
is the *full roster*, so an operator sitting in twelve rosters is permanently Not Responded in twelve
teams' event summaries, and lands in twelve Halls of Shame. Membership is a claim about playing
together; the operator is staff.

Something adjacent already exists: `PlatformAdminGateway` / `PlatformAdminAllowlist`, a fail-closed
config allowlist (`teambalance.platform-admins`) gating the creation-codes surface (ADR-0019 §4). It
authorizes platform-level *actions*. It has never authorized entering a tenant.

## Decision

### 1. Act-as, not membership — and full write

A **Platform Admin** enters a Team via **Act-as**: an explicitly entered state granting full read
*and* write for that team.

**Rejected: read-only.** The work that motivates this — creating events, configuring the Season,
curating Positions — is entirely writes. A read-only mode would not do the job and a second mechanism
would follow immediately.

**Rejected: read-only with an elevation step.** Elevation ceremonies earn their cost when a *second*
party audits the elevation. With a single Platform Admin there is no second party, so it is a speed
bump that gets routed around and then resented. The safety budget is spent on visibility (§4) instead
of on gates.

### 2. Virtual Member — synthesized, never written

Authorization inside act-as comes from a **Virtual Member**: `findRole(teamId, userId)` — the single
chokepoint from ADR-0021 — returns `ADMIN`. **No `team_members` row is ever written.** The team's
roster, attendance denominators, Position breakdown and contributor rankings are untouched.

**The synthesis keys off an actively-entered act-as state, never off `isPlatformAdmin(userId)`
alone.** If the chokepoint learned "ADMIN when the caller is a platform admin", an ordinary session
would silently be admin of every tenant it happened to be routed to, and act-as would stop being a
mode you enter and become a property you carry. That is the same class of mistake as the `LIMIT 1`
ADR-0021 removes: a rule invisible at the call site and only wrong later.

**Rejected: per-call-site bypasses** (`… || isPlatformAdmin`), which turn one chokepoint into N, and
the one that gets forgotten is the vulnerability. **Rejected: a real-but-hidden `team_members` row**,
which makes every roster, count and summary query responsible for remembering to filter it out.

### 3. A Platform Admin is structurally teamless

A Platform Admin is **never** a Member of any Team. A human who both runs the platform and plays
volleyball holds **two separate accounts**, and they must never be linked or auto-switched between.

This makes act-as expiry **fail-safe rather than fail-dangerous**. There is no fallback membership to
silently drop back into, so a lapsed act-as resolves to no tenant at all — and `TenantContext`
deliberately routes that to `__no_tenant__`, "a schema that intentionally does not exist, so an
unqualified table reference fails loudly instead of silently hitting `public`". A write can never be
misdirected by a lapse; it can only fail.

It also amends **ADR-0019 §5**: a Platform Admin creating a team must *not* become its founding
admin. See §5 below.

### 4. Visible while active, recorded for the team

- **60 minutes, sliding on activity.** Sessions themselves last four weeks (ADR-0015) precisely so
  nobody thinks about them; act-as riding that unchanged would mean "I popped into Dames 5 on Tuesday"
  is still true on Friday. The box keeps act-as something you *just* did deliberately.
- **A persistent banner naming the team**, with one-click **Exit**. The team name is not decoration:
  twelve near-identically-named club squads is the exact condition under which a season gets prepped
  into the wrong one.
- **Lapse is legible.** The server refuses with a distinct `ACT_AS_EXPIRED` — not a generic 403 — and
  the frontend returns the admin to the console. This comes nearly free: a lapsed teamless Platform
  Admin reports no active team, and the route gate's third branch sends teamless-plus-platform-admin
  to the console rather than to `/welcome`.
- **An Act-as Record, visible to the team.** Scoped to the **act-as session, not to individual rows**
  — a necessity, not a preference: only `events` and `attendances` carry authorship
  (`created_by`, `changed_by`). `team_settings`, `team_positions`, `event_types` and invitations carry
  none, so per-row attribution structurally cannot cover Season configuration or Position curation,
  which is most of what setup *is*.
- **The actor is rendered generically** ("the platform") via an `actor_kind` of `MEMBER` |
  `PLATFORM_ADMIN`. No name resolution is needed — convenient, since `findMemberSummariesByUserIds`
  joins `public.team_members` and would resolve a non-member to nothing — and the team-visible surface
  never exposes an operator's email. `created_by` keeps the real user id underneath for forensics; it
  is never disguised as the team's own admin, and never collapsed to a synthetic system user while a
  real human is behind it.

**Decoupled from a general audit log** ([#237](https://github.com/ZzAve/teambalance-app/issues/237)).
That feature's hard problems — attendance volume drowning the log, tenant-vs-`public` placement,
what counts as an action — are unrelated to act-as and would hold it hostage. Act-as records are
expected to fold in later as one `action_type`; that migration is the accepted price.

### 5. Memberless team creation + an Admin-granting Invite Link

A Platform Admin creates a Team with **no members at all**, acts in to prepare it, and hands it over
with an **Invite Link that grants `ADMIN`** on acceptance (`invitations` records the granted Role;
`acceptInvitation` honours it instead of always adding a plain User). The recipient clicks one link
and arrives as Admin of a prepared team.

**Rejected: naming the founding admin by email**, which needs a real `users` row and therefore eager
user creation or a pending-membership concept, plus correct email addresses up front.
**Rejected: having each captain self-create** with a creation code — it works and needs no new code,
but it puts a setup step in front of every recipient, which is the opposite of the point. It remains
available as a zero-code fallback.

The adminless window is a **new state the app has never seen**: empty roster, an attendance
denominator of zero, an empty Position breakdown. It is transient, and act-as is what covers it — but
it is a new class of empty state across several screens.

### 6. The console lists every team

The platform console lives under the existing `/admin` route group beside `/admin/creation-codes` —
same allowlist, same gateway, no new auth surface — and lists **all** teams. Restricting the *list*
would be theatre: a Platform Admin owns the database. What makes this defensible is that *entering* is
explicit, time-boxed, and leaves a record the team can read.

Deliberately deferred: a team-level right to refuse platform access. The trigger for revisiting is
concrete — the first team whose members have never met the operator. Until then this is a club
running its own squads.

## Consequences

- The most security-sensitive path in the app now exists. Its safety rests on two invariants worth
  guarding with tests: the chokepoint synthesizes `ADMIN` **only** under an active act-as state, and
  no `team_members` row is ever written by it.
- Teams can exist with zero members; empty states must handle it.
- ADR-0019 §5's "creator becomes founding admin" no longer holds for Platform Admin creation.
- Operating the platform and playing in a team now requires two accounts, permanently and by design.
