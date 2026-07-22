package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.User
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
// JPA adapter, which sources displayName from public.users rather than team_members.
private class FakeMembershipRepo(
    private val userRepo: FakeMemberUserRepo,
    private val membersByTeam: Map<UUID, List<UUID>>,
) : TeamMemberRepository {
    override fun findByTeamId(teamId: UUID): List<TeamMember> =
        (membersByTeam[teamId] ?: emptyList()).mapNotNull { uid ->
            userRepo.findById(uid)?.let { TeamMember(userId = it.id, displayName = it.displayName, role = "USER", teamRole = null) }
        }

    override fun findDisplayName(userId: UUID): String? = userRepo.findById(userId)?.displayName
    override fun findMembersByUserIds(userIds: Set<UUID>) = emptyMap<UUID, TeamMember>()
    override fun findRole(teamId: UUID, userId: UUID): Role? = null
    override fun findTeamId(userId: UUID): UUID? = null
    override fun addMember(teamId: UUID, userId: UUID) = Unit
}

class MemberServiceTest : FunSpec() {

    init {
        val teamId = UUID.randomUUID()
        val janId = UUID.randomUUID()
        val lisaId = UUID.randomUUID()

        fun newService(): Pair<MemberService, FakeMemberUserRepo> {
            val userRepo = FakeMemberUserRepo(
                listOf(
                    User(id = janId, email = "jan@test.com", displayName = "Jan de Vries"),
                    User(id = lisaId, email = "lisa@test.com", displayName = "Lisa Bakker"),
                ),
            )
            val memberRepo = FakeMembershipRepo(userRepo, mapOf(teamId to listOf(janId, lisaId)))
            return MemberService(userRepo, memberRepo) to userRepo
        }

        test("getMember returns the team member for the user") {
            val (service, _) = newService()
            service.getMember(teamId, janId).displayName shouldBe "Jan de Vries"
        }

        test("getMember throws MemberNotFoundException for a user not on the team") {
            val (service, _) = newService()
            shouldThrow<MemberNotFoundException> { service.getMember(teamId, UUID.randomUUID()) }
        }

        test("updateOwnDisplayName trims surrounding whitespace") {
            val (service, userRepo) = newService()
            service.updateOwnDisplayName(teamId, janId, "  Jan Janssen  ").displayName shouldBe "Jan Janssen"
            userRepo.findById(janId)?.displayName shouldBe "Jan Janssen"
        }

        test("updateOwnDisplayName rejects a blank name") {
            val (service, _) = newService()
            shouldThrow<IllegalArgumentException> { service.updateOwnDisplayName(teamId, janId, "   ") }
        }

        test("updateOwnDisplayName rejects a name longer than 100 characters") {
            val (service, _) = newService()
            shouldThrow<IllegalArgumentException> { service.updateOwnDisplayName(teamId, janId, "a".repeat(101)) }
        }

        test("updateOwnDisplayName rejects a name another member already uses (case-insensitive)") {
            val (service, _) = newService()
            shouldThrow<NameTakenException> { service.updateOwnDisplayName(teamId, janId, "lisa bakker") }
        }

        test("updateOwnDisplayName allows keeping the user's own current name") {
            val (service, _) = newService()
            service.updateOwnDisplayName(teamId, janId, "Jan de Vries").displayName shouldBe "Jan de Vries"
        }

        test("updateOwnDisplayName persists the change via save") {
            val (service, userRepo) = newService()
            service.updateOwnDisplayName(teamId, janId, "Jan New")
            userRepo.findById(janId)?.displayName shouldBe "Jan New"
            service.getMember(teamId, janId).displayName shouldBe "Jan New"
        }
    }
}
