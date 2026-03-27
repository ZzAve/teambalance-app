# Phase 2 — Core Event Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the core daily interaction: viewing events, toggling attendance, and creating events — giving the app its primary value loop.

**Architecture:** Full hexagonal DDD. Domain entities are plain Kotlin (no framework deps). Repository ports in `application/`, JPA adapters in `infrastructure/`. Wirespec-first API contracts. React frontend with TanStack Router + Query + Shadcn UI.

**Tech Stack:**
- Backend: Kotlin 2.3, Spring Boot 4, JPA/Hibernate, Flyway, Testcontainers
- Contracts: Wirespec 0.14.3
- Frontend: Vite 8, React 19, TanStack Router, TanStack Query, Zustand, Shadcn UI, Tailwind 4
- Testing: JUnit 5 + Testcontainers (backend), Vitest (frontend)

**Package:** `com.github.zzave.teambalance.api`

**Design doc:** `docs/plans/2026-03-21-phase2-core-event-loop-design.md`

---

## Task 1: Seed data — event types and demo team/users

**Files:**
- Create: `api/src/main/resources/db/migration/V002__seed_demo_data.sql`
- Create: `api/src/main/resources/db/tenant-migration/V002__seed_event_types.sql`

**Step 1: Create platform seed migration**

This seeds a demo team and users in the `public` schema so the user selector has data to work with.

```sql
-- V002__seed_demo_data.sql
-- Demo team and users for development. Remove before production.

INSERT INTO teams (id, name, slug, sport, schema_name) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Setpoint VT', 'setpoint-vt', 'Volleyball', 'team_setpoint_vt');

INSERT INTO users (id, email, display_name) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'jan@example.com', 'Jan de Vries'),
    ('b0000000-0000-0000-0000-000000000002', 'lisa@example.com', 'Lisa Bakker'),
    ('b0000000-0000-0000-0000-000000000003', 'tom@example.com', 'Tom Visser'),
    ('b0000000-0000-0000-0000-000000000004', 'emma@example.com', 'Emma Jansen'),
    ('b0000000-0000-0000-0000-000000000005', 'daan@example.com', 'Daan Mulder'),
    ('b0000000-0000-0000-0000-000000000006', 'sophie@example.com', 'Sophie van Dijk');

INSERT INTO team_members (team_id, user_id, role, team_role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ADMIN', 'Setter'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'USER', 'Libero'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'USER', 'Middle'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'USER', 'Outside'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'USER', 'Outside'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'USER', 'Setter');
```

**Step 2: Create tenant seed migration for event types**

```sql
-- V002__seed_event_types.sql
-- Hardcoded event types seeded per tenant schema.

INSERT INTO event_types (id, name, color) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Training', '#249E6C'),
    ('c0000000-0000-0000-0000-000000000002', 'Match', '#225C9C'),
    ('c0000000-0000-0000-0000-000000000003', 'Other', '#F4B400');
```

**Step 3: Verify migrations run**

```bash
./gradlew api:test --tests "*.FlywayMigrationTest"
```

Expected: PASS — Flyway applies both V001 and V002 migrations.

**Step 4: Commit**

```bash
git add api/src/main/resources/db/
git commit -m "feat: seed demo team, users, and event types"
```

---

## Task 2: Domain model — entities, enums, and ports

**Files:**
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/AttendanceState.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/EventType.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/Event.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/Attendance.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/model/TeamMember.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/port/EventRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/port/AttendanceRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/port/EventTypeRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/domain/port/TeamMemberRepository.kt`

**Step 1: Create `AttendanceState` enum**

```kotlin
package com.github.zzave.teambalance.api.domain.model

enum class AttendanceState {
    ATTENDING,
    MAYBE,
    ABSENT,
    NOT_RESPONDED,
}
```

**Step 2: Create `EventType` entity**

```kotlin
package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

data class EventType(
    val id: UUID,
    val name: String,
    val color: String?,
)
```

**Step 3: Create `Event` entity**

```kotlin
package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Event(
    val id: UUID,
    val eventType: EventType,
    val title: String,
    val description: String?,
    val startTime: Instant,
    val endTime: Instant?,
    val location: String?,
    val createdBy: UUID,
    val createdAt: Instant,
)
```

**Step 4: Create `Attendance` entity**

```kotlin
package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Attendance(
    val id: UUID,
    val eventId: UUID,
    val userId: UUID,
    val state: AttendanceState,
    val updatedAt: Instant,
)
```

**Step 5: Create `TeamMember` entity**

```kotlin
package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

data class TeamMember(
    val userId: UUID,
    val displayName: String,
    val role: String,
    val teamRole: String?,
)
```

**Step 6: Create repository ports**

`EventRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Event
import java.time.Instant
import java.util.UUID

interface EventRepository {
    fun findById(id: UUID): Event?
    fun findUpcoming(since: Instant): List<Event>
    fun findAll(): List<Event>
    fun save(event: Event): Event
    fun deleteById(id: UUID)
}
```

`AttendanceRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Attendance
import java.util.UUID

interface AttendanceRepository {
    fun findByEventId(eventId: UUID): List<Attendance>
    fun findByEventIdAndUserId(eventId: UUID, userId: UUID): Attendance?
    fun save(attendance: Attendance): Attendance
    fun saveAll(attendances: List<Attendance>): List<Attendance>
}
```

`EventTypeRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.EventType
import java.util.UUID

interface EventTypeRepository {
    fun findAll(): List<EventType>
    fun findById(id: UUID): EventType?
}
```

`TeamMemberRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.TeamMember
import java.util.UUID

interface TeamMemberRepository {
    fun findByTeamId(teamId: UUID): List<TeamMember>
    fun findDisplayName(userId: UUID): String?
}
```

**Step 7: Verify compilation**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 8: Run ArchUnit tests**

```bash
./gradlew api:test --tests "*.ArchitectureTest"
```

Expected: PASS — domain has no framework dependencies.

**Step 9: Commit**

```bash
git add api/src/main/kotlin/com/github/zzave/teambalance/api/domain/
git commit -m "feat: add domain model (Event, Attendance, EventType) and repository ports"
```

---

## Task 3: Wirespec API contracts

**Files:**
- Create: `api/src/main/wirespec/events.ws`
- Create: `api/src/main/wirespec/attendances.ws`
- Create: `api/src/main/wirespec/event-types.ws`

**Step 1: Create `events.ws`**

```wirespec
type EventTypeSummary {
    id: String,
    name: String,
    color: String?
}

type AttendanceSummary {
    attending: Integer,
    maybe: Integer,
    absent: Integer,
    notResponded: Integer
}

