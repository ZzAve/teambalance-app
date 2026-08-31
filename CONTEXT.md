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
- **Active Team** — The one Team a request is scoped to. **Explicitly selected, never
  inferred**: carried on the session, chosen by the member (or by opening a team-scoped
  link), and remembered as their default between logins. A Member of several Teams has
  exactly one Active Team at a time; authorization for it comes either from their real
  membership or, for a **Platform Admin**, from **Act-as**
  ([ADR-0023](docs/adr/0023-active-team-explicit-tenant-resolution.md)).
  _Avoid_: current team, selected tenant, team context.
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
- **Reference** — A labeled, outbound URL an admin curates on an Event, pointing to a
  related external resource such as the Nevobo match page or the digital match form (DWF).
  Plural per event. Distinct from the Event's own shareable link (the deep link you send
  teammates) and from Magic/Invite Links. Surfaced to users as "Links" under an
  "Additional info" grouping. _Avoid_: Event Link, Attachment, Bookmark.
- **Audience** — The set of Members expected to respond to an Event. Defaults to the
  whole Team; an admin may select a subset (e.g. referee duty). Non-audience members
  can see the event but aren't prompted. Powers the "Mine" filter. **Deferred in v1**:
  every event targets the whole team, so the summary denominator is the full roster
  ([ADR-0009](docs/adr/0009-attendance-model-roles-in-audience-deferred.md)).
- **Recurring Event** — A batch of concrete Events sharing a `recurring_group`, generated
  up front from a weekly/bi-weekly + weekday + date-range rule (the rule itself is **not**
  stored — series identity is group membership). Each occurrence is an ordinary,
  independently-editable Event; edits/deletes carry a *this / this-and-following / all*
  scope, and partial edits **split** the series into independent groups
  ([ADR-0014](docs/adr/0014-recurring-events-materialized-batch-split-season.md)).
- **Season** — A per-team date window (`season_start`–`season_end`) an admin configures.
  When set, Event writes with a start outside the window are rejected (unchanged starts
  grandfathered); narrowing the window only warns about existing events. Supplies default
  dates to recurring creation ([ADR-0014](docs/adr/0014-recurring-events-materialized-batch-split-season.md)).
- **Season Policy** — The rule for *which* Event starts must fall inside the **Season** and
  *when* it is enforced: a single create checks its new start; a recurring batch checks every
  generated start and is rejected whole on the first offender (nothing is written); a scoped
  edit checks only the occurrences whose start actually *moves*, **grandfathering** unchanged
  starts — so a title-only *all* edit is never rejected and an occurrence already outside a
  narrowed window stays editable. An unconfigured Season permits everything
  ([ADR-0014](docs/adr/0014-recurring-events-materialized-batch-split-season.md)).
- **Attendance** — A Member's response to an Event. One of four **Attendance States**.
- **Attendance State** — `Attending` (green), `Maybe` (gold), `Absent` (red),
  `Not Responded` (default, no response yet). The semantic colors are fixed brand
  identity.
