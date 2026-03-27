# Phase 2 — Core Event Loop Design

**Status:** Approved

## Goal

Build the core daily interaction: viewing events, toggling attendance, and creating events. This gives the app its primary value loop — team members check upcoming events and mark their attendance.

## Scope

- Event CRUD (create, read, update, delete)
- Attendance toggling (attend / maybe / absent)
- Event types (hardcoded seeds: Training, Match, Other)
- Event list with "show past events" toggle (default: future + 6h grace)
- User selector (fake identity until Phase 5 auth)
- Seed data for demo team + users

**Not in scope:** recurring events, event audience scoping, money pool, auth, notifications.

## Architecture: Full Hexagonal

Domain entities are plain Kotlin. Repository ports are interfaces in `application/`. JPA entities live in `infrastructure/` as separate classes with mappers. ArchUnit enforces boundaries.

## Domain Model

```
domain/
  model/
    Event.kt           # id, type, title, description, startTime, endTime, location, createdBy
    EventType.kt        # id, name, color
    Attendance.kt       # id, eventId, userId, state, updatedAt
    AttendanceState.kt  # enum: ATTENDING, MAYBE, ABSENT, NOT_RESPONDED
  port/
    EventRepository.kt
    AttendanceRepository.kt
    EventTypeRepository.kt
    TeamMemberRepository.kt   # reads platform schema for member list
```

- `EventType` is seeded via migration, read-only
- `Event` is the main aggregate
- `Attendance` is queried independently from `Event` for performance
- No event audience scoping in Phase 2 — all members see all events
- `createdBy` is a UUID referencing platform `users` — no FK across schemas

## Application Layer

```
application/
  EventService.kt
  AttendanceService.kt
```

**EventService:**
- `getUpcomingEvents(since: Instant)` — events with `startTime > since`, default `now - 6h`
- `getAllEvents()` — all events (for "show past" toggle)
- `getEvent(id: UUID)` — single event with attendances
- `createEvent(command)` — creates event + NOT_RESPONDED attendances for all team members
- `updateEvent(id, command)` — update mutable fields
- `deleteEvent(id)` — cascades to attendances via DB

**AttendanceService:**
- `setAttendance(eventId, userId, state)` — upsert
- `getAttendancesForEvent(eventId)` — list with user display names

## API Endpoints (Wirespec)

```
GET    /api/events?include-past=false    -> 200: EventList
POST   /api/events                       -> 201: Event
GET    /api/events/{id}                  -> 200: EventDetail
PUT    /api/events/{id}                  -> 200: Event
DELETE /api/events/{id}                  -> 204

PUT    /api/events/{id}/attendances/{userId}  -> 200: Attendance
GET    /api/event-types                       -> 200: EventTypeList
```

**Query params:** kebab-case (`include-past`).

**List responses wrapped** in top-level object for future pagination:
- `EventList: { events: Event[] }`
- `EventTypeList: { event_types: EventType[] }`

**Response shapes:**
- `Event` — id, type, title, startTime, endTime, location, attendanceSummary (counts per state)
- `EventDetail` — Event + attendances list (userId, displayName, state)
- `Attendance` — id, eventId, userId, displayName, state

**Headers:**
- `X-Team-Id` — tenant resolution (existing)
- `X-User-Id` — acting user identity (new, until Phase 5 auth)

## Infrastructure Layer

```
infrastructure/
  persistence/
    JpaEventRepository.kt
    JpaAttendanceRepository.kt
    JpaEventTypeRepository.kt
    JpaTeamMemberRepository.kt    # reads public schema across tenant boundary
    entity/
      EventJpaEntity.kt
      AttendanceJpaEntity.kt
      EventTypeJpaEntity.kt
      TeamMemberJpaEntity.kt      # maps public.team_members + public.users
    mapper/
      EventMapper.kt
      AttendanceMapper.kt
      EventTypeMapper.kt
```

- JPA entities never leak to domain or interfaces
- `TeamMemberRepository` reads from platform `public` schema with explicit schema qualification
- Mappers are extension functions

## Interfaces Layer

```
interfaces/
  EventController.kt
  AttendanceController.kt
  EventTypeController.kt
  dto/
    EventDto.kt
    AttendanceDto.kt
    CreateEventRequest.kt
    UpdateEventRequest.kt
```

Controllers map between Wirespec-generated types and domain commands. `X-User-Id` extracted per-request.

## Frontend

```
app/src/
  shared/
    api/
      events.ts              # useEvents, useEvent, useCreateEvent, useUpdateEvent, useDeleteEvent
      attendances.ts         # useSetAttendance
      event-types.ts         # useEventTypes
    ui/
      UserSelector.tsx       # Dropdown to pick identity, stored in Zustand + localStorage
  entities/
    event/
      model.ts
      ui/EventCard.tsx       # Event card with attendance summary
  features/
    attendance-toggle/
      ui/AttendanceToggle.tsx   # Three-state toggle (green/gold/red)
    create-event/
      ui/CreateEventDialog.tsx  # Event creation form
  pages/
    events/
      ui/EventListPage.tsx      # Event list + "show past" toggle + create button
      ui/EventDetailPage.tsx    # Event detail with full attendance list
  app/
    App.tsx                     # Add routing
```

**New dependencies:**
- TanStack Router (routing, fits TanStack ecosystem)
- Shadcn UI (form inputs, dialogs, toggles)

**User selector:** persistent dropdown in app header. Zustand store + localStorage. Sends `X-User-Id` header on all API calls.

**Attendance toggle:** three-button group with semantic colors (green=attend, gold=maybe, red=absent). Optimistic updates via TanStack Query.

## Seed Data

Flyway migration seeds per tenant schema:
- 3 event types: Training (green), Match (blue), Other (gold)

Platform schema seed:
- 1 demo team
- 5-6 demo users with display names
- Team memberships linking them

## Identity (pre-auth)

No real auth in Phase 2. Identity handled via:
- Frontend: user selector dropdown, chosen user stored in Zustand + localStorage
- API: `X-User-Id` header on all requests
- Backend: extracted alongside `X-Team-Id` in a filter
