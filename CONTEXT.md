# TeamBalance — Domain Context

The shared language of TeamBalance. When code, issues, tests, or proposals name a
domain concept, use the term **exactly as defined here**. Don't drift to synonyms.
This file is grown lazily — terms are added as they get resolved (e.g. during
`/grill-with-docs`). Decisions live in `docs/adr/`.

## What TeamBalance is

A team-management app for sports clubs solving two jobs no single tool covers well:
**event attendance tracking** and a **shared money pool**. Started as a hobby tool for
two volleyball teams at Tovo Utrecht; being rebuilt to grow toward any-sport,
any-team, self-service (see [ADR-0001](docs/adr/0001-product-ambition-hobby-tool-built-to-grow.md)).

## Glossary

### Teams & people

- **Team** — A group of people who play together and share events and a money pool.
  Private/invite-only. The unit of tenancy (one tenant schema per team).
- **Member** — A person belonging to a Team. Has exactly one **Role** and at most one
  **Position**.
- **Role** — A Member's permission tier within a Team: **Admin** or **User**. Every
  member has exactly one. _Avoid_: permission level, access level — and don't confuse it
  with **Position** (the DB column `role` holds this).
- **Position** — A team-defined playing position (e.g. Setter, Libero, Outside Hitter,
  Trainer). Sport-agnostic and configurable per team; drives the position-based attendee
  summary. A member has **at most one**; a member without one appears as **Unassigned**.
  Positions are managed per team by an Admin ([ADR-0013](docs/adr/0013-member-profile-position-role-management.md),
  amending [ADR-0009](docs/adr/0009-attendance-model-roles-in-audience-deferred.md)).
  _Avoid_: role, team_role.
- **Unassigned** — The bucket in the attendance summary for Members with no **Position**.
- **Admin** — A Member whose **Role** is Admin: CRUD events, manage members, manage
  positions, promote/demote other members, configure integrations. Contrast with a plain
  **User**.
- **User** — A Member with baseline permissions: view events, manage attendance, view
  the money pool, top up. (Also: a platform-level account in the Identity context.)

### Events & attendance — *the heart of the app* ([ADR-0002](docs/adr/0002-attendance-is-the-core-pillar.md))

- **Event** — A scheduled team occurrence (training, match, social, misc). Generic
  model with a configurable **Event Type** — not separate Training/Match classes.
- **Event Type** — A configurable category of event. Drives icon/badge and filtering.
- **Audience** — The set of Members expected to respond to an Event. Defaults to the
  whole Team; an admin may select a subset (e.g. referee duty). Non-audience members
  can see the event but aren't prompted. Powers the "Mine" filter. **Deferred in v1**:
  every event targets the whole team, so the summary denominator is the full roster
  ([ADR-0009](docs/adr/0009-attendance-model-roles-in-audience-deferred.md)).
- **Recurring Event** — An event scheduled to repeat (e.g. weekly training for a
  season), created in a batch.
- **Attendance** — A Member's response to an Event. One of four **Attendance States**.
- **Attendance State** — `Attending` (green), `Maybe` (gold), `Absent` (red),
  `Not Responded` (default, no response yet). The semantic colors are fixed brand
  identity.
- **Attendance Toggle** — The core daily interaction: a Member sets their state on an
  event. Editable by others today (trust-based) — see
  [ADR-0003](docs/adr/0003-trust-based-attendance-editing.md).

### Money pool

- **Money Pool** — A team's shared pot of money, backed by a real bank account (Bunq).
  Built on trust, not individual debt tracking. **Optional per team**: a team without
  Bunq simply has no pool ([ADR-0007](docs/adr/0007-money-pool-v1-scope.md)).
- **Beer Counter** — The current balance translated into an approximate number of
  beers, using an admin-configurable beer price (e.g. €2.70/beer).
- **Top-up** — A Member adding money to the pool. Preset amounts (€10/€20/€50) or
  custom, opening a bunq.me deep link (mobile-first, no QR).
- **Hall of Fame (Toppers 🏆)** / **Hall of Shame (Floppers 🐷)** — Side-by-side
  contributor rankings over a period (last 30 days or full season).

### Identity & onboarding ([ADR-0008](docs/adr/0008-auth-magic-link-and-shareable-invite.md), [ADR-0011](docs/adr/0011-add-google-signin-verified-email-linking.md))

- **Magic Link** — A one-time, passwordless login link sent to a member's email. One of
  two passwordless authentication methods (the other is **Google Sign-In**); both prove
  control of an email. Sessions are server-side and stored in Postgres via Spring Session JDBC
  (the `SESSION` cookie), so they survive a container restart / cold start / redeploy
  ([ADR-0014](docs/adr/0014-jdbc-backed-shared-sessions-survive-restart.md), supersedes ADR-0010).
- **Google Sign-In** — Authenticating with a Google account. Treated as a second proof of
  email control equivalent to a **Magic Link**: a Google login lands in the *same* account,
  matched on verified email. There is no separate "Google account" in the model.
  Deliberately **no passwords** — email control is the only proof v1 accepts.
  _Avoid_: OAuth login, social login, password.
- **Invite Link** — A single shareable link an admin generates to onboard members into
  an existing Team. Clicking it → enter email → Magic Link → joined. One link, many
  joiners; can expire/rotate.
- **Team creation** — Provisioning a new Team. In v1 this is a manual/back-office step
  (DB/API); self-service team creation is deferred.

### Platform & integrations

- **Tenant schema** — Per-team Postgres schema holding events, attendances,
  transactions, etc.
- **Platform schema** (`public`) — Cross-team data: users, teams, team_members,
  invitations.
- **Bunq** — The banking API backing the Money Pool. Abstracted behind a port so it
  isn't load-bearing in the domain (per ADR-0001).
- **Nevobo** — Dutch volleyball federation; source of external league standings
  (Competition context).
