package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CannotChangeOwnRoleException
import com.github.zzave.teambalance.api.domain.exception.LastAdminException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private class FakeMemberUserRepo(users: List<User>) : UserRepository {
    val store = users.associateBy { it.id }.toMutableMap()
    override fun findById(id: UUID): User? = store[id]
    override fun findByEmail(email: String): User? = store.values.firstOrNull { it.email == email }
    override fun save(user: User): User {
        store[user.id] = user
        return user
    }
}

// Reads display names from [userRepo] so a save() is reflected by a later findByTeamId — mirroring the
// JPA adapter, which sources displayName from public.users rather than team_members. Tracks role and
// active state per (teamId, userId) so admin/role/deactivation rules can be exercised in-memory.
private class FakeMembershipRepo(
    private val userRepo: FakeMemberUserRepo,
    seed: Map<UUID, List<Pair<UUID, Role>>>,
) : TeamMemberRepository {
    private data class Membership(var role: Role, var active: Boolean, var positionId: UUID? = null)

    private val store: MutableMap<Pair<UUID, UUID>, Membership> =
        seed.flatMap { (teamId, members) ->
            members.map { (uid, role) -> (teamId to uid) to Membership(role, active = true) }
        }.toMap().toMutableMap()

    override fun findByTeamId(teamId: UUID): List<TeamMember> =
        store.filterKeys { it.first == teamId }
            .filterValues { it.active }
            .mapNotNull { (key, membership) ->
                userRepo.findById(key.second)?.let {
                    TeamMember(
                        userId = it.id,
                        displayName = it.displayName,
                        role = membership.role.name,
                        positionId = membership.positionId,
                        position = null,
                    )
                }
            }

    override fun findDisplayName(userId: UUID): String? = userRepo.findById(userId)?.displayName
    override fun findMembersByUserIds(userIds: Set<UUID>) = emptyMap<UUID, TeamMember>()
    override fun findRole(teamId: UUID, userId: UUID): Role? =
        store[teamId to userId]?.takeIf { it.active }?.role
    override fun findTeamId(userId: UUID): UUID? = null
    override fun addMember(teamId: UUID, userId: UUID) = Unit
    override fun updateRole(teamId: UUID, userId: UUID, role: Role) {
        store[teamId to userId]?.role = role
    }
    override fun deactivate(teamId: UUID, userId: UUID) {
        store[teamId to userId]?.active = false
    }
    override fun assignPosition(teamId: UUID, userId: UUID, positionId: UUID?) {
        store[teamId to userId]?.positionId = positionId
    }
    override fun countAdmins(teamId: UUID): Int =
        store.count { it.key.first == teamId && it.value.active && it.value.role == Role.ADMIN }
}

// Positions keyed by id, each tagged with the team it belongs to so existsInTeam can reject
// a position id that exists but under a different team (the "other team" invalid case).
private class MemberFakePositionRepo(seed: List<Triple<UUID, UUID, String>>) : PositionRepository {
    private data class Row(val teamId: UUID, var label: String)

    private val store: MutableMap<UUID, Row> =
        seed.associate { (id, teamId, label) -> id to Row(teamId, label) }.toMutableMap()

    override fun listByTeam(teamId: UUID): List<Position> =
        store.filterValues { it.teamId == teamId }.map { Position(it.key, it.value.label) }.sortedBy { it.label }
    override fun create(teamId: UUID, label: String): Position {
        val id = UUID.randomUUID()
        store[id] = Row(teamId, label)
        return Position(id, label)
    }
    override fun rename(id: UUID, label: String): Position {
        store.getValue(id).label = label
        return Position(id, label)
    }
    override fun delete(id: UUID) { store.remove(id) }
    override fun findById(id: UUID): Position? = store[id]?.let { Position(id, it.label) }
    override fun existsInTeam(teamId: UUID, positionId: UUID): Boolean =
        store[positionId]?.teamId == teamId
}

class MemberServiceTest : FunSpec() {

