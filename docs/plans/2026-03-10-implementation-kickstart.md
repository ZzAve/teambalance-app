# TeamBalance Rebuild — Implementation Kickstart

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the phase implementation plans from this document.

**Goal:** Build a new TeamBalance from scratch — a sports team management app for event attendance tracking and a shared money pool — replacing the current codebase with a modern, clean-foundation stack.

**Architecture:** Clean-slate monorepo with three deployables (api, app, www) sharing design tokens. Backend is hexagonal DDD with Kotlin/Spring Boot 4. Frontend is Vite + React SPA with Feature-Sliced Design. API contracts are code-generated from Wirespec definitions.

**Tech Stack:**
- Backend: Kotlin, Spring Boot 4, Hibernate/JPA, Flyway, Gradle
- Frontend: Vite, React, TypeScript, Tailwind CSS, Shadcn UI, Feature-Sliced Design
- Contracts: Wirespec (generates Kotlin server interfaces + TypeScript client types)
- Guardrails: flock-detekt, ArchUnit, ESLint + eslint-plugin-project-structure

---

## Where context lives

| File | Contents |
|------|----------|
| `docs/plans/2026-03-09-teambalance-rebuild-design.md` | Full design document — architecture, tech stack, domain decisions, user flows, visual design |
| `tmp/app-shell-grandstander.html` | App shell prototype: navigation, fonts, colors, animations |
| `tmp/prototype-events.html` | Events browsing + interaction flow |
| `tmp/prototype-create-events.html` | Admin event creation (single + recurring) |
| `tmp/prototype-money-pool.html` | Money pool: balance, beer counter, hall of fame/shame, top-up |

**Read the design doc first.** It is the single source of truth.

---

## What has been decided

### Visual design
- **Display font:** Grandstander (Google Fonts) — wordmark, page titles, stat numbers only
- **Body font:** DM Sans (Google Fonts)
- **Palette:** Blue #225C9C, Green #249E6C, Gold #F4B400, Background #F8F6F0 (warm cream)
- **Semantic:** Green = attending, Gold = maybe, Red = absent, Gray = no response
- **Vibe:** Warm & Energetic — consumer app (Strava meets Splitwise), not enterprise dashboard
- **Navigation:** Bottom tab bar mobile, left sidebar desktop. 3 tabs: Events, Money Pool, Team

### Domain decisions
- Generic `EventType` instead of separate Training/Match/Misc entities
- 4 attendance states: attending, maybe, absent, not responded
- Any team member can update anyone's attendance (trust-based)
- Event audience: default = entire team, or specific subset of members
- Location = Google Maps link
- Optional description field per event
- Beer counter: balance ÷ configurable beer price (admin sets, e.g. €2.70)
- Hall of Fame (Toppers 🏆) + Hall of Shame (Floppers 🐷), 30-day or season toggle
- Top-up: preset amounts €10/20/50 + custom → opens bunq.me link

### Multitenancy
- Platform schema (public): users, teams, team_members, invitations
- Tenant schema per team: events, attendances, transactions, roles, etc.
- Self-service team creation; invite-only (shareable link)
- Ad-hoc schema creation when a team is provisioned

### Open questions (resolve before/during planning)
- Authentication: session-based, JWT, or OAuth provider?
- Frontend state management: React Context, Zustand, or TanStack Query alone?
- Landing page technology: plain HTML, Astro?
- Calendar integration: Google Calendar, iCal export?
- Event add-on DB modeling: JSON column, separate tables, or EAV?
- Deployment: still Google Cloud Run?

---

## Build priority (MVP first)

### Phase 1 — Foundation
- New repo setup: Gradle monorepo, api/app/www/design-tokens modules
- Backend: Spring Boot 4 app skeleton, multitenancy infrastructure, Flyway, Hibernate
- Frontend: Vite + React skeleton, FSD folder structure, design tokens wired, ESLint configured
- Wirespec pipeline: first contract definition, Kotlin + TypeScript generation verified

### Phase 2 — Core event loop
- Backend: Event domain (generic EventType, Attendance with 4 states, audience, recurring)
- Backend: Event CRUD API (Wirespec-defined)
- Frontend: Events list page (filters, cards, attendance chips)
- Frontend: Event detail (attendance toggle, attendees by role, audience indicator, Maps link)

### Phase 3 — Admin event management
- Frontend: Create single event form
- Frontend: Create recurring events with preview
- Frontend: Edit/delete events

### Phase 4 — Money pool
- Backend: Finance domain (MoneyPool, Transaction, Bunq adapter)
- Frontend: Money pool page (balance + beer counter, Hall of Fame/Shame, transactions, top-up)

### Phase 5 — Auth + onboarding
- Backend: Identity domain (User, AuthToken)
- Frontend: Login, sign up, join via invite link
- Frontend: Profile page (edit name, pick team role)

### Phase 6 — Competition + polish
- Backend: Competition domain (Nevobo adapter)
- Frontend: Competition page
- Refinement, accessibility, performance

---

## Guardrails to set up in Phase 1

### Backend (Kotlin)
- flock-detekt: https://github.com/flock-community/flock-detekt
- ArchUnit rules:
  - `domain` must not import from `infrastructure`, `interfaces`, or Spring
  - `application` must not import from `infrastructure` or `interfaces`
  - `interfaces` must not import from `infrastructure` directly

### Frontend
- TypeScript strict mode
- ESLint with eslint-plugin-project-structure
- FSD layer import rules (no upward imports between layers)
- Reference: https://feature-sliced.design/blog/mastering-eslint-config

---

## Kickstart prompt for fresh session

Copy this into a new Claude Code session opened at the new repo root:

```
I'm starting the implementation of a full rewrite of TeamBalance — a sports team management app.

Context lives in the OLD repo at:
/Users/julius.van.dis/IdeaProjects/Personal/teambalance/docs/plans/2026-03-09-teambalance-rebuild-design.md

UI prototypes (HTML, open in browser) are in:
/Users/julius.van.dis/IdeaProjects/Personal/teambalance/tmp/

Read the design doc first, then read the kickstart plan:
/Users/julius.van.dis/IdeaProjects/Personal/teambalance/docs/plans/2026-03-10-implementation-kickstart.md

I want to start with Phase 1 (Foundation). Use the writing-plans skill to create a detailed implementation plan for Phase 1, resolving any open questions with me first.
```
