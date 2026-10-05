# ADR-0038: Shirt numbers, and two photos that are copied rather than linked

- Status: Proposed
- Date: 2026-10-03
- Relates to: [ADR-0026](0026-member-team-profile-owned-by-the-tenant.md) (the team profile lives in
  the tenant), [ADR-0033](0033-substitutes-are-not-members.md) (Substitutes are not Members),
  [ADR-0013](0013-member-profile-position-role-management.md) (who may edit a member)

## Context

Members are shown only by their initials on a colour keyed to their user id, and nothing records
what number they play under. Both are wanted now so players can be recognised on the roster and in
an Event's lineup, and both are prerequisites for building lineups later (out of scope here).

The two attributes pull in different directions on ownership. A **Shirt Number** is plainly a fact
about one Team (ADR-0026's reasoning applies unchanged). A photo is a face, which looks like identity
and therefore platform data — yet a player in two Teams may want a different picture in each, for
example in that Team's kit.

## Decision

**Shirt Number is team profile data.** It lives on the tenant's member profile next to the display
name and Position: a whole number 0–999 (so 7 and 07 are the same), optional. It is unique among a
Team's *current* Members — an application check reported as `NUMBER_TAKEN`, the same shape as
`NAME_TAKEN` and for the same fixture reason ADR-0026 gives for not using an index. Leaving the Team
frees the number. The member edits their own; an Admin edits anyone's.

A **Substitute** also carries an optional Shirt Number on the Substitute list, unique among
Substitutes only. It may equal a Member's number: a Substitute often wears a borrowed shirt. It is
edited through the existing admin-only Substitute update. A per-Event number belongs to the lineup
work, not here.

**There are two photos, and the Team one is a copy.**

- A **Personal Photo** belongs to the person (platform schema) and is managed from the Account tab,
  which works without an Active Team. Only its owner ever sees it.
- A **Team Photo** belongs to the member within one Team (tenant schema). It is either a copy of the
  Personal Photo taken when the member chooses "use my personal photo", or a separate upload.
- A member with no Team Photo is shown by their initials. The Personal Photo is **never** a live
  fallback.
- Only the member uploads either photo. An Admin may remove a Team Photo in their Team, and nothing
  else. Leaving the Team discards the Team Photo.

**Photos are stored in Postgres.** The browser crops to a square and resizes to 256×256 WebP before
upload; the server checks type and size (≤ 200 KB) and serves the image from its own endpoint with a
cache header. At a hobby team's scale that is a few megabytes per Team, needs no new infrastructure,
and is covered by the existing backups. Storage sits behind a port so object storage can replace it.

## Considered alternatives

- **One photo per person, shown in every Team** — rejected: a member cannot show a different picture
  per Team, and the Team schema would read platform data to render its own roster.
- **A Team Photo that falls back to the Personal Photo** — rejected for the reason ADR-0026 rejected
  an editable global name: changing the personal picture would silently change every Team that never
  chose one, and a member could not predict which Teams follow.
- **Object storage (Scaleway, S3-compatible)** — deferred: a bucket, credentials, and a second test
  container for a few hundred small images.
- **Shirt Number as text, so 0 and 00 differ** — rejected: harder to compare and sort for a
  distinction few teams make.

## Consequences

- `/welcome` gains an optional Shirt Number field and, when the member already has a Personal Photo,
  a pre-ticked "use my personal photo in this team" — the moment that copy most often happens.
- The `/team` roster becomes a grid of round faces with the Shirt Number as a badge, sorted by
  number (members without one last). Each face opens a **member detail page** showing the photo,
  number, Position and Role. There a member edits their own name, Position, Shirt Number and Team
  Photo; an Admin edits anyone's name, Position and Shirt Number and may remove their Team Photo.
  Chosen from a UI prototype (roster variant "round faces", detail variant "round header").
- The Event lineup panel does not show numbers or photos yet; that comes with the lineup work.
- Uploading a Personal Photo while the current Team has no Team Photo asks once whether to copy it.
