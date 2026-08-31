# ADR-0024: Platform Admin Act-as — entering a team you are not a member of

- Status: Accepted
- Date: 2026-08-22
- Builds on: [ADR-0023](0023-active-team-explicit-tenant-resolution.md) (the Active Team seam)
- Amends: [ADR-0019](0019-self-service-team-onboarding.md) (§4 platform-admin identity, §5 founder becomes a member)
- Relates to: [#237](https://github.com/ZzAve/teambalance-app/issues/237) (general audit log — deliberately decoupled)
- Resolves: [#239](https://github.com/ZzAve/teambalance-app/issues/239); §5 is delivered by [#240](https://github.com/ZzAve/teambalance-app/issues/240)

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
chokepoint from ADR-0023 — returns `ADMIN`. **No `team_members` row is ever written.** The team's
roster, attendance denominators, Position breakdown and contributor rankings are untouched.

**The synthesis keys off an actively-entered act-as state, never off `isPlatformAdmin(userId)`
alone.** If the chokepoint learned "ADMIN when the caller is a platform admin", an ordinary session
would silently be admin of every tenant it happened to be routed to, and act-as would stop being a
mode you enter and become a property you carry. That is the same class of mistake as the `LIMIT 1`
ADR-0023 removes: a rule invisible at the call site and only wrong later.

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
- **An Act-as Record, visible to the team's Admins.** It lives on the Admin-only team settings page,
  quiet at rest: one line that opens into the visits, and a visit that opens into its detail and the
  reason platform access happens at all. Rejected: **the team-wide page**, tried first on the reasoning
  that the record is the *team's*. In practice it puts an unexplained "someone was in here" in front of
  players who have no context for it, on a screen they open to read the roster — the alarm lands, the
  explanation does not, and the questions come to the operator anyway. The Admins are the ones who can
  act on it, so they are the ones it is shown to, with the answer attached. Deliberately deferred, with
  the same trigger as §6: the first team whose members have never met the operator.
- **Nothing claims a change was made.** The record knows access happened and, because of the scoping
  below, never what came of it — so the copy says *worked in your team*, never *made changes*. An
  assertion the data cannot back is worse than none: the first Admin who checks and finds nothing
  different has been given a reason to distrust the whole surface.
- **Scoped to the act-as session, not to individual rows**
  — a necessity, not a preference: only `events` and `attendances` carry authorship
  (`created_by`, `changed_by`). `team_settings`, `team_positions`, `event_types` and invitations carry
  none, so per-row attribution structurally cannot cover Season configuration or Position curation,
  which is most of what setup *is*.
- **The actor is rendered generically** ("the TeamBalance owner") via an `actor_kind` of `MEMBER` |
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

**The ADMIN link is single-use; the USER link is not** (decided in [#240](https://github.com/ZzAve/teambalance-app/issues/240),
which this ADR left open). The shareable Invite Link is deliberately *one link, many joiners*
([ADR-0025](0025-invite-link-recoverable-at-rest.md)) — it is pasted into a team's WhatsApp and
everyone who opens it joins as a **User**, and that low-secrecy model is the feature. An **Admin**
grant cannot inherit those semantics: an admin-granting link with many-joiner reuse hands Admin to
everyone the recipient forwards it to, and the blast radius of a leaked Admin credential is a
different order of harm from a leaked roster join. So an `ADMIN`-granting link is **spent on first
accept** — `invitations.consumed_at` is stamped by the one accept that wins a conditional consume, and
a later present of the same token joins nobody. Minting is idempotent while the link is unspent, so a
team holds at most one live Admin credential at a time, mirroring ADR-0025's anti-accumulation rule.

**Rejected: accepting the shared trust model unchanged** ("it's the same as today"). It is not: today
every link grants User, so forwarding one only ever adds a player to a roster an admin can prune. An
Admin link is a handover of control, used exactly once by design, so the cost of making it single-use
is nil and the cost of not is a silent Admin leak. **Rejected: making *every* link single-use**, which
would break the deliberate many-joiner USER link for no gain — the reuse risk is specific to the Admin
grant. The single-use rule is therefore scoped to `role = ADMIN`; `role = USER` keeps ADR-0025's
semantics untouched.

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
