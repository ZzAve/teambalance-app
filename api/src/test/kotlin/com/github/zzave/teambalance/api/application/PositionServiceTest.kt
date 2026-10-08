package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PositionLabelTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionKind
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

// In-memory positions keyed by id. No owning-team tag since ADR-0026: the fake stands in for one
// tenant's schema, which is what "this team's positions" now means — a position from another team is
// not a row this repository can see at all, rather than a row it must filter out.
private class PosFakePositionRepo : PositionRepository {
    private val store: MutableMap<PositionId, Position> = mutableMapOf()

    override fun list(): List<Position> = store.values.sortedBy { it.label.value }

    override fun create(label: PositionLabel): Position {
        val id = PositionId(UUID.randomUUID())
        return Position(id, label).also { store[id] = it }
    }

    override fun rename(id: PositionId, label: PositionLabel): Position =
        store.getValue(id).copy(label = label).also { store[id] = it }

    override fun setKind(id: PositionId, kind: PositionKind): Position =
        store.getValue(id).copy(kind = kind).also { store[id] = it }

    override fun delete(id: PositionId) {
        store.remove(id)
    }

    override fun findById(id: PositionId): Position? = store[id]
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
    override fun findMostRecent(limit: Int): List<Event> = error("unused")
    override fun findByRecurringGroup(group: UUID): List<Event> = error("unused")
    override fun save(event: Event): Event = error("unused")
    override fun saveAll(events: List<Event>): List<Event> = error("unused")
    override fun deleteById(id: EventId) = error("unused")
    override fun deleteAllById(ids: List<EventId>) = error("unused")
}

class PositionServiceTest : FunSpec() {
    init {
        val teamId = TeamId(UUID.randomUUID())
        val adminId = UserId.random()
        val userId = UserId.random()

        fun newService(): Triple<PositionService, PosFakePositionRepo, TeamDirectory> {
            val positions = PosFakePositionRepo()
            val directory = TeamDirectory().apply {
                join(adminId, teamId, Role.ADMIN)
                join(userId, teamId, Role.USER)
            }
            val service = PositionService(
                positionRepository = positions,
                eventTypeRepository = CountingEventTypeRepo(),
                eventRepository = CountingEventRepo(),
                teamMemberRepository = directory.teamMemberRepository(),
                authorizationService = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway()),
            )
            return Triple(service, positions, directory)
        }

        test("createPosition trims the label and stores it") {
            val (service, _, _) = newService()
            service.createPosition(TeamScope(adminId, teamId), "  Setter  ").label shouldBe PositionLabel("Setter")
        }

        test("listPositions returns the team's positions") {
            val (service, _, _) = newService()
            service.createPosition(TeamScope(adminId, teamId), "Setter")
            service.createPosition(TeamScope(adminId, teamId), "Libero")
            service.listPositions().map { it.label.value } shouldBe listOf("Libero", "Setter")
        }

        test("createPosition rejects a duplicate label case-insensitively with 409") {
            val (service, _, _) = newService()
            service.createPosition(TeamScope(adminId, teamId), "Setter")
            shouldThrow<PositionLabelTakenException> { service.createPosition(TeamScope(adminId, teamId), "setter") }
        }

        test("createPosition by a non-admin is forbidden") {
            val (service, _, _) = newService()
            shouldThrow<NotTeamAdminException> { service.createPosition(TeamScope(userId, teamId), "Setter") }
        }

        test("renamePosition updates the label") {
            val (service, _, _) = newService()
            val created = service.createPosition(TeamScope(adminId, teamId), "Setter")
            service.renamePosition(TeamScope(adminId, teamId), created.id, "Playmaker").label shouldBe PositionLabel("Playmaker")
        }

        test("renamePosition to another existing label returns 409") {
            val (service, _, _) = newService()
            service.createPosition(TeamScope(adminId, teamId), "Setter")
            val libero = service.createPosition(TeamScope(adminId, teamId), "Libero")
            shouldThrow<PositionLabelTakenException> { service.renamePosition(TeamScope(adminId, teamId), libero.id, "Setter") }
        }

