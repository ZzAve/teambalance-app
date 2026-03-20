# TeamBalance Rebuild Design

## What is TeamBalance?

TeamBalance is a team management app for sports clubs that solves two problems no single
tool covers well: **event attendance tracking** and **a shared money pool**.

Sports teams meet regularly — weekly trainings, league matches, social events. For each
event, you need to know who's coming, whether every position is filled, and if you need
substitutes. After the match, the team gathers in the canteen and runs up a tab. Splitting
that bill across 12 people with cash is a thing of the past — but no one wants to Tikkie
each other every week either.

TeamBalance gives teams a single place to:
- **Plan events and track attendance** — see at a glance who's coming, who's absent, and
  whether the team has enough players per position (setter, libero, outside hitter, etc.)
- **Run a shared money pool** — backed by a real bank account (Bunq), where everyone can
  chip in and see the balance and transaction history. Built on trust, not individual tracking.

It started as a hobby project for two volleyball teams at Tovo Utrecht. The rebuild aims to
open it up: any sport, any team, self-service. The core value stays the same — one app that
replaces the group chat chaos of "who's coming Saturday?" and "who still owes money for beers?"

### Why the look & feel matters

TeamBalance lives on people's phones. It's checked quickly — before practice to see who's
coming, after the match to top up the pot. The UI must be fast, clear, and pleasant to use
on a small screen. It's not an enterprise dashboard; it's a tool teammates interact with
multiple times a week. The design should feel personal, modern, and effortless — closer to
a consumer app than a management tool.

## Decision: Clean-slate rewrite (new repo)

The delta between the current codebase and the target is too large for incremental refactoring:
JOOQ -> Hibernate, Liquibase -> Flyway, Maven -> Gradle, MUI -> Shadcn/Tailwind,
rigid event types -> generic event model, embedded frontend -> standalone SPA.

The existing app stays running while the new one is built. Domain knowledge and integration
logic (Bunq, multitenancy, Nevobo) are ported into the new structure.

## Visual Design & UX

### Design Direction: Warm & Energetic

Not a sterile enterprise dashboard. A consumer app teammates enjoy opening multiple times
a week. Think Strava meets Splitwise — personal, modern, effortless.

### Typography

- **Display font** (wordmark, page titles, stat numbers): **Grandstander** — playful confidence
  with rounded forms. Warm personality without crossing into childish territory.
- **Body font** (card titles, labels, nav, body text): **DM Sans** — clean, readable complement.
- The serif/display + sans pairing creates contrast that feels characterful yet functional.

Usage rules:
- Grandstander is reserved for high-impact elements only (wordmark, page titles, big numbers)
- Everything at 14px or below uses DM Sans for readability
- Uppercase labels get 1-1.5px letter-spacing
- Financial numbers use tabular figures

### Color Palette

Core brand colors, refined for warmth and UI contrast:
- **Primary Blue** #225C9C — navigation active states, primary actions, trust
- **Accent Green** #249E6C — positive states (attending, success), "Balance" in wordmark
- **Warm Gold** #F4B400 — sparingly for highlights, badges, energy accents
- **Background** #F8F6F0 — warm cream (not pure white)
- **Card surface** #FEFDFB — warm white with subtle distinction from background
- **Text** — dark blue-gray (not pure black)
- **Shadows** — warm-tinted (brown/amber undertone, not cold gray)

Semantic mappings:
- Green = attending / positive / success
- Gold = maybe / pending / attention
- Red (to define) = absent / negative / error

### Navigation

- **Mobile (< 768px)**: Bottom tab bar, persistently visible, glassmorphism backdrop-blur.
  Active tab gets a pill highlight with spring-like bounce animation. 3 tabs: Events, Money Pool, Team.
- **Desktop (>= 768px)**: Persistent left sidebar with rounded active-item highlight.
  Generous padding, spacious feel.
- Tab transitions: content fades/slides in subtly on switch.

### Interaction Principles

- Micro-animations on state changes (attendance toggle should feel satisfying)
- Hover states on desktop: gentle scale or color shift
- Spring-like easing for active indicators (bouncy, not mechanical)
- Cards lift subtly on hover (desktop)
- Respects prefers-reduced-motion

