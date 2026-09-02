package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PositionLabelTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

// In-memory positions keyed by id. No owning-team tag since ADR-0026: the fake stands in for one
// tenant's schema, which is what "this team's positions" now means — a position from another team is
// not a row this repository can see at all, rather than a row it must filter out.
private class PosFakePositionRepo : PositionRepository {
    private val store: MutableMap<PositionId, PositionLabel> = mutableMapOf()

    override fun list(): List<Position> = store.map { Position(it.key, it.value) }.sortedBy { it.label.value }

    override fun create(label: PositionLabel): Position {
        val id = PositionId(UUID.randomUUID())
        store[id] = label
        return Position(id, label)
    }

    override fun rename(id: PositionId, label: PositionLabel): Position {
        store[id] = label
        return Position(id, label)
    }

    override fun delete(id: PositionId) {
        store.remove(id)
    }

    override fun findById(id: PositionId): Position? = store[id]?.let { Position(id, it) }
    override fun exists(positionId: PositionId): Boolean = store.containsKey(positionId)
}

// Fixed usage counts, so the delete-warning assertions read as the numbers the dialog would show.
// There is deliberately no fake for the delete *cascade* any more: since ADR-0025 the positions and
// the rows naming them share one schema, so clearing them is a foreign key (ON DELETE CASCADE for
// the two target tables, SET NULL for member_profiles), not an ordered sequence of service calls.
// A constraint can only be proven against a real database — RosterRequirementPersistenceIT does it.
private const val TYPE_TARGETS = 2
private const val EVENT_TARGETS = 5
private const val MEMBERS_ON_POSITION = 3

private class CountingEventTypeRepo : EventTypeRepository {
    override fun countTargetsForPosition(positionId: PositionId): Int = TYPE_TARGETS
    override fun findAll(): List<EventType> = error("unused")
    override fun findById(id: EventTypeId): EventType? = error("unused")
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

private class CountingEventRepo : EventRepository {
    override fun countTargetsForPosition(positionId: PositionId): Int = EVENT_TARGETS
    override fun findById(id: EventId): Event? = error("unused")
    override fun findByIds(ids: List<EventId>): List<Event> = error("unused")
    override fun findUpcoming(since: Instant): List<Event> = error("unused")
    override fun findAll(): List<Event> = error("unused")
    override fun findByRecurringGroup(group: UUID): List<Event> = error("unused")
    override fun save(event: Event): Event = error("unused")
    override fun saveAll(events: List<Event>): List<Event> = error("unused")
    override fun deleteById(id: EventId) = error("unused")
    override fun deleteAllById(ids: List<EventId>) = error("unused")
}

// Reports whichever role was seeded for a (team, user); everyone else is a plain member.
private class FakeAdminRepo(private val admins: Set<UserId>) : TeamMemberRepository {
    override fun findRole(teamId: TeamId, userId: UserId): Role? = if (userId in admins) Role.ADMIN else Role.USER
    override fun findByTeamId(teamId: TeamId): List<TeamMember> = emptyList()
    override fun findDisplayName(userId: UserId): DisplayName? = null
    override fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember> = emptyMap()
    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? = null
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? = null
    override fun addMember(teamId: TeamId, userId: UserId, role: Role) = Unit
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
    override fun countByPosition(teamId: TeamId, positionId: PositionId): Int = MEMBERS_ON_POSITION
}

class PositionServiceTest : FunSpec() {
    init {
        val teamId = TeamId(UUID.randomUUID())
        val adminId = UserId.random()
        val userId = UserId.random()

        fun newService(): Pair<PositionService, PosFakePositionRepo> {
            val positions = PosFakePositionRepo()
            val service = PositionService(
                positionRepository = positions,
                eventTypeRepository = CountingEventTypeRepo(),
                eventRepository = CountingEventRepo(),
                teamMemberRepository = FakeAdminRepo(setOf(adminId)),
                authorizationService = AuthorizationService(FakeAdminRepo(setOf(adminId)), FakeActAsGateway()),
            )
            return service to positions
        }

        test("createPosition trims the label and stores it") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "  Setter  ").label shouldBe PositionLabel("Setter")
        }

        test("listPositions returns the team's positions") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "Setter")
            service.createPosition(adminId, teamId, "Libero")
            service.listPositions().map { it.label.value } shouldBe listOf("Libero", "Setter")
        }

        test("createPosition rejects a duplicate label case-insensitively with 409") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "Setter")
            shouldThrow<PositionLabelTakenException> { service.createPosition(adminId, teamId, "setter") }
        }

        test("createPosition by a non-admin is forbidden") {
            val (service, _) = newService()
            shouldThrow<NotTeamAdminException> { service.createPosition(userId, teamId, "Setter") }
        }

        test("renamePosition updates the label") {
            val (service, _) = newService()
            val created = service.createPosition(adminId, teamId, "Setter")
            service.renamePosition(adminId, teamId, created.id, "Playmaker").label shouldBe PositionLabel("Playmaker")
        }

        test("renamePosition to another existing label returns 409") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "Setter")
            val libero = service.createPosition(adminId, teamId, "Libero")
            shouldThrow<PositionLabelTakenException> { service.renamePosition(adminId, teamId, libero.id, "Setter") }
        }

        test("renamePosition of an unknown id returns 404") {
            val (service, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.renamePosition(adminId, teamId, PositionId(UUID.randomUUID()), "X")
            }
        }

        test("deletePosition removes the position") {
            val (service, positions) = newService()
            val created = service.createPosition(adminId, teamId, "Setter")
            service.deletePosition(adminId, teamId, created.id)
            positions.findById(created.id) shouldBe null
        }

        test("deletePosition of an unknown id returns 404") {
            val (service, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.deletePosition(adminId, teamId, PositionId(UUID.randomUUID()))
            }
        }

        // The three numbers the delete confirmation reads out (#219). It is a warning, not a veto,
        // so what matters is that each count comes from its own surface and none is silently zero.
        test("positionUsage reports the type defaults, event overrides and members that name it") {
            val (service, _) = newService()
            val created = service.createPosition(adminId, teamId, "Setter")

            val usage = service.positionUsage(adminId, teamId, created.id)

            usage.eventTypeCount.value shouldBe TYPE_TARGETS
            usage.eventCount.value shouldBe EVENT_TARGETS
            usage.memberCount.value shouldBe MEMBERS_ON_POSITION
        }

        test("positionUsage of an unknown id returns 404") {
            val (service, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.positionUsage(adminId, teamId, PositionId(UUID.randomUUID()))
            }
        }

        test("mutations by a non-admin are forbidden") {
            val (service, _) = newService()
            val created = service.createPosition(adminId, teamId, "Setter")
            shouldThrow<NotTeamAdminException> { service.renamePosition(userId, teamId, created.id, "X") }
            shouldThrow<NotTeamAdminException> { service.deletePosition(userId, teamId, created.id) }
            shouldThrow<NotTeamAdminException> { service.positionUsage(userId, teamId, created.id) }
        }
    }
}