        test("renamePosition of an unknown id returns 404") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.renamePosition(TeamScope(adminId, teamId), PositionId(UUID.randomUUID()), "X")
            }
        }

        test("a new position plays until an admin says otherwise") {
            val (service, _, _) = newService()
            service.createPosition(TeamScope(adminId, teamId), "Setter").kind shouldBe PositionKind.PLAYING
        }

        test("setPositionKind marks a position as staff, and back again") {
            val (service, _, _) = newService()
            val created = service.createPosition(TeamScope(adminId, teamId), "Trainer")

            service.setPositionKind(TeamScope(adminId, teamId), created.id, PositionKind.STAFF).kind shouldBe PositionKind.STAFF
            service.listPositions().single().kind shouldBe PositionKind.STAFF

            service.setPositionKind(TeamScope(adminId, teamId), created.id, PositionKind.PLAYING)
            service.listPositions().single().kind shouldBe PositionKind.PLAYING
        }

        // The kind is not part of a position's identity, so two may share it — unlike the label.
        test("setPositionKind of an unknown id returns 404") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.setPositionKind(TeamScope(adminId, teamId), PositionId(UUID.randomUUID()), PositionKind.STAFF)
            }
        }

        test("renaming a staff position keeps it staff") {
            val (service, _, _) = newService()
            val created = service.createPosition(TeamScope(adminId, teamId), "Trainer")
            service.setPositionKind(TeamScope(adminId, teamId), created.id, PositionKind.STAFF)

            service.renamePosition(TeamScope(adminId, teamId), created.id, "Coach").kind shouldBe PositionKind.STAFF
        }

        test("deletePosition removes the position") {
            val (service, positions, _) = newService()
            val created = service.createPosition(TeamScope(adminId, teamId), "Setter")
            service.deletePosition(TeamScope(adminId, teamId), created.id)
            positions.findById(created.id) shouldBe null
        }

        test("deletePosition of an unknown id returns 404") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.deletePosition(TeamScope(adminId, teamId), PositionId(UUID.randomUUID()))
            }
        }

        // The three numbers the delete confirmation reads out (#219). It is a warning, not a veto,
        // so what matters is that each count comes from its own surface and none is silently zero.
        test("positionUsage reports the type defaults, event overrides and members that name it") {
            val (service, _, directory) = newService()
            val created = service.createPosition(TeamScope(adminId, teamId), "Setter")
            repeat(MEMBERS_ON_POSITION) {
                val member = UserId.random()
                directory.join(member, teamId)
                directory.teamMemberRepository().assignPosition(teamId, member, created.id)
            }

            val usage = service.positionUsage(TeamScope(adminId, teamId), created.id)

            usage.eventTypeCount.value shouldBe TYPE_TARGETS
            usage.eventCount.value shouldBe EVENT_TARGETS
            usage.memberCount.value shouldBe MEMBERS_ON_POSITION
        }

        test("positionUsage of an unknown id returns 404") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.positionUsage(TeamScope(adminId, teamId), PositionId(UUID.randomUUID()))
            }
        }

        test("mutations by a non-admin are forbidden") {
            val (service, _, _) = newService()
            val created = service.createPosition(TeamScope(adminId, teamId), "Setter")
            shouldThrow<NotTeamAdminException> { service.renamePosition(TeamScope(userId, teamId), created.id, "X") }
            shouldThrow<NotTeamAdminException> {
                service.setPositionKind(TeamScope(userId, teamId), created.id, PositionKind.STAFF)
            }
            shouldThrow<NotTeamAdminException> { service.deletePosition(TeamScope(userId, teamId), created.id) }
            shouldThrow<NotTeamAdminException> { service.positionUsage(TeamScope(userId, teamId), created.id) }
        }
    }
}
