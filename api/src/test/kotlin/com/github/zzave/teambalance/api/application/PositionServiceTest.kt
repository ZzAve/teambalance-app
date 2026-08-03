package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PositionLabelTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

// In-memory positions keyed by id, tagged with their owning team. Also tracks how many times delete
// ran so the "delete clears then removes" contract can be checked without a real DB.
private class PosFakePositionRepo : PositionRepository {
    private data class Row(val teamId: UUID, var label: String)

    private val store: MutableMap<PositionId, Row> = mutableMapOf()

    override fun listByTeam(teamId: UUID): List<Position> =
        store.filterValues { it.teamId == teamId }.map { Position(it.key, it.value.label) }.sortedBy { it.label }
    override fun create(teamId: UUID, label: String): Position {
        val id = PositionId(UUID.randomUUID())
        store[id] = Row(teamId, label)
        return Position(id, label)
    }
    override fun rename(id: PositionId, label: String): Position {
        store.getValue(id).label = label
        return Position(id, label)
    }
    override fun delete(id: PositionId) { store.remove(id) }
    override fun findById(id: PositionId): Position? = store[id]?.let { Position(id, it.label) }
    override fun existsInTeam(teamId: UUID, positionId: PositionId): Boolean = store[positionId]?.teamId == teamId
}

// Reports whichever role was seeded for a (team, user); everyone else is a non-member (null).
private class FakeAdminRepo(private val admins: Set<UUID>) : TeamMemberRepository {
    override fun findRole(teamId: UUID, userId: UUID): Role? = if (userId in admins) Role.ADMIN else Role.USER
    override fun findByTeamId(teamId: UUID): List<TeamMember> = emptyList()
    override fun findDisplayName(userId: UUID): String? = null
    override fun findMembersByUserIds(userIds: Set<UUID>): Map<UUID, TeamMember> = emptyMap()
    override fun findTeamId(userId: UUID): UUID? = null
    override fun addMember(teamId: UUID, userId: UUID) = Unit
    override fun updateRole(teamId: UUID, userId: UUID, role: Role) = Unit
    override fun deactivate(teamId: UUID, userId: UUID) = Unit
    override fun assignPosition(teamId: UUID, userId: UUID, positionId: PositionId?) = Unit
    override fun markOnboarded(teamId: UUID, userId: UUID, at: java.time.Instant) = Unit
    override fun countAdmins(teamId: UUID): Int = admins.size
}

class PositionServiceTest : FunSpec() {
    init {
        val teamId = UUID.randomUUID()
        val adminId = UUID.randomUUID()
        val userId = UUID.randomUUID()

        fun newService(): Pair<PositionService, PosFakePositionRepo> {
            val positions = PosFakePositionRepo()
            val service = PositionService(positions, AuthorizationService(FakeAdminRepo(setOf(adminId))))
            return service to positions
        }

        test("createPosition trims the label and stores it") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "  Setter  ").label shouldBe "Setter"
        }

        test("listPositions returns the team's positions") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "Setter")
            service.createPosition(adminId, teamId, "Libero")
            service.listPositions(teamId).map { it.label } shouldBe listOf("Libero", "Setter")
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
            service.renamePosition(adminId, teamId, created.id, "Playmaker").label shouldBe "Playmaker"
        }

        test("renamePosition to another existing label returns 409") {
            val (service, _) = newService()
            service.createPosition(adminId, teamId, "Setter")
            val libero = service.createPosition(adminId, teamId, "Libero")
            shouldThrow<PositionLabelTakenException> { service.renamePosition(adminId, teamId, libero.id, "Setter") }
        }

        test("renamePosition of an unknown id returns 404") {
            val (service, _) = newService()
            shouldThrow<PositionNotFoundException> { service.renamePosition(adminId, teamId, PositionId(UUID.randomUUID()), "X") }
        }

        test("deletePosition removes the position") {
            val (service, positions) = newService()
            val created = service.createPosition(adminId, teamId, "Setter")
            service.deletePosition(adminId, teamId, created.id)
            positions.findById(created.id) shouldBe null
        }

        test("deletePosition of an unknown id returns 404") {
            val (service, _) = newService()
            shouldThrow<PositionNotFoundException> { service.deletePosition(adminId, teamId, PositionId(UUID.randomUUID())) }
        }

        test("mutations by a non-admin are forbidden") {
            val (service, _) = newService()
            val created = service.createPosition(adminId, teamId, "Setter")
            shouldThrow<NotTeamAdminException> { service.renamePosition(userId, teamId, created.id, "X") }
            shouldThrow<NotTeamAdminException> { service.deletePosition(userId, teamId, created.id) }
        }
    }
}