- **Event Attendance** — The resolved attendance picture of a single Event: every current
  Member paired with their **Attendance State** for that Event (their response, or
  **Not Responded** when they haven't answered). Derived from the *current* roster, so a
  Member who joins after the Event appears as Not Responded and a departed Member drops out,
  even if they once responded (per [ADR-0009](docs/adr/0009-attendance-model-roles-in-audience-deferred.md)).
  The summary counts, the roster, and the attending-**Position** breakdown are all views of
  this one picture. _Avoid_: attendance list, attendance snapshot.
- **Attendance Toggle** — The core daily interaction: a Member sets their state on an
  event. Editable by others today (trust-based) — see
  [ADR-0003](docs/adr/0003-trust-based-attendance-editing.md).
- **Bulk Attend** — The one-action shortcut where a Member sets their **Attendance State**
  to **Attending** for every Event they're currently at **Not Responded** on. It is
  deliberately narrow: **Attending-only** (never Maybe/Absent), **non-destructive** (only
  ever *creates* response rows for blanks — it never overwrites an existing response, so it's
  safe to re-tap as new events appear), **future-only** (past events are skipped), and scoped
  **per Event Type**: one button per type that currently has blanks, each naming its own scope
  ("Attend 12 trainings", "Attend 3 matches"), so no filtering is needed to make a legible tap
  ([ADR-0023](docs/adr/0021-bulk-attend-one-button-per-event-type.md) amends the original
  "currently shown" scoping; the **Event Type** filter still narrows what is on screen, and so
  what the buttons cover).
  Self-in-practice (no UI to Bulk Attend for others, though the endpoint stays trust-based per
  [ADR-0003](docs/adr/0003-trust-based-attendance-editing.md)) and **reversible** (an Undo
  deletes exactly the rows it just created). Surfaced as **"Attend N <type>"** buttons that
  disappear when nothing is left to fill. Contrast with the per-event **Attendance Toggle**.
  _Avoid_: Accept All, Attend All (overclaims — it's all *shown, unanswered, future*), Bulk RSVP.

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

- **Magic Link** — A one-time, passwordless login link sent to a member's email, and **the sole
  authentication method**: it proves control of an email, which is the only proof v1 accepts —
  deliberately no passwords and no third-party OAuth ([ADR-0008](docs/adr/0008-auth-magic-link-and-shareable-invite.md);
  Google Sign-In was dropped, [ADR-0027](docs/adr/0027-drop-google-signin-magic-link-only.md)).
  Sessions are server-side and stored in Postgres via Spring Session JDBC
  (the `SESSION` cookie), so they survive a container restart / cold start / redeploy
  ([ADR-0014](docs/adr/0014-jdbc-backed-shared-sessions-survive-restart.md), supersedes ADR-0010).
  _Avoid_: OAuth login, social login, password.
- **Invite Link** — A single shareable link an admin generates to onboard members into
  an existing Team. Clicking it → enter email → Magic Link → joined. One link, many
  joiners; can expire/rotate. Carries the **Role** it grants on acceptance — ordinarily
  **User**, but an **Admin**-granting link is how a memberless Team gets its first Admin
  ([ADR-0024](docs/adr/0024-platform-admin-act-as.md)).
- **Team creation** — Provisioning a new Team. Self-service: a logged-in, teamless user
  creates their Team from a name + slug + one-time **creation code**, which provisions the
  tenant schema inline (see [ADR-0019](docs/adr/0019-self-service-team-onboarding.md)).
  Back-office onboarding is now just minting a creation code. A **Platform Admin** may also
  create a Team **memberless** — no founding Admin — and hand it over with an Admin-granting
  **Invite Link** ([ADR-0024](docs/adr/0024-platform-admin-act-as.md)).

### Platform & integrations

- **Platform Admin** — A platform-level identity that operates *across* Teams: mints creation
  codes, and enters Teams via **Act-as**. Held by an allowlist (`teambalance.platform-admins`),
  fail-closed. Structurally **teamless** — a Platform Admin is never a **Member** of any Team,
  so a human who both runs the platform and plays keeps two separate accounts. Not a **Role**:
  **Admin** is a Member's tier *within* a Team, and the two are unrelated.
  _Avoid_: platform owner, superadmin, owner, god mode.
- **Act-as** — An explicitly entered, time-boxed state in which a **Platform Admin** operates
  inside one Team as if they were an Admin of it. Full read *and* write. Always visible while
  active, always exited deliberately, and always recorded — see **Act-as Record**
  ([ADR-0024](docs/adr/0024-platform-admin-act-as.md)). _Avoid_: impersonation, spy mode,
  support mode, sudo.
- **Virtual Member** — The synthesized **Admin** authorization a **Platform Admin** holds inside
  a Team during **Act-as**. Exists only for the duration of the request: no `team_members` row is
  ever written, so a Virtual Member never appears on the roster, in an **Event Attendance**
  denominator, in the **Position** breakdown, or in the **Hall of Shame**.
  _Avoid_: ghost member, shadow admin, temporary member.
- **Act-as Record** — The account, readable by a Team's **Admins**, of when a **Platform Admin**
  had access inside that Team. Scoped to the **Act-as** session rather than to individual rows,
  because most tenant tables carry no authorship column — so it records that access *happened*,
  never what came of it, and is worded accordingly ("worked in your team", never "made changes").
  Attributes the actor generically (the TeamBalance owner, not a named person), while the underlying
  `created_by` keeps the real user id for forensics. Lives on the Admin-only team settings page,
  collapsed until opened ([ADR-0024](docs/adr/0024-platform-admin-act-as.md) §4). _Avoid_: audit log
  (that is the separate, broader feature), access log, trail.
- **Tenant schema** — Per-team Postgres schema holding events, attendances,
  transactions, etc.
- **Platform schema** (`public`) — Cross-team data: users, teams, team_members,
  invitations.
- **Bunq** — The banking API backing the Money Pool. Abstracted behind a port so it
  isn't load-bearing in the domain (per ADR-0001).
- **Nevobo** — Dutch volleyball federation; source of external league standings
  (Competition context).

### Architecture (hexagonal) ([ADR-0018](docs/adr/0018-enforce-hexagonal-architecture-with-flock-detekt.md))

The backend is hexagonal (ports & adapters). These boundaries are enforced by the build
(flock-detekt rulesets on `:api:detekt`), not just by convention. The four source layers under
`com.github.zzave.teambalance.api` are **domain**, **application**, **infrastructure**, and
**interfaces**.

- **Domain** — Entities, value objects, and domain events. Framework-free: no Spring, JPA, or
  other framework imports. The innermost layer; depends on nothing else here.
- **Application** — Use cases (the `*Service` orchestrators) and the **port** interfaces they
  need. Also framework-free (this is the stricter half of [ADR-0018](docs/adr/0018-enforce-hexagonal-architecture-with-flock-detekt.md)):
  a service is a constructor-injected plain class, not a Spring `@Service`.
- **Port** — An interface, owned by the domain/application side, describing something the
  application needs from the outside world (`EventRepository`, `EmailGateway`, `CurrentUserGateway`).
  Named with a `Repository`, `Gateway`, `Port`, or `Client` suffix. The dependency-inversion seam:
  the application depends on the port, never on the adapter. _Avoid_: interface, service interface.
- **Adapter** — A concrete implementation of a **port** living in **infrastructure** (a JPA
  repository, the Bunq client, an email sender). Named `*Adapter` or `*Impl`. Adapters talk to the
  domain through ports, never directly to one another. _Avoid_: implementation, provider, gateway
  (a gateway is the *port*, its adapter is the implementation).
- **Value Object** — A domain type that replaces a raw primitive with a meaningful, type-safe one
  — a Kotlin `@JvmInline value class` wrapping a single value (`EventId(UUID)`, `Email(String)`).
  Converted to/from its primitive **only at the edges** (the JPA entity mapper and the Wirespec DTO
  mapper); the Wirespec contract and DB schema are unchanged. _Avoid_: wrapper, id class.
- **Composition Root** — The single Spring `@Configuration` in **infrastructure** that constructs
  the framework-free application services from their ports. The **only** place autowiring happens
  for those services; keeps the domain/application layers Spring-free. _Avoid_: DI config, wiring,
  bean config (when specifically meaning this root).