    init {
        val teamId = UUID.randomUUID()
        val janId = UUID.randomUUID()
        val lisaId = UUID.randomUUID()

        // A "Setter" position on the team, plus one on a different team to test cross-team rejection.
        val setterPositionId = UUID.randomUUID()
        val otherTeamPositionId = UUID.randomUUID()

        // Jan is the admin, Lisa a regular user — the common admin-acts-on-member fixture.
        fun newService(
            janRole: Role = Role.ADMIN,
            lisaRole: Role = Role.USER,
        ): Triple<MemberService, FakeMemberUserRepo, FakeMembershipRepo> {
            val userRepo = FakeMemberUserRepo(
                listOf(
                    User(id = janId, email = "jan@test.com", displayName = "Jan de Vries"),
                    User(id = lisaId, email = "lisa@test.com", displayName = "Lisa Bakker"),
                ),
            )
            val memberRepo = FakeMembershipRepo(userRepo, mapOf(teamId to listOf(janId to janRole, lisaId to lisaRole)))
            val positionRepo = MemberFakePositionRepo(
                listOf(
                    Triple(setterPositionId, teamId, "Setter"),
                    Triple(otherTeamPositionId, UUID.randomUUID(), "Libero"),
                ),
            )
            return Triple(
                MemberService(userRepo, memberRepo, positionRepo, AuthorizationService(memberRepo)),
                userRepo,
                memberRepo,
            )
        }

        test("getMember returns the team member for the user") {
            val (service, _, _) = newService()
            service.getMember(teamId, janId).displayName shouldBe "Jan de Vries"
        }

        test("getMember throws MemberNotFoundException for a user not on the team") {
            val (service, _, _) = newService()
            shouldThrow<MemberNotFoundException> { service.getMember(teamId, UUID.randomUUID()) }
        }

        test("updateOwnDisplayName trims surrounding whitespace") {
            val (service, userRepo, _) = newService()
            service.updateOwnDisplayName(teamId, janId, "  Jan Janssen  ").displayName shouldBe "Jan Janssen"
            userRepo.findById(janId)?.displayName shouldBe "Jan Janssen"
        }

        test("updateOwnDisplayName rejects a blank name") {
            val (service, _, _) = newService()
            shouldThrow<IllegalArgumentException> { service.updateOwnDisplayName(teamId, janId, "   ") }
        }

        test("updateOwnDisplayName rejects a name longer than 100 characters") {
            val (service, _, _) = newService()
            shouldThrow<IllegalArgumentException> { service.updateOwnDisplayName(teamId, janId, "a".repeat(101)) }
        }

        test("updateOwnDisplayName rejects a name another member already uses (case-insensitive)") {
            val (service, _, _) = newService()
            shouldThrow<NameTakenException> { service.updateOwnDisplayName(teamId, janId, "lisa bakker") }
        }

        test("updateOwnDisplayName allows keeping the user's own current name") {
            val (service, _, _) = newService()
            service.updateOwnDisplayName(teamId, janId, "Jan de Vries").displayName shouldBe "Jan de Vries"
        }

        test("listMembers returns the full team roster") {
            val (service, _, _) = newService()
            service.listMembers(teamId).map { it.displayName }.toSet() shouldBe setOf("Jan de Vries", "Lisa Bakker")
        }

        test("admin updateMember edits another member's name and role") {
            val (service, userRepo, memberRepo) = newService()
            val updated = service.updateMember(janId, teamId, lisaId, "Lisa Nova", Role.ADMIN)
            updated.displayName shouldBe "Lisa Nova"
            updated.role shouldBe "ADMIN"
            userRepo.findById(lisaId)?.displayName shouldBe "Lisa Nova"
            memberRepo.findRole(teamId, lisaId) shouldBe Role.ADMIN
        }

        test("admin promotes a USER to ADMIN") {
            val (service, _, memberRepo) = newService()
            service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.ADMIN)
            memberRepo.findRole(teamId, lisaId) shouldBe Role.ADMIN
        }

        test("admin demotes another ADMIN to USER when another admin remains") {
            val (service, _, memberRepo) = newService(lisaRole = Role.ADMIN)
            service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.USER)
            memberRepo.findRole(teamId, lisaId) shouldBe Role.USER
        }

        test("demoting the last remaining admin throws LastAdminException") {
            val (service, _, _) = newService() // Jan is the only admin
            shouldThrow<LastAdminException> { service.updateMember(janId, teamId, janId, "Jan de Vries", Role.USER) }
        }

        test("a USER cannot self-promote to ADMIN") {
            val (service, _, _) = newService(janRole = Role.USER, lisaRole = Role.ADMIN)
            shouldThrow<CannotChangeOwnRoleException> { service.updateMember(janId, teamId, janId, "Jan de Vries", Role.ADMIN) }
        }

        test("a non-admin cannot edit another member") {
            val (service, _, _) = newService(janRole = Role.USER, lisaRole = Role.ADMIN)
            shouldThrow<NotTeamAdminException> { service.updateMember(janId, teamId, lisaId, "Hijacked", Role.USER) }
        }

        test("updateMember rejects a name another member already uses, excluding the target") {
            val (service, _, _) = newService()
            shouldThrow<NameTakenException> { service.updateMember(janId, teamId, lisaId, "Jan de Vries", Role.USER) }
        }

        test("removeMember deactivates the target so the roster excludes them") {
            val (service, _, _) = newService()
            service.removeMember(janId, teamId, lisaId)
            service.listMembers(teamId).map { it.displayName } shouldBe listOf("Jan de Vries")
        }

        test("removeMember by a non-admin is forbidden") {
            val (service, _, _) = newService(janRole = Role.USER, lisaRole = Role.ADMIN)
            shouldThrow<NotTeamAdminException> { service.removeMember(janId, teamId, lisaId) }
        }

        test("removeMember refuses to remove the last remaining admin") {
            val (service, _, _) = newService() // Jan is the only admin
            shouldThrow<LastAdminException> { service.removeMember(janId, teamId, janId) }
        }

        test("admin updateMember assigns a position that belongs to the team") {
            val (service, _, _) = newService()
            val updated = service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.USER, setterPositionId)
            updated.positionId shouldBe setterPositionId
        }

        test("updateMember with a null positionId clears the assignment") {
            val (service, _, _) = newService()
            service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.USER, setterPositionId)
            val cleared = service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.USER, null)
            cleared.positionId shouldBe null
        }

        test("updateMember rejects a position from another team with PositionNotFoundException") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.USER, otherTeamPositionId)
            }
        }
    }
}