### Reference Prototypes

All prototypes are standalone HTML files — open directly in a browser.

| File | What it covers |
|------|----------------|
| `tmp/app-shell-grandstander.html` | Navigation shell: bottom tab bar (mobile), sidebar (desktop), tab transitions |
| `tmp/prototype-events.html` | Events list with filters, event detail, attendance toggle, attendees by role, comments, audience |
| `tmp/prototype-create-events.html` | Admin event creation: single event form, recurring events with preview, success animation |
| `tmp/prototype-money-pool.html` | Balance + beer counter, Hall of Fame/Shame with period toggle, transactions, bunq top-up flow |

## Tech Stack

### Backend
- Kotlin, Spring Boot 4, Hibernate / Spring Data JPA, Flyway
- Gradle (Wirespec plugin is Gradle-native)
- Kotlin Coroutines for async
- Caffeine caching
- Structured as hexagonal DDD (domain, application, infrastructure, interfaces)

### Frontend (app.teambalance.app)
- Vite + React SPA (TypeScript)
- Tailwind CSS + Shadcn UI
- Feature-Sliced Design architecture
- ESLint with eslint-plugin-project-structure for FSD enforcement

### Landing Page (teambalance.app)
- Simple/lightweight (plain HTML or minimal framework)
- Shared design tokens with the app

### API Contracts
- Wirespec (.ws definitions) generating both Kotlin server interfaces and TypeScript client types
- Definitions live in api/src/main/wirespec/, TypeScript output goes to app/src/shared/api/generated/

### Design Tokens
- Shared CSS custom properties + Tailwind preset
- Consumed by both app/ and www/

## Domains

- `teambalance.app` - landing page / marketing
- `app.teambalance.app` - logged-in SPA
- `api.teambalance.app` - REST API

## Repository Structure

```
teambalance/
├── api/                          # Kotlin Spring Boot backend (Gradle)
│   ├── build.gradle.kts
│   ├── src/main/wirespec/        # Wirespec contract definitions
│   ├── src/main/kotlin/
│   │   └── app/teambalance/
│   │       ├── domain/           # Pure domain logic, no framework deps
│   │       ├── application/      # Use cases / orchestration
│   │       ├── infrastructure/   # Persistence, external APIs, config
│   │       └── interfaces/       # REST controllers (Wirespec-generated interfaces)
│   └── src/test/kotlin/
├── app/                          # Vite + React SPA
│   ├── package.json
│   ├── src/
│   │   ├── app/                  # FSD: providers, routing, global styles
│   │   ├── pages/                # FSD: page compositions
│   │   ├── widgets/              # FSD: large self-contained UI blocks
│   │   ├── features/             # FSD: user interactions
│   │   ├── entities/             # FSD: domain objects
│   │   └── shared/               # FSD: utilities, UI kit, API client, design tokens
│   └── eslint.config.js
├── www/                          # Landing page
├── design-tokens/                # Shared CSS custom properties / Tailwind preset
│   ├── tokens.css
│   └── tailwind-preset.js
├── build.gradle.kts              # Root Gradle
├── settings.gradle.kts
└── .github/workflows/            # CI/CD
```

## Backend: DDD Bounded Contexts

### Team Management
- Teams, members, custom roles (Setter, Libero, etc.), invitations
- Supports multiple sports
- Invite-only with shareable invite links
- Admins can ban members and promote others to admin

### Events
- Generic event model with configurable EventType (not separate Training/Match/Misc classes)
- Attendance tracking with 4 states: attending, maybe, absent, **not responded**
- Any team member can update anyone's attendance (trust-based, like the money pool)
- Recurring event scheduling
- Location stored as Google Maps link (tappable to open directions)
- Optional description field per event — for notes, substitutes, special info (set by admin at creation)
- **Event audience**: each event has an audience — default is the entire team, or admin can select a subset
  - Only audience members are expected to respond; others can see the event but aren't prompted
  - Events list has a "Mine" filter showing only events where the user is in the audience
  - Useful for misc events like referee duty or canteen service that only apply to specific members