type Event {
    id: String,
    type: EventTypeSummary,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?,
    attendanceSummary: AttendanceSummary
}

type EventDetail {
    id: String,
    type: EventTypeSummary,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?,
    attendanceSummary: AttendanceSummary,
    attendances: AttendanceEntry[]
}

type AttendanceEntry {
    id: String,
    userId: String,
    displayName: String,
    state: String
}

type EventList {
    events: Event[]
}

type CreateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?
}

type UpdateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?
}

endpoint ListEvents GET /api/events ? {include-past: Boolean} -> {
    200 -> EventList
}

endpoint CreateEvent POST CreateEventRequest /api/events -> {
    201 -> Event
}

endpoint GetEvent GET /api/events/{id: String} -> {
    200 -> EventDetail
    404 -> Unit
}

endpoint UpdateEvent PUT UpdateEventRequest /api/events/{id: String} -> {
    200 -> Event
    404 -> Unit
}

endpoint DeleteEvent DELETE /api/events/{id: String} -> {
    204 -> Unit
    404 -> Unit
}
```

**Step 2: Create `attendances.ws`**

```wirespec
type SetAttendanceRequest {
    state: String
}

type Attendance {
    id: String,
    eventId: String,
    userId: String,
    displayName: String,
    state: String
}

endpoint SetAttendance PUT SetAttendanceRequest /api/events/{eventId: String}/attendances/{userId: String} -> {
    200 -> Attendance
    404 -> Unit
}
```

**Step 3: Create `event-types.ws`**

```wirespec
type EventTypeItem {
    id: String,
    name: String,
    color: String?
}

type EventTypeList {
    eventTypes: EventTypeItem[]
}

endpoint ListEventTypes GET /api/event-types -> {
    200 -> EventTypeList
}
```

**Step 4: Generate code**

```bash
./gradlew api:wirespec-kotlin
./gradlew api:wirespec-typescript
```

Expected: BUILD SUCCESSFUL for both.

**Step 5: Verify backend compiles with generated code**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 6: Commit**

```bash
git add api/src/main/wirespec/
git commit -m "feat: add Wirespec contracts for events, attendances, and event types"
```

---

## Task 4: Infrastructure — JPA entities and mappers

**Files:**
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/entity/EventTypeJpaEntity.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/entity/EventJpaEntity.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/entity/AttendanceJpaEntity.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/entity/TeamMemberJpaEntity.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/mapper/EventMapper.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/mapper/AttendanceMapper.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/mapper/EventTypeMapper.kt`

**Step 1: Create JPA entities**

`EventTypeJpaEntity.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "event_types")
class EventTypeJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val name: String = "",
    val color: String? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
)
```

`EventJpaEntity.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "events")
class EventJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_type_id", nullable = false)
    val eventType: EventTypeJpaEntity = EventTypeJpaEntity(),
    @Column(nullable = false)
    val title: String = "",
    val description: String? = null,
    @Column(name = "start_time", nullable = false)
    val startTime: Instant = Instant.now(),
    @Column(name = "end_time")
    val endTime: Instant? = null,
    val location: String? = null,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID = UUID.randomUUID(),
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant = Instant.now(),
)
```

`AttendanceJpaEntity.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "attendances")
class AttendanceJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "event_id", nullable = false)
    val eventId: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false)
    val userId: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val state: String = "NOT_RESPONDED",
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant = Instant.now(),
)
```

`TeamMemberJpaEntity.kt` — reads from platform `public` schema:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "team_members", schema = "public")
class TeamMemberJpaEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(name = "team_id", nullable = false)
    val teamId: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false)
    val userId: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val role: String = "USER",
    @Column(name = "team_role")
    val teamRole: String? = null,
    @Column(nullable = false)
    val active: Boolean = true,
)
```

**Step 2: Create mappers**

`EventTypeMapper.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventTypeJpaEntity.toDomain() = EventType(
    id = id,
    name = name,
    color = color,
)
```

`EventMapper.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity

fun EventJpaEntity.toDomain() = Event(
    id = id,
    eventType = eventType.toDomain(),
    title = title,
    description = description,
    startTime = startTime,
    endTime = endTime,
    location = location,
    createdBy = createdBy,
    createdAt = createdAt,
)

fun Event.toJpaEntity(eventTypeEntity: EventTypeJpaEntity) = EventJpaEntity(
    id = id,
    eventType = eventTypeEntity,
    title = title,
    description = description,
    startTime = startTime,
    endTime = endTime,
    location = location,
    createdBy = createdBy,
    createdAt = createdAt,
)
```

`AttendanceMapper.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity

fun AttendanceJpaEntity.toDomain() = Attendance(
    id = id,
    eventId = eventId,
    userId = userId,
    state = AttendanceState.valueOf(state),
    updatedAt = updatedAt,
)

fun Attendance.toJpaEntity() = AttendanceJpaEntity(
    id = id,
    eventId = eventId,
    userId = userId,
    state = state.name,
    updatedAt = updatedAt,
)
```

**Step 3: Verify compilation**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 4: Run ArchUnit tests**

```bash
./gradlew api:test --tests "*.ArchitectureTest"
```

Expected: PASS — infrastructure depends only on domain, not on interfaces.

**Step 5: Commit**

```bash
git add api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/
git commit -m "feat: add JPA entities and domain mappers for events, attendances, event types"
```

---

## Task 5: Infrastructure — Spring Data repositories

**Files:**
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/SpringDataEventRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/SpringDataAttendanceRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/SpringDataEventTypeRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/SpringDataTeamMemberRepository.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/JpaEventRepositoryAdapter.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/JpaAttendanceRepositoryAdapter.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/JpaEventTypeRepositoryAdapter.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/JpaTeamMemberRepositoryAdapter.kt`

**Step 1: Create Spring Data interfaces**

These are internal to infrastructure — they extend `JpaRepository` and are used by the adapter classes.

`SpringDataEventRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant
import java.util.UUID

interface SpringDataEventRepository : JpaRepository<EventJpaEntity, UUID> {
    fun findByStartTimeGreaterThanOrderByStartTimeAsc(since: Instant): List<EventJpaEntity>
    fun findAllByOrderByStartTimeDesc(): List<EventJpaEntity>
}
```

`SpringDataAttendanceRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataAttendanceRepository : JpaRepository<AttendanceJpaEntity, UUID> {
    fun findByEventId(eventId: UUID): List<AttendanceJpaEntity>
    fun findByEventIdAndUserId(eventId: UUID, userId: UUID): AttendanceJpaEntity?
}
```

`SpringDataEventTypeRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataEventTypeRepository : JpaRepository<EventTypeJpaEntity, UUID>
```

`SpringDataTeamMemberRepository.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.TeamMemberJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface SpringDataTeamMemberRepository : JpaRepository<TeamMemberJpaEntity, UUID> {
    fun findByTeamIdAndActiveTrue(teamId: UUID): List<TeamMemberJpaEntity>

    @Query("SELECT u.display_name FROM public.users u WHERE u.id = :userId", nativeQuery = true)
    fun findDisplayNameByUserId(userId: UUID): String?
}
```

**Step 2: Create adapter classes**

These implement the domain ports and delegate to Spring Data.

`JpaEventRepositoryAdapter.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toDomain
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toJpaEntity
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
class JpaEventRepositoryAdapter(
    private val jpaRepository: SpringDataEventRepository,
    private val eventTypeJpaRepository: SpringDataEventTypeRepository,
) : EventRepository {

    override fun findById(id: UUID): Event? =
        jpaRepository.findById(id).orElse(null)?.toDomain()

    override fun findUpcoming(since: Instant): List<Event> =
        jpaRepository.findByStartTimeGreaterThanOrderByStartTimeAsc(since).map { it.toDomain() }

    override fun findAll(): List<Event> =
        jpaRepository.findAllByOrderByStartTimeDesc().map { it.toDomain() }

    override fun save(event: Event): Event {
        val eventTypeEntity = eventTypeJpaRepository.findById(event.eventType.id)
            .orElseThrow { IllegalArgumentException("EventType not found: ${event.eventType.id}") }
        return jpaRepository.save(event.toJpaEntity(eventTypeEntity)).toDomain()
    }

    override fun deleteById(id: UUID) =
        jpaRepository.deleteById(id)
}
```

`JpaAttendanceRepositoryAdapter.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toDomain
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toJpaEntity
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaAttendanceRepositoryAdapter(
    private val jpaRepository: SpringDataAttendanceRepository,
) : AttendanceRepository {

    override fun findByEventId(eventId: UUID): List<Attendance> =
        jpaRepository.findByEventId(eventId).map { it.toDomain() }

    override fun findByEventIdAndUserId(eventId: UUID, userId: UUID): Attendance? =
        jpaRepository.findByEventIdAndUserId(eventId, userId)?.toDomain()

    override fun save(attendance: Attendance): Attendance =
        jpaRepository.save(attendance.toJpaEntity()).toDomain()

    override fun saveAll(attendances: List<Attendance>): List<Attendance> =
        jpaRepository.saveAll(attendances.map { it.toJpaEntity() }).map { it.toDomain() }
}
```

`JpaEventTypeRepositoryAdapter.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.toDomain
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaEventTypeRepositoryAdapter(
    private val jpaRepository: SpringDataEventTypeRepository,
) : EventTypeRepository {

    override fun findAll(): List<EventType> =
        jpaRepository.findAll().map { it.toDomain() }

    override fun findById(id: UUID): EventType? =
        jpaRepository.findById(id).orElse(null)?.toDomain()
}
```

`JpaTeamMemberRepositoryAdapter.kt`:
```kotlin
package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaTeamMemberRepositoryAdapter(
    private val jpaRepository: SpringDataTeamMemberRepository,
) : TeamMemberRepository {

    override fun findByTeamId(teamId: UUID): List<TeamMember> =
        jpaRepository.findByTeamIdAndActiveTrue(teamId).map { entity ->
            TeamMember(
                userId = entity.userId,
                displayName = jpaRepository.findDisplayNameByUserId(entity.userId) ?: "Unknown",
                role = entity.role,
                teamRole = entity.teamRole,
            )
        }

    override fun findDisplayName(userId: UUID): String? =
        jpaRepository.findDisplayNameByUserId(userId)
}
```

**Step 3: Verify compilation**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 4: Commit**

```bash
git add api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/persistence/
git commit -m "feat: add Spring Data repositories and hexagonal adapter implementations"
```

---

## Task 6: Application layer — services

**Files:**
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/application/EventService.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/application/AttendanceService.kt`

**Step 1: Create `EventService`**

```kotlin
package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.Instant
import java.util.UUID

@Service
@Transactional
class EventService(
    private val eventRepository: EventRepository,
    private val eventTypeRepository: EventTypeRepository,
    private val attendanceRepository: AttendanceRepository,
    private val teamMemberRepository: TeamMemberRepository,
) {
    companion object {
        val GRACE_PERIOD: Duration = Duration.ofHours(6)
    }

    fun getUpcomingEvents(): List<Event> {
        val since = Instant.now().minus(GRACE_PERIOD)
        return eventRepository.findUpcoming(since)
    }

    fun getAllEvents(): List<Event> =
        eventRepository.findAll()

    fun getEvent(id: UUID): Event? =
        eventRepository.findById(id)

    fun createEvent(
        eventTypeId: UUID,
        title: String,
        description: String?,
        startTime: Instant,
        endTime: Instant?,
        location: String?,
        createdBy: UUID,
        teamId: UUID,
    ): Event {
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw IllegalArgumentException("EventType not found: $eventTypeId")

        val event = eventRepository.save(
            Event(
                id = UUID.randomUUID(),
                eventType = eventType,
                title = title,
                description = description,
                startTime = startTime,
                endTime = endTime,
                location = location,
                createdBy = createdBy,
                createdAt = Instant.now(),
            ),
        )

        val members = teamMemberRepository.findByTeamId(teamId)
        val attendances = members.map { member ->
            Attendance(
                id = UUID.randomUUID(),
                eventId = event.id,
                userId = member.userId,
                state = AttendanceState.NOT_RESPONDED,
                updatedAt = Instant.now(),
            )
        }
        attendanceRepository.saveAll(attendances)

        return event
    }

    fun updateEvent(
        id: UUID,
        eventTypeId: UUID,
        title: String,
        description: String?,
        startTime: Instant,
        endTime: Instant?,
        location: String?,
    ): Event? {
        val existing = eventRepository.findById(id) ?: return null
        val eventType = eventTypeRepository.findById(eventTypeId)
            ?: throw IllegalArgumentException("EventType not found: $eventTypeId")

        return eventRepository.save(
            existing.copy(
                eventType = eventType,
                title = title,
                description = description,
                startTime = startTime,
                endTime = endTime,
                location = location,
            ),
        )
    }

    fun deleteEvent(id: UUID): Boolean {
        if (eventRepository.findById(id) == null) return false
        eventRepository.deleteById(id)
        return true
    }
}
```

**Step 2: Create `AttendanceService`**

```kotlin
package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
@Transactional
class AttendanceService(
    private val attendanceRepository: AttendanceRepository,
    private val eventRepository: EventRepository,
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun setAttendance(eventId: UUID, userId: UUID, state: AttendanceState): Attendance? {
        if (eventRepository.findById(eventId) == null) return null

        val existing = attendanceRepository.findByEventIdAndUserId(eventId, userId)
        return if (existing != null) {
            attendanceRepository.save(existing.copy(state = state, updatedAt = Instant.now()))
        } else {
            attendanceRepository.save(
                Attendance(
                    id = UUID.randomUUID(),
                    eventId = eventId,
                    userId = userId,
                    state = state,
                    updatedAt = Instant.now(),
                ),
            )
        }
    }

    fun getAttendancesWithNames(eventId: UUID): List<Pair<Attendance, String>> =
        attendanceRepository.findByEventId(eventId).map { attendance ->
            val name = teamMemberRepository.findDisplayName(attendance.userId) ?: "Unknown"
            attendance to name
        }

    fun getAttendanceSummary(eventId: UUID): Map<AttendanceState, Int> {
        val attendances = attendanceRepository.findByEventId(eventId)
        return AttendanceState.entries.associateWith { state ->
            attendances.count { it.state == state }
        }
    }
}
```

**Step 3: Verify compilation**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 4: Run ArchUnit tests**

```bash
./gradlew api:test --tests "*.ArchitectureTest"
```

Expected: PASS — application depends only on domain, not on infrastructure or interfaces.

**Step 5: Commit**

```bash
git add api/src/main/kotlin/com/github/zzave/teambalance/api/application/
git commit -m "feat: add EventService and AttendanceService use cases"
```

---

## Task 7: User identity filter

**Files:**
- Modify: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/multitenancy/TenantFilter.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/identity/UserContext.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/identity/UserFilter.kt`

