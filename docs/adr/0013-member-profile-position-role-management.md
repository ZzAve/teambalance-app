# ADR-0013: Member profile, position vocabulary, and role management

- Status: Accepted
- Date: 2026-07-22
- Amends: [ADR-0009](0009-attendance-model-roles-in-audience-deferred.md) (position/role
  management is no longer deferred)
- See also: [ADR-0008](0008-auth-magic-link-and-shareable-invite.md),
  [ADR-0012](0012-adopt-spring-security-session-fixation-csrf-unified-auth.md)

## Context

V1 shipped identity and invite-onboarding but no way to manage a member after they join.
Display name is auto-derived from the email prefix (`email.substringBefore("@")`),
`team_role` (the playing position) is never populated, and permission role is hardcoded
`USER` at `addMember`. ADR-0009 deferred all position/role management to back-office SQL.
Provisioning the first real team exposed the gap: the invite link gets people *in* but
leaves their data unusable and un-editable, and the position-based attendee summary — v1's
load-bearing hook (ADR-0004) — renders blank because no member has a position.

The word "role" was also overloaded: the glossary used **Role** for the playing position,
while the `team_members.role` column holds the permission tier (`USER`/`ADMIN`). Every new
endpoint and DTO would inherit that ambiguity.

## Decision

**Naming — adopt RBAC convention, reversing the ADR-0009/glossary sense of "role".**

- **Role** = permission tier (`USER` | `ADMIN`), matching the existing `role` column.
- **Position** = the team-defined playing position, formerly called "Role" / `team_role`.

The API contract, UI, and glossary use these terms. See CONTEXT.md.

**Position is a fixed per-team vocabulary with full admin CRUD (supersedes ADR-0009's
deferral).**

- New `team_positions(id, team_id, label)` in the `public` schema; `team_members` gains a
  nullable `position_id` FK (replacing the free-text `team_role`).
- Admins create/rename/delete their team's positions in-app. Deleting a position in use
  silently reassigns its members to NULL.
- Position is **required-when-available**: the UI forces a pick wherever the team has
  positions, but the column is nullable so back-office-provisioned members are tolerated.
  A member with no position is shown as **Unassigned** in the summary.

**Member management surfaces ship.**

- A member edits their **own** display name and position (self-service profile).
- An admin edits **any** member's display name, position, and role, and can soft-remove a
  member (`active=false`).
- Member updates use `PUT /api/members/{userId}` carrying the **full member DTO**
  (`displayName`, `position`, `role`); the server enforces the guards below. Removal is
  `DELETE`. Endpoints follow the ADR-0012 security chain (session-authenticated, CSRF
  token on mutations, controller-level `requireAdmin` — no `@PreAuthorize`).

**Authorization guardrails (flat model — no owner role).**

- Any admin may promote/demote anyone including peers and themselves.
- **Last-admin floor:** an action that would leave a team with zero admins is rejected
  (`LAST_ADMIN`).
- A self-caller cannot elevate their own role.
- Soft-remove is admin-only (no member self-removal) and also honors the last-admin floor.
- Display name is trimmed, 1–100 chars, non-blank, and **unique per team**
  (case-insensitive) — an application-level check (`NAME_TAKEN`).

**Onboarding capture.**

- The invite page stays email-only. After magic-link verify + accept, a member whose
  `team_members.onboarded_at` is NULL is routed once to `/welcome` (name + position) before
  landing home; finishing sets `onboarded_at`. The same rule captures the back-office
  owner on first login.

## Considered alternatives

- **Keep the glossary sense (Role = position), name the permission tier separately** —
  rejected: fights the `role` column and standard RBAC expectations in every DTO.
- **Free-text position** — rejected: fragments the summary partition ("Mid" vs "Middle").
- **Introduce an immutable owner role** — rejected: the flat USER/ADMIN model plus a
  last-admin floor is enough; an owner adds a transfer-ownership concept out of scope here.

## Consequences

- ADR-0009's "role management UI deferred (Priority 3)" no longer holds; its clean-partition
  intent is preserved via the fixed vocabulary.
- `team_members.team_role` (free text) is replaced by `position_id` — a data migration.
- The magic-link (non-invite) signup path still auto-derives a display name; the per-team
  uniqueness check applies at the write-points we build, so a derived duplicate is possible
  transiently until the member completes their profile.
- A new `/welcome` routing seam (profile-incomplete → complete) is introduced in the SPA.
