package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.SubstituteNameTakenException
import com.github.zzave.teambalance.api.domain.exception.SubstituteNotFoundException
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionKind
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.UsageCount
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.util.UUID

// Fixed, so the assertion reads as the number the remove dialog would show.
private const val EVENTS_PER_SUBSTITUTE = 4

// The Team's list only; attendance is proven against real rows in SubstituteIT.
private class FakeSubstituteRepository : SubstituteRepository {
    private val store = linkedMapOf<SubstituteId, Substitute>()

    override fun list(): List<Substitute> = store.values.sortedBy { it.name.value.lowercase() }

    override fun create(name: DisplayName, positionId: PositionId?, createdBy: UserId): Substitute =
        Substitute(SubstituteId(UUID.randomUUID()), name, positionId, position = null).also { store[it.id] = it }

    override fun update(id: SubstituteId, name: DisplayName, positionId: PositionId?): Substitute =
        store.getValue(id).copy(name = name, positionId = positionId).also { store[id] = it }

    override fun delete(id: SubstituteId) {
        store.remove(id)
    }

    override fun exists(id: SubstituteId): Boolean = store.containsKey(id)

    override fun countEvents(id: SubstituteId): Int = EVENTS_PER_SUBSTITUTE

    override fun setAttendance(
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
        changedBy: UserId,
        at: Instant,
    ): SubstituteAttendance? = error("unused")

    override fun removeAttendance(eventId: EventId, substituteId: SubstituteId): Boolean = error("unused")

    override fun findAttendanceByEventIds(eventIds: List<EventId>): Map<EventId, List<SubstituteAttendance>> =
        error("unused")
}

// Only `exists` is read: the service checks a Position id before saving it.
private class NoPositions : PositionRepository {
    override fun exists(positionId: PositionId): Boolean = false
    override fun list(): List<Position> = error("unused")
    override fun create(label: PositionLabel): Position = error("unused")
    override fun rename(id: PositionId, label: PositionLabel): Position = error("unused")
    override fun setKind(id: PositionId, kind: PositionKind): Position = error("unused")
    override fun delete(id: PositionId) = error("unused")
    override fun findById(id: PositionId): Position? = error("unused")
}

class SubstituteServiceTest : FunSpec() {
    init {
        val directory = TeamDirectory()
        val teamId = directory.addTeam("Substitute Team", "substitute-team")
        val adminId = UserId.random().also { directory.join(it, teamId, Role.ADMIN) }
        val memberId = UserId.random().also { directory.join(it, teamId, Role.USER) }

        fun newService() = SubstituteService(
            substituteRepository = FakeSubstituteRepository(),
            positionRepository = NoPositions(),
            authorizationService = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway()),
            clock = Clock.systemUTC(),
        )

        test("an admin renames a substitute, trimmed") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "Jan", positionId = null)

            service.updateSubstitute(adminId, teamId, jan.id, "  Jan B  ", positionId = null).name shouldBe
                DisplayName("Jan B")
            service.listSubstitutes(memberId, teamId).map { it.name.value } shouldBe listOf("Jan B")
        }

        test("a plain member may create a substitute but not rename one") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "Jan", positionId = null)

            shouldThrow<NotTeamAdminException> {
                service.updateSubstitute(memberId, teamId, jan.id, "Jan B", positionId = null)
            }
        }

        test("a rename follows the same name rules as create") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "Jan", positionId = null)

            shouldThrow<IllegalArgumentException> { service.updateSubstitute(adminId, teamId, jan.id, "   ", null) }
            shouldThrow<IllegalArgumentException> {
                service.updateSubstitute(adminId, teamId, jan.id, "x".repeat(101), null)
            }
        }

        // The picker and the settings list tell Substitutes apart by name, so the list keeps names unique.
        test("a name already on the list is refused, whatever its case") {
            val service = newService()
            service.createSubstitute(memberId, teamId, "Jan", positionId = null)
            val sam = service.createSubstitute(memberId, teamId, "Sam", positionId = null)

            shouldThrow<SubstituteNameTakenException> { service.createSubstitute(memberId, teamId, " jan ", null) }
            shouldThrow<SubstituteNameTakenException> { service.updateSubstitute(adminId, teamId, sam.id, "JAN", null) }
        }

        test("a substitute keeps their own name through a rename that only changes its case") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "jan", positionId = null)

            service.updateSubstitute(adminId, teamId, jan.id, "Jan", positionId = null).name shouldBe DisplayName("Jan")
        }

        test("an admin removes a substitute from the list") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "Jan", positionId = null)

            service.deleteSubstitute(adminId, teamId, jan.id)

            service.listSubstitutes(memberId, teamId) shouldBe emptyList()
        }

        test("a plain member cannot remove a substitute") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "Jan", positionId = null)

            shouldThrow<NotTeamAdminException> { service.deleteSubstitute(memberId, teamId, jan.id) }
        }

        test("removing an unknown substitute is not found") {
            shouldThrow<SubstituteNotFoundException> {
                newService().deleteSubstitute(adminId, teamId, SubstituteId(UUID.randomUUID()))
            }
        }

        // Read by the remove dialog only, so it is an Admin read like the removal itself.
        test("an admin reads how many events a substitute is on; a plain member cannot") {
            val service = newService()
            val jan = service.createSubstitute(memberId, teamId, "Jan", positionId = null)

            service.substituteEventCount(adminId, teamId, jan.id) shouldBe UsageCount(EVENTS_PER_SUBSTITUTE)
            shouldThrow<NotTeamAdminException> { service.substituteEventCount(memberId, teamId, jan.id) }
        }

        test("renaming an unknown substitute is not found") {
            shouldThrow<SubstituteNotFoundException> {
                newService().updateSubstitute(adminId, teamId, SubstituteId(UUID.randomUUID()), "Jan", null)
            }
        }
    }
}