- Pluggable add-on system (carpooling, material responsibility, etc.)

### Finance / Money Pool
- Bunq banking API integration
- Balance display with **beer counter** — translates current balance into approximate number of beers
  (beer price is configurable by admin, e.g., €2.70/beer)
- Transaction history, top-ups
- Transaction exclusion filtering
- **Top-up flow**: preset amounts (€10, €20, €50) + custom amount → opens bunq.me link
  - Mobile-first: no QR code, direct bunq deep-link
- **Hall of Fame** (Toppers 🏆) and **Hall of Shame** (Floppers 🐷) side by side
  - Time period: last 30 days or full season (toggle)
  - Playful pig emoji treatment for shame list

### Competition
- External league standings (Nevobo integration)

### Identity
- Platform-level user accounts (outside tenant schemas)
- Authentication, registration

## Multitenancy

### Platform vs. Tenant Data Split
- **Platform schema** (public): users, teams, team_members, invitations
- **Tenant schemas** (per team): events, attendances, transactions, event_addons, roles, competition_config

### Self-Service Team Creation
- Anyone can create a team on signup
- Teams are private/invite-only by default
- Join via invite link generated by team admin
- Ad-hoc schema creation when a new team is provisioned

## Hexagonal Architecture Layers

```
interfaces/   -> application/   -> domain/
(controllers)    (use cases)       (entities, value objects, repository ports)
                                        ^
infrastructure/ ------- implements -----+
(JPA repos, Bunq adapter, Nevobo client, tenant resolution)
```

**Dependency rules (enforced via ArchUnit):**
- domain must not import from infrastructure, interfaces, or Spring
- application must not import from infrastructure or interfaces
- interfaces must not import from infrastructure directly

## Guardrails

### Backend
- flock-detekt (Kotlin static analysis rules)
- ArchUnit tests enforcing DDD layer boundaries
- Wirespec for contract-first API design

### Frontend
- ESLint (strict) with eslint-plugin-project-structure
- Feature-Sliced Design lint rules (layer import restrictions)
- TypeScript strict mode

## User Roles

- **User**: view events, manage own attendance, view money pool, top-up
- **Admin**: all user permissions + CRUD events, manage members, manage roles, configure integrations

## User Flows

### Priority 1 — Core (prototype and build first)

**Browse & interact with events (normal user):**
- See upcoming events list, filter by type (training/match/misc) and date range
- Tap event card → event detail with attendees grouped by status
- Set own attendance: attend / maybe / absent (the core daily interaction)
- Role-based attendee summary (e.g., "8 attending: 1 Trainer, 4 Setters, 3 Mids")

**Create events (admin):**
- Create single event: pick type, title, date/time, location
- Create recurring events: e.g., weekly training for the season, batch creation
- Edit/delete existing events
- Manage attendees: override attendance, add substitutes

**Money pool:**
- View current balance prominently
- Browse transaction history with filter/search
- Top up the pool
- View contributor rankings (who's chipped in most/least)

**Competition (normal user):**
- View league standings / leaderboard (Nevobo integration)

### Priority 2 — Important but deferrable

**Onboarding & identity:**
- Sign up / log in
- Join team via invite link
- Edit profile, select team role
- Log out

**Invite members (admin):**
- Generate shareable invite link

### Priority 3 — Later

- Create team / switch teams (handled via DB/API initially)
- Manage members: promote, ban, remove (handled via DB/API initially)
- Manage custom roles (Setter, Libero, etc.)
- Configure integrations (Bunq connection, competition link)
- Event add-ons (carpooling, material responsibility)

## Open Questions (to resolve during implementation planning)

- Authentication mechanism: session-based, JWT, or OAuth provider?
- State management in frontend: React Context, Zustand, or TanStack Query alone?
- Landing page technology: plain HTML, Astro, or something else?
- Calendar integration approach (Google Calendar, iCal export, etc.)
- How add-ons are modeled in the DB (JSON column, separate tables, EAV?)
- Deployment target: still Google Cloud Run, or reconsider?