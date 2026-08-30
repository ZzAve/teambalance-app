package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventSeriesScope
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Recurrence
import com.github.zzave.teambalance.api.domain.model.RecurrenceFrequency
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import java.time.Clock
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneOffset
import com.github.zzave.teambalance.api.domain.model.EventId
import java.util.UUID

// The write use cases are admin-guarded in the service now (uniform write-authorization seam), so a
// non-admin caller must be rejected *before* any repository work — these fakes therefore fail loudly
// if touched, proving the guard short-circuits rather than the call merely erroring downstream.
private class ExplodingEventRepo : EventRepository {
    override fun findById(id: EventId): Event? = error("repository must not be reached for an unauthorized caller")
    override fun findByIds(ids: List<EventId>): List<Event> = error("unused")
    override fun findUpcoming(since: Instant): List<Event> = error("unused")
    override fun findAll(): List<Event> = error("unused")
    override fun findByRecurringGroup(group: UUID): List<Event> = error("unused")
    override fun save(event: Event): Event = error("unused")
    override fun saveAll(events: List<Event>): List<Event> = error("unused")
    override fun deleteById(id: EventId) = error("unused")
    override fun deleteAllById(ids: List<EventId>) = error("unused")
    override fun countTargetsForPosition(positionId: PositionId): Int = error("unused")
}

private class ExplodingEventTypeRepo : EventTypeRepository {
    override fun findAll(): List<EventType> = error("unused")
    override fun findById(id: EventTypeId): EventType? = error("repository must not be reached for an unauthorized caller")
    override fun countTargetsForPosition(positionId: PositionId): Int = error("unused")
    override fun countEventsOfType(id: EventTypeId): Int = error("unused")
    override fun create(name: EventTypeName, color: HexColor?, rosterDefault: RosterRequirement): EventType =
        error("unused")
    override fun update(
        id: EventTypeId,
        name: EventTypeName,
        color: HexColor?,
        rosterDefault: RosterRequirement,
    ): EventType = error("unused")
    override fun archive(id: EventTypeId, migrateEventsTo: EventTypeId?): EventType = error("unused")
    override fun unarchive(id: EventTypeId): EventType = error("unused")
}

private class ExplodingPositionRepo : PositionRepository {
    override fun list(): List<Position> = error("unused")
    override fun create(label: PositionLabel): Position = error("unused")
    override fun rename(id: PositionId, label: PositionLabel): Position = error("unused")
    override fun delete(id: PositionId) = error("unused")
    override fun findById(id: PositionId): Position? = error("unused")
    override fun exists(positionId: PositionId): Boolean = error("unused")
}

private class ExplodingSeasonRepo : SeasonRepository {
    override fun get() = error("unused")
    override fun save(season: com.github.zzave.teambalance.api.domain.model.Season) = error("unused")
}

// USER for everyone except the seeded admins — models "a real member who simply isn't an admin".
private class EventFakeMemberRepo(private val admins: Set<UserId>) : TeamMemberRepository {
    override fun findRole(teamId: TeamId, userId: UserId): Role = if (userId in admins) Role.ADMIN else Role.USER
    override fun findByTeamId(teamId: TeamId): List<TeamMember> = emptyList()
    override fun findDisplayName(userId: UserId): DisplayName? = null
    override fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember> = emptyMap()
    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? = null
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? = null
    override fun addMember(teamId: TeamId, userId: UserId) = Unit
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) = Unit
    override fun deactivate(teamId: TeamId, userId: UserId) = Unit
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) = Unit
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: Instant?,
    ) = Unit
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant) = Unit
    override fun countAdmins(teamId: TeamId): Int = admins.size
    override fun countByPosition(teamId: TeamId, positionId: PositionId): Int = 0
}

class EventServiceTest : FunSpec() {
    init {
        val teamId = TeamId(UUID.randomUUID())
        val nonAdmin = UserId.random()

        val service = EventService(
            ExplodingEventRepo(),
            ExplodingEventTypeRepo(),
            ExplodingSeasonRepo(),
            ExplodingPositionRepo(),
            AuthorizationService(EventFakeMemberRepo(admins = emptySet()), FakeActAsGateway()),
            Clock.fixed(Instant.EPOCH, ZoneOffset.UTC),
        )

        val potential = PotentialEvent(
            eventTypeId = EventTypeId(UUID.randomUUID()),
            title = EventTitle("Match"),
            description = null,
            startTime = Instant.parse("2026-08-01T20:00:00Z"),
            endTime = Instant.parse("2026-08-01T22:00:00Z"),
            location = null,
        )

        test("createEvent by a non-admin is rejected before any repository access") {
            shouldThrow<NotTeamAdminException> { service.createEvent(nonAdmin, teamId, potential) }
        }

        test("updateEvent by a non-admin is rejected before any repository access") {
            shouldThrow<NotTeamAdminException> {
                service.updateEvent(
                    callerId = nonAdmin,
                    teamId = teamId,
                    id = EventId(UUID.randomUUID()),
                    scope = EventSeriesScope.THIS,
                    eventTypeId = EventTypeId(UUID.randomUUID()),
                    title = EventTitle("x"),
                    description = null,
                    startTime = potential.startTime,
                    endTime = potential.endTime,
                    location = null,
                )
            }
        }

        test("deleteEvent by a non-admin is rejected before any repository access") {
            shouldThrow<NotTeamAdminException> {
                service.deleteEvent(nonAdmin, teamId, EventId(UUID.randomUUID()), EventSeriesScope.THIS)
            }
        }

        test("createRecurringEvents by a non-admin is rejected before any repository access") {
            shouldThrow<NotTeamAdminException> {
                service.createRecurringEvents(
                    callerId = nonAdmin,
                    teamId = teamId,
                    eventTypeId = EventTypeId(UUID.randomUUID()),
                    title = EventTitle("Training"),
                    description = null,
                    location = null,
                    timeOfDay = LocalTime.of(20, 0),
                    durationMinutes = 90,
                    references = emptyList(),
                    recurrence = Recurrence(
                        frequency = RecurrenceFrequency.WEEKLY,
                        weekdays = setOf(DayOfWeek.TUESDAY),
                        startDate = LocalDate.of(2026, 8, 1),
                        endDate = LocalDate.of(2026, 8, 31),
                    ),
                )
            }
        }
    }
}