**Step 1: Create `UserContext`**

```kotlin
package com.github.zzave.teambalance.api.infrastructure.identity

import java.util.UUID

object UserContext {
    private val current = InheritableThreadLocal<UUID>()

    fun set(userId: UUID) = current.set(userId)
    fun get(): UUID? = current.get()
    fun require(): UUID = current.get() ?: throw IllegalStateException("No user in context")
    fun clear() = current.remove()
}
```

**Step 2: Create `UserFilter`**

```kotlin
package com.github.zzave.teambalance.api.infrastructure.identity

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
class UserFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val userHeader = request.getHeader("X-User-Id")
        if (userHeader != null) {
            UserContext.set(UUID.fromString(userHeader))
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            UserContext.clear()
        }
    }
}
```

**Step 3: Verify compilation**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 4: Commit**

```bash
git add api/src/main/kotlin/com/github/zzave/teambalance/api/infrastructure/identity/
git commit -m "feat: add UserContext and X-User-Id filter for pre-auth identity"
```

---

## Task 8: Interfaces layer — controllers

**Files:**
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/interfaces/EventController.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/interfaces/AttendanceController.kt`
- Create: `api/src/main/kotlin/com/github/zzave/teambalance/api/interfaces/EventTypeController.kt`

**Step 1: Create `EventController`**

```kotlin
package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.infrastructure.identity.UserContext
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
class EventController(
    private val eventService: EventService,
    private val attendanceService: AttendanceService,
) {
    @GetMapping("/api/events")
    fun listEvents(
        @RequestParam(name = "include-past", defaultValue = "false") includePast: Boolean,
    ): ResponseEntity<Map<String, Any>> {
        val events = if (includePast) eventService.getAllEvents() else eventService.getUpcomingEvents()
        val eventDtos = events.map { it.toDto(attendanceService) }
        return ResponseEntity.ok(mapOf("events" to eventDtos))
    }

    @PostMapping("/api/events")
    fun createEvent(@RequestBody request: CreateEventRequest): ResponseEntity<Map<String, Any>> {
        val teamSchema = TenantContext.get()
        val teamId = teamSchema.removePrefix("team_").let { slug ->
            // For now, use the team ID from the header. Phase 5 will resolve from auth.
            UUID.fromString(request.eventTypeId).let { UUID.fromString("a0000000-0000-0000-0000-000000000001") }
        }
        val event = eventService.createEvent(
            eventTypeId = UUID.fromString(request.eventTypeId),
            title = request.title,
            description = request.description,
            startTime = Instant.parse(request.startTime),
            endTime = request.endTime?.let { Instant.parse(it) },
            location = request.location,
            createdBy = UserContext.require(),
            teamId = teamId,
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(event.toDto(attendanceService))
    }

    @GetMapping("/api/events/{id}")
    fun getEvent(@PathVariable id: UUID): ResponseEntity<Map<String, Any>> {
        val event = eventService.getEvent(id) ?: return ResponseEntity.notFound().build()
        val attendances = attendanceService.getAttendancesWithNames(id)
        val summary = attendanceService.getAttendanceSummary(id)

        val dto = event.toDetailDto(attendances, summary)
        return ResponseEntity.ok(dto)
    }

    @PutMapping("/api/events/{id}")
    fun updateEvent(
        @PathVariable id: UUID,
        @RequestBody request: UpdateEventRequest,
    ): ResponseEntity<Map<String, Any>> {
        val event = eventService.updateEvent(
            id = id,
            eventTypeId = UUID.fromString(request.eventTypeId),
            title = request.title,
            description = request.description,
            startTime = Instant.parse(request.startTime),
            endTime = request.endTime?.let { Instant.parse(it) },
            location = request.location,
        ) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(event.toDto(attendanceService))
    }

    @DeleteMapping("/api/events/{id}")
    fun deleteEvent(@PathVariable id: UUID): ResponseEntity<Unit> {
        return if (eventService.deleteEvent(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    data class CreateEventRequest(
        val eventTypeId: String,
        val title: String,
        val description: String?,
        val startTime: String,
        val endTime: String?,
        val location: String?,
    )

    data class UpdateEventRequest(
        val eventTypeId: String,
        val title: String,
        val description: String?,
        val startTime: String,
        val endTime: String?,
        val location: String?,
    )
}

private fun Event.toDto(attendanceService: AttendanceService): Map<String, Any?> {
    val summary = attendanceService.getAttendanceSummary(id)
    return mapOf(
        "id" to id.toString(),
        "type" to mapOf("id" to eventType.id.toString(), "name" to eventType.name, "color" to eventType.color),
        "title" to title,
        "description" to description,
        "startTime" to startTime.toString(),
        "endTime" to endTime?.toString(),
        "location" to location,
        "attendanceSummary" to mapOf(
            "attending" to (summary[AttendanceState.ATTENDING] ?: 0),
            "maybe" to (summary[AttendanceState.MAYBE] ?: 0),
            "absent" to (summary[AttendanceState.ABSENT] ?: 0),
            "notResponded" to (summary[AttendanceState.NOT_RESPONDED] ?: 0),
        ),
    )
}

private fun Event.toDetailDto(
    attendances: List<Pair<com.github.zzave.teambalance.api.domain.model.Attendance, String>>,
    summary: Map<AttendanceState, Int>,
): Map<String, Any?> {
    return mapOf(
        "id" to id.toString(),
        "type" to mapOf("id" to eventType.id.toString(), "name" to eventType.name, "color" to eventType.color),
        "title" to title,
        "description" to description,
        "startTime" to startTime.toString(),
        "endTime" to endTime?.toString(),
        "location" to location,
        "attendanceSummary" to mapOf(
            "attending" to (summary[AttendanceState.ATTENDING] ?: 0),
            "maybe" to (summary[AttendanceState.MAYBE] ?: 0),
            "absent" to (summary[AttendanceState.ABSENT] ?: 0),
            "notResponded" to (summary[AttendanceState.NOT_RESPONDED] ?: 0),
        ),
        "attendances" to attendances.map { (a, name) ->
            mapOf(
                "id" to a.id.toString(),
                "userId" to a.userId.toString(),
                "displayName" to name,
                "state" to a.state.name,
            )
        },
    )
}
```

**Step 2: Create `AttendanceController`**

```kotlin
package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
    private val teamMemberRepository: TeamMemberRepository,
) {
    @PutMapping("/api/events/{eventId}/attendances/{userId}")
    fun setAttendance(
        @PathVariable eventId: UUID,
        @PathVariable userId: UUID,
        @RequestBody request: SetAttendanceRequest,
    ): ResponseEntity<Map<String, Any>> {
        val state = AttendanceState.valueOf(request.state)
        val attendance = attendanceService.setAttendance(eventId, userId, state)
            ?: return ResponseEntity.notFound().build()

        val displayName = teamMemberRepository.findDisplayName(userId) ?: "Unknown"
        return ResponseEntity.ok(
            mapOf(
                "id" to attendance.id.toString(),
                "eventId" to attendance.eventId.toString(),
                "userId" to attendance.userId.toString(),
                "displayName" to displayName,
                "state" to attendance.state.name,
            ),
        )
    }

    data class SetAttendanceRequest(val state: String)
}
```

**Step 3: Create `EventTypeController`**

```kotlin
package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class EventTypeController(
    private val eventTypeRepository: EventTypeRepository,
) {
    @GetMapping("/api/event-types")
    fun listEventTypes(): ResponseEntity<Map<String, Any>> {
        val types = eventTypeRepository.findAll().map { type ->
            mapOf(
                "id" to type.id.toString(),
                "name" to type.name,
                "color" to type.color,
            )
        }
        return ResponseEntity.ok(mapOf("eventTypes" to types))
    }
}
```

**Step 4: Verify compilation**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 5: Commit**

```bash
git add api/src/main/kotlin/com/github/zzave/teambalance/api/interfaces/
git commit -m "feat: add Event, Attendance, and EventType REST controllers"
```

---

## Task 9: Backend integration tests

**Files:**
- Create: `api/src/test/kotlin/com/github/zzave/teambalance/api/interfaces/EventControllerTest.kt`
- Create: `api/src/test/kotlin/com/github/zzave/teambalance/api/TestSupport.kt`

**Step 1: Create test support base class**

Extracts the Testcontainers + DynamicPropertySource boilerplate shared by all integration tests.

```kotlin
package com.github.zzave.teambalance.api

import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@Testcontainers
abstract class TestSupport {
    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:17-alpine")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.data.redis.host") { "localhost" }
            registry.add("spring.data.redis.port") { "6379" }
            registry.add("spring.session.store-type") { "none" }
        }
    }
}
```

**Step 2: Write event controller integration test**

```kotlin
package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TestSupport
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManager
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
class EventControllerTest : TestSupport() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    @BeforeEach
    fun setUp() {
        tenantSchemaManager.provisionTenantSchema("team_setpoint_vt")
    }

    private val teamHeader = "X-Team-Id" to "setpoint_vt"
    private val userHeader = "X-User-Id" to "b0000000-0000-0000-0000-000000000001"

    @Test
    fun `GET api events returns empty list initially`() {
        mockMvc.get("/api/events") {
            header(teamHeader.first, teamHeader.second)
        }.andExpect {
            status { isOk() }
            jsonPath("$.events") { isArray() }
            jsonPath("$.events.length()") { value(0) }
        }
    }

    @Test
    fun `POST api events creates event and returns 201`() {
        mockMvc.post("/api/events") {
            header(teamHeader.first, teamHeader.second)
            header(userHeader.first, userHeader.second)
            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "eventTypeId": "c0000000-0000-0000-0000-000000000001",
                    "title": "Tuesday Training",
                    "description": "Regular training session",
                    "startTime": "2026-04-01T19:00:00Z",
                    "location": "Sports Hall A"
                }
            """.trimIndent()
        }.andExpect {
            status { isCreated() }
            jsonPath("$.title") { value("Tuesday Training") }
            jsonPath("$.type.name") { value("Training") }
            jsonPath("$.attendanceSummary.notResponded") { value(6) }
        }
    }

    @Test
    fun `GET api events returns created events`() {
        // Create an event first
        mockMvc.post("/api/events") {
            header(teamHeader.first, teamHeader.second)
            header(userHeader.first, userHeader.second)
            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "eventTypeId": "c0000000-0000-0000-0000-000000000001",
                    "title": "Future Training",
                    "startTime": "2026-12-01T19:00:00Z"
                }
            """.trimIndent()
        }.andExpect { status { isCreated() } }

        mockMvc.get("/api/events") {
            header(teamHeader.first, teamHeader.second)
        }.andExpect {
            status { isOk() }
            jsonPath("$.events.length()") { value(1) }
            jsonPath("$.events[0].title") { value("Future Training") }
        }
    }

    @Test
    fun `GET api event-types returns seeded types`() {
        mockMvc.get("/api/event-types") {
            header(teamHeader.first, teamHeader.second)
        }.andExpect {
            status { isOk() }
            jsonPath("$.eventTypes.length()") { value(3) }
        }
    }

    @Test
    fun `PUT attendance toggles state`() {
        // Create event
        val result = mockMvc.post("/api/events") {
            header(teamHeader.first, teamHeader.second)
            header(userHeader.first, userHeader.second)
            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "eventTypeId": "c0000000-0000-0000-0000-000000000001",
                    "title": "Attendance Test",
                    "startTime": "2026-12-01T19:00:00Z"
                }
            """.trimIndent()
        }.andReturn()

        val eventId = com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(result.response.contentAsString)["id"].asText()
        val userId = "b0000000-0000-0000-0000-000000000001"

        mockMvc.put("/api/events/$eventId/attendances/$userId") {
            header(teamHeader.first, teamHeader.second)
            contentType = MediaType.APPLICATION_JSON
            content = """{"state": "ATTENDING"}"""
        }.andExpect {
            status { isOk() }
            jsonPath("$.state") { value("ATTENDING") }
            jsonPath("$.displayName") { value("Jan de Vries") }
        }
    }
}
```

**Step 3: Run tests**

```bash
./gradlew api:test
```

Expected: All tests PASS.

**Step 4: Commit**

```bash
git add api/src/test/kotlin/
git commit -m "test: add integration tests for event CRUD and attendance toggle"
```

---

## Task 10: Frontend — TanStack Router + Shadcn UI setup

**Files:**
- Modify: `app/package.json` (add dependencies)
- Modify: `app/vite.config.ts` (add TanStack Router plugin)
- Create: `app/components.json` (Shadcn config)
- Create: `app/src/routes/__root.tsx`
- Create: `app/src/routes/index.tsx`
- Modify: `app/src/app/index.tsx` (use RouterProvider)
- Modify: `app/src/app/styles/global.css` (add Shadcn CSS variables)

**Step 1: Install dependencies**

```bash
cd app
npm install @tanstack/react-router
npm install -D @tanstack/router-plugin @tanstack/react-router-devtools
npx shadcn@latest init -t vite
```

During Shadcn init, select:
- Style: default
- Base color: neutral
- CSS variables: yes
- RSC: no

Customize `components.json` aliases to use `@shared`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/styles/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@shared/components",
    "utils": "@shared/lib/utils",
    "ui": "@shared/ui",
    "lib": "@shared/lib",
    "hooks": "@shared/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Step 2: Add Shadcn components needed for Phase 2**

```bash
npx shadcn@latest add button card dialog select label input
```

**Step 3: Update `vite.config.ts`**

Add `TanStackRouterVite` plugin **before** `react()`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@features': resolve(__dirname, 'src/features'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

**Step 4: Create root route**

`app/src/routes/__root.tsx`:
```tsx
import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { Providers } from '@app/providers'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <Link to="/" className="font-display text-xl font-bold text-blue">
              Team<span className="text-green">Balance</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </Providers>
  )
}
```

**Step 5: Create index route**

`app/src/routes/index.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div>
      <h2 className="text-2xl font-bold">Events</h2>
      <p className="mt-2 text-muted-foreground">Coming soon...</p>
    </div>
  ),
})
```

**Step 6: Update entry point**

Replace `app/src/app/index.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import './styles/global.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

**Step 7: Verify build**

```bash
cd app && npm run build
```

Expected: BUILD SUCCESSFUL

**Step 8: Commit**

```bash
git add app/
git commit -m "feat: add TanStack Router and Shadcn UI to frontend"
```

---

## Task 11: Frontend — API client and hooks

**Files:**
- Create: `app/src/shared/api/client.ts`
- Create: `app/src/shared/api/events.ts`
- Create: `app/src/shared/api/attendances.ts`
- Create: `app/src/shared/api/event-types.ts`
- Create: `app/src/shared/stores/user-store.ts`

**Step 1: Create API client**

`app/src/shared/api/client.ts`:
```typescript
const API_BASE = '/api'

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const teamId = localStorage.getItem('teamId') ?? 'setpoint_vt'
  const userId = localStorage.getItem('userId') ?? ''

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Team-Id': teamId,
      'X-User-Id': userId,
      ...options.headers,
    },
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}
```

**Step 2: Create event hooks**

`app/src/shared/api/events.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './client'

export interface AttendanceSummary {
  attending: number
  maybe: number
  absent: number
  notResponded: number
}

export interface EventType {
  id: string
  name: string
  color: string | null
}

export interface Event {
  id: string
  type: EventType
  title: string
  description: string | null
  startTime: string
  endTime: string | null
  location: string | null
  attendanceSummary: AttendanceSummary
}

export interface AttendanceEntry {
  id: string
  userId: string
  displayName: string
  state: string
}

export interface EventDetail extends Event {
  attendances: AttendanceEntry[]
}

interface EventList {
  events: Event[]
}

export function useEvents(includePast = false) {
  return useQuery({
    queryKey: ['events', { includePast }],
    queryFn: () => apiFetch<EventList>(`/events?include-past=${includePast}`),
    select: (data) => data.events,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => apiFetch<EventDetail>(`/events/${id}`),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (event: {
      eventTypeId: string
      title: string
      description?: string
      startTime: string
      endTime?: string
      location?: string
    }) => apiFetch<Event>('/events', { method: 'POST', body: JSON.stringify(event) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...event }: {
      id: string
      eventTypeId: string
      title: string
      description?: string
      startTime: string
      endTime?: string
      location?: string
    }) => apiFetch<Event>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
```

**Step 3: Create attendance hooks**

`app/src/shared/api/attendances.ts`:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './client'

interface Attendance {
  id: string
  eventId: string
  userId: string
  displayName: string
  state: string
}

export function useSetAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, userId, state }: { eventId: string; userId: string; state: string }) =>
      apiFetch<Attendance>(`/events/${eventId}/attendances/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ state }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] })
    },
  })
}
```

**Step 4: Create event type hooks**

`app/src/shared/api/event-types.ts`:
```typescript
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'

interface EventTypeItem {
  id: string
  name: string
  color: string | null
}

interface EventTypeList {
  eventTypes: EventTypeItem[]
}

export function useEventTypes() {
  return useQuery({
    queryKey: ['event-types'],
    queryFn: () => apiFetch<EventTypeList>('/event-types'),
    select: (data) => data.eventTypes,
    staleTime: Infinity,
  })
}
```

**Step 5: Create user store**

`app/src/shared/stores/user-store.ts`:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  userId: string | null
  displayName: string | null
  setUser: (userId: string, displayName: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      displayName: null,
      setUser: (userId, displayName) => {
        localStorage.setItem('userId', userId)
        set({ userId, displayName })
      },
    }),
    { name: 'teambalance-user' },
  ),
)
```

**Step 6: Verify build**

```bash
cd app && npm run build
```

Expected: BUILD SUCCESSFUL

**Step 7: Commit**

```bash
git add app/src/shared/
git commit -m "feat: add API client hooks and user store"
```

---

## Task 12: Frontend — User selector component

**Files:**
- Create: `app/src/shared/api/members.ts`
- Create: `app/src/shared/ui/UserSelector.tsx`
- Modify: `app/src/routes/__root.tsx` (add UserSelector to header)

**Step 1: Create members API hook**

We need an endpoint to list team members. For now, use a hardcoded list matching our seed data (the real endpoint comes later when we build team management).

`app/src/shared/api/members.ts`:
```typescript
const DEMO_MEMBERS = [
  { userId: 'b0000000-0000-0000-0000-000000000001', displayName: 'Jan de Vries' },
  { userId: 'b0000000-0000-0000-0000-000000000002', displayName: 'Lisa Bakker' },
  { userId: 'b0000000-0000-0000-0000-000000000003', displayName: 'Tom Visser' },
  { userId: 'b0000000-0000-0000-0000-000000000004', displayName: 'Emma Jansen' },
  { userId: 'b0000000-0000-0000-0000-000000000005', displayName: 'Daan Mulder' },
  { userId: 'b0000000-0000-0000-0000-000000000006', displayName: 'Sophie van Dijk' },
]

export function useMembers() {
  return { data: DEMO_MEMBERS, isLoading: false }
}
```

**Step 2: Create UserSelector component**

`app/src/shared/ui/UserSelector.tsx`:
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { useUserStore } from '@shared/stores/user-store'
import { useMembers } from '@shared/api/members'

export function UserSelector() {
  const { userId, setUser } = useUserStore()
  const { data: members } = useMembers()

  return (
    <Select
      value={userId ?? undefined}
      onValueChange={(value) => {
        const member = members?.find((m) => m.userId === value)
        if (member) setUser(member.userId, member.displayName)
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {members?.map((m) => (
          <SelectItem key={m.userId} value={m.userId}>
            {m.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

**Step 3: Add UserSelector to root layout header**

Update the header in `app/src/routes/__root.tsx` to include `<UserSelector />` next to the wordmark.

**Step 4: Verify build**

```bash
cd app && npm run build
```

Expected: BUILD SUCCESSFUL

**Step 5: Commit**

```bash
git add app/
git commit -m "feat: add user selector component for pre-auth identity"
```

---

## Task 13: Frontend — Event list page

**Files:**
- Create: `app/src/entities/event/ui/EventCard.tsx`
- Modify: `app/src/routes/index.tsx` (replace placeholder with event list)

**Step 1: Create EventCard component**

`app/src/entities/event/ui/EventCard.tsx`:
```tsx
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import type { Event } from '@shared/api/events'

export function EventCard({ event }: { event: Event }) {
  const date = new Date(event.startTime)
  const { attendanceSummary: s } = event

  return (
    <Link to="/events/$eventId" params={{ eventId: event.id }}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: event.type.color ?? '#888' }}
            />
            <span className="text-sm text-muted-foreground">{event.type.name}</span>
          </div>
          <CardTitle className="text-lg">{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
            {' '}
            {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {event.location && (
            <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
          )}
          <div className="mt-3 flex gap-3 text-sm">
            <span className="text-green font-medium">{s.attending}</span>
            <span className="text-gold font-medium">{s.maybe}</span>
            <span className="text-red-500 font-medium">{s.absent}</span>
            <span className="text-muted-foreground">{s.notResponded}?</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

**Step 2: Update index route with event list**

Replace `app/src/routes/index.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useEvents } from '@shared/api/events'
import { EventCard } from '@entities/event/ui/EventCard'
import { Button } from '@shared/ui/button'

export const Route = createFileRoute('/')({
  component: EventListPage,
})

function EventListPage() {
  const [includePast, setIncludePast] = useState(false)
  const { data: events, isLoading } = useEvents(includePast)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includePast}
            onChange={(e) => setIncludePast(e.target.checked)}
            className="rounded"
          />
          Show past
        </label>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading...</p>}

      <div className="mt-4 flex flex-col gap-3">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {events?.length === 0 && (
          <p className="text-muted-foreground">No events yet.</p>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Verify build**

```bash
cd app && npm run build
```

Expected: BUILD SUCCESSFUL

**Step 4: Commit**

```bash
git add app/
git commit -m "feat: add event list page with EventCard and show-past toggle"
```

---

## Task 14: Frontend — Event detail page with attendance toggle

**Files:**
- Create: `app/src/routes/events/$eventId.tsx`
- Create: `app/src/features/attendance-toggle/ui/AttendanceToggle.tsx`

**Step 1: Create AttendanceToggle component**

`app/src/features/attendance-toggle/ui/AttendanceToggle.tsx`:
```tsx
import { Button } from '@shared/ui/button'
import { useSetAttendance } from '@shared/api/attendances'

const STATES = [
  { value: 'ATTENDING', label: 'Yes', className: 'bg-green text-white hover:bg-green/90' },
  { value: 'MAYBE', label: 'Maybe', className: 'bg-gold text-white hover:bg-gold/90' },
  { value: 'ABSENT', label: 'No', className: 'bg-red-500 text-white hover:bg-red-500/90' },
] as const

interface AttendanceToggleProps {
  eventId: string
  userId: string
  currentState: string
}

export function AttendanceToggle({ eventId, userId, currentState }: AttendanceToggleProps) {
  const { mutate, isPending } = useSetAttendance()

  return (
    <div className="flex gap-1">
      {STATES.map(({ value, label, className }) => (
        <Button
          key={value}
          size="sm"
          variant={currentState === value ? 'default' : 'outline'}
          className={currentState === value ? className : ''}
          disabled={isPending}
          onClick={() => mutate({ eventId, userId, state: value })}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
```

**Step 2: Create event detail route**

`app/src/routes/events/$eventId.tsx`:
```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEvent } from '@shared/api/events'
import { useUserStore } from '@shared/stores/user-store'
import { AttendanceToggle } from '@features/attendance-toggle/ui/AttendanceToggle'
import { Card, CardContent } from '@shared/ui/card'
import { Button } from '@shared/ui/button'

export const Route = createFileRoute('/events/$eventId')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()
  const { data: event, isLoading } = useEvent(eventId)
  const currentUserId = useUserStore((s) => s.userId)

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  if (!event) return <p>Event not found.</p>

  const date = new Date(event.startTime)

  return (
    <div>
      <Link to="/">
        <Button variant="ghost" size="sm">&larr; Back</Button>
      </Link>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: event.type.color ?? '#888' }}
          />
          <span className="text-sm text-muted-foreground">{event.type.name}</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold">{event.title}</h1>
        <p className="mt-1 text-muted-foreground">
          {date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {' at '}
          {date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </p>
        {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
        {event.description && <p className="mt-2">{event.description}</p>}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <div className="mt-3 flex flex-col gap-2">
          {event.attendances.map((a) => (
            <Card key={a.userId}>
              <CardContent className="flex items-center justify-between py-3">
                <span className={a.userId === currentUserId ? 'font-semibold' : ''}>
                  {a.displayName}
                </span>
                <AttendanceToggle
                  eventId={eventId}
                  userId={a.userId}
                  currentState={a.state}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Verify build**

```bash
cd app && npm run build
```

Expected: BUILD SUCCESSFUL

**Step 4: Commit**

```bash
git add app/
git commit -m "feat: add event detail page with attendance toggle"
```

---

## Task 15: Frontend — Create event dialog

**Files:**
- Create: `app/src/features/create-event/ui/CreateEventDialog.tsx`
- Modify: `app/src/routes/index.tsx` (add create button + dialog)

**Step 1: Create CreateEventDialog**

`app/src/features/create-event/ui/CreateEventDialog.tsx`:
```tsx
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { useCreateEvent } from '@shared/api/events'
import { useEventTypes } from '@shared/api/event-types'

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const { data: eventTypes } = useEventTypes()
  const createEvent = useCreateEvent()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    createEvent.mutate(
      {
        eventTypeId: form.get('eventTypeId') as string,
        title: form.get('title') as string,
        description: (form.get('description') as string) || undefined,
        startTime: new Date(form.get('startTime') as string).toISOString(),
        endTime: form.get('endTime') ? new Date(form.get('endTime') as string).toISOString() : undefined,
        location: (form.get('location') as string) || undefined,
      },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="eventTypeId">Type</Label>
            <Select name="eventTypeId" required>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {eventTypes?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input name="title" required />
          </div>
          <div>
            <Label htmlFor="startTime">Start time</Label>
            <Input name="startTime" type="datetime-local" required />
          </div>
          <div>
            <Label htmlFor="endTime">End time (optional)</Label>
            <Input name="endTime" type="datetime-local" />
          </div>
          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <Input name="location" />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input name="description" />
          </div>
          <Button type="submit" disabled={createEvent.isPending}>
            {createEvent.isPending ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Add CreateEventDialog to event list page**

In `app/src/routes/index.tsx`, import and add `<CreateEventDialog />` next to the "Events" heading.

**Step 3: Verify build**

```bash
cd app && npm run build
```

Expected: BUILD SUCCESSFUL

**Step 4: Commit**

```bash
git add app/
git commit -m "feat: add create event dialog with form"
```

---

## Task 16: Smoke test — full stack verification

**Step 1: Run all backend tests**

```bash
./gradlew api:test
```

Expected: All tests PASS.

**Step 2: Run detekt**

```bash
./gradlew api:detekt
```

Expected: BUILD SUCCESSFUL.

**Step 3: Run frontend build + lint + typecheck**

```bash
cd app && npm run build && npm run lint && npm run typecheck
```

Expected: All pass.

**Step 4: Manual verification**

Start the full stack:

```bash
make run-local
```

1. Open http://localhost:5173
2. Select a user from the dropdown
3. Create an event using the "New Event" button
4. Verify event appears in the list with attendance summary (6 NOT_RESPONDED)
5. Click the event to see detail page
6. Toggle attendance for a user — verify the button state changes
7. Go back to event list — verify attendance summary updated
8. Toggle "Show past" checkbox — verify past events appear/disappear

**Step 5: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: smoke test fixes"
```

---

## Summary

| Task | What it delivers |
|------|-----------------|
| 1 | Seed data (demo team, users, event types) |
| 2 | Domain model (Event, Attendance, EventType, ports) |
| 3 | Wirespec API contracts (7 endpoints) |
| 4 | JPA entities + domain mappers |
| 5 | Spring Data repositories + hexagonal adapters |
| 6 | EventService + AttendanceService use cases |
| 7 | X-User-Id identity filter |
| 8 | REST controllers (Event, Attendance, EventType) |
| 9 | Backend integration tests |
| 10 | TanStack Router + Shadcn UI setup |
| 11 | API client hooks + user store |
| 12 | User selector component |
| 13 | Event list page with EventCard |
| 14 | Event detail page with attendance toggle |
| 15 | Create event dialog |
| 16 | Full stack smoke test |

---

## Follow-up items (out of scope for this phase)

- [ ] **Value classes for domain IDs** — Introduce `AttendanceId`, `EventId`, `UserId`, `EventTypeId`, `TeamId` etc. as `@JvmInline value class` wrappers around `UUID`. Eliminates argument-ordering bugs (e.g. `Attendance(id, eventId, userId, ...)` where all three are `UUID`). Apply across domain, application, persistence, and interface layers.
- [x] **Dual ID pattern on all JPA entities** — ~~`EventTypeJpaEntity` and `AttendanceJpaEntity` should follow the same internal `Long` PK + external `UUID` pattern already used by `EventJpaEntity`.~~ Done in `315f2bc`.
- [x] **Domain exception hierarchy** — ~~Replace `IllegalArgumentException` / `IllegalStateException` with a sealed `TeambalanceException` hierarchy.~~ Done in `246d4c2`. Sealed hierarchy: `TeambalanceException` → `NotFoundException` → `EventNotFoundException` / `EventTypeNotFoundException` / `AttendanceNotFoundException`.
- [x] **Remove default values from JPA entity fields** — ~~Only `@Id val id: Long = 0` should have a default.~~ Done in `246d4c2`.
- [ ] **CI pipeline** — GitHub Actions workflow to validate build + tests on every push/PR. See dedicated section below.

---

## CI Pipeline

**Goal:** Introduce a minimal GitHub Actions workflow that validates the app builds and tests pass on every push and PR.

**File:** `.github/workflows/ci.yml`

**What it should do:**
1. Trigger on push to `main` and on all PRs
2. Set up JDK 25 (matching the project), Node 22
3. Start infrastructure via Docker Compose (Postgres + Redis for Testcontainers)
4. Run `make build` (compiles everything, runs detekt/eslint, runs all tests, builds frontend)
5. Cache Gradle and npm dependencies for speed

**Considerations:**
- Testcontainers needs Docker-in-Docker or a Docker socket — GitHub-hosted runners have Docker available
- The `make build` target already runs linting + tests + compilation, so a single command suffices
- Keep it simple: one job, one workflow. Split into matrix/parallel jobs only when build times warrant it
- Consider adding a `make test` step with test result reporting via `dorny/test-reporter` or similar
