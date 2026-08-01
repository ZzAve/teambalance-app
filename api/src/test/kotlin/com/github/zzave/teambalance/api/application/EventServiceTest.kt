package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventSeriesScope
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.Recurrence
import com.github.zzave.teambalance.api.domain.model.RecurrenceFrequency
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TransactionRunnerPort
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import java.time.Clock
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneOffset
import java.util.UUID

// The write use cases are admin-guarded in the service now (uniform write-authorization seam), so a
// non-admin caller must be rejected *before* any repository work — these fakes therefore fail loudly
// if touched, proving the guard short-circuits rather than the call merely erroring downstream.
private class ExplodingEventRepo : EventRepository {
    override fun findById(id: UUID): Event? = error("repository must not be reached for an unauthorized caller")
    override fun findUpcoming(since: Instant): List<Event> = error("unused")
    override fun findAll(): List<Event> = error("unused")
    override fun findByRecurringGroup(group: UUID): List<Event> = error("unused")
    override fun save(event: Event): Event = error("unused")
    override fun deleteById(id: UUID) = error("unused")
}

private class ExplodingEventTypeRepo : EventTypeRepository {
    override fun findAll(): List<EventType> = error("unused")
    override fun findById(id: UUID): EventType? = error("repository must not be reached for an unauthorized caller")
}

private class ExplodingSeasonRepo : SeasonRepository {
    override fun get() = error("unused")
    override fun save(season: com.github.zzave.teambalance.api.domain.model.Season) = error("unused")
}

// No transaction to run in a pure unit test — just run the block. That the boundary is real in
// production is proven at the REST seam by EventTransactionBoundaryIT.
private class DirectTransactionRunner : TransactionRunnerPort {
    override fun <T> inTransaction(block: () -> T): T = block()
}

// USER for everyone except the seeded admins — models "a real member who simply isn't an admin".
private class EventFakeMemberRepo(private val admins: Set<UUID>) : TeamMemberRepository {
    override fun findRole(teamId: UUID, userId: UUID): Role = if (userId in admins) Role.ADMIN else Role.USER
    override fun findByTeamId(teamId: UUID): List<TeamMember> = emptyList()
    override fun findDisplayName(userId: UUID): String? = null
    override fun findMembersByUserIds(userIds: Set<UUID>): Map<UUID, TeamMember> = emptyMap()
    override fun findTeamId(userId: UUID): UUID? = null
    override fun addMember(teamId: UUID, userId: UUID) = Unit
    override fun updateRole(teamId: UUID, userId: UUID, role: Role) = Unit
    override fun deactivate(teamId: UUID, userId: UUID) = Unit
    override fun assignPosition(teamId: UUID, userId: UUID, positionId: UUID?) = Unit
    override fun markOnboarded(teamId: UUID, userId: UUID, at: Instant) = Unit
    override fun countAdmins(teamId: UUID): Int = admins.size
}

class EventServiceTest : FunSpec() {
    init {
        val teamId = UUID.randomUUID()
        val nonAdmin = UUID.randomUUID()

        val service = EventService(
            ExplodingEventRepo(),
            ExplodingEventTypeRepo(),
            ExplodingSeasonRepo(),
            AuthorizationService(EventFakeMemberRepo(admins = emptySet())),
            DirectTransactionRunner(),
            Clock.fixed(Instant.EPOCH, ZoneOffset.UTC),
        )

        val potential = PotentialEvent(
            eventTypeId = UUID.randomUUID(),
            title = "Match",
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
                    id = UUID.randomUUID(),
                    scope = EventSeriesScope.THIS,
                    eventTypeId = UUID.randomUUID(),
                    title = "x",
                    description = null,
                    startTime = potential.startTime,
                    endTime = potential.endTime,
                    location = null,
                )
            }
        }

        test("deleteEvent by a non-admin is rejected before any repository access") {
            shouldThrow<NotTeamAdminException> {
                service.deleteEvent(nonAdmin, teamId, UUID.randomUUID(), EventSeriesScope.THIS)
            }
        }

        test("createRecurringEvents by a non-admin is rejected before any repository access") {
            shouldThrow<NotTeamAdminException> {
                service.createRecurringEvents(
                    callerId = nonAdmin,
                    teamId = teamId,
                    eventTypeId = UUID.randomUUID(),
                    title = "Training",
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
