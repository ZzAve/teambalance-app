package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CannotChangeOwnRoleException
import com.github.zzave.teambalance.api.domain.exception.LastAdminException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private class FakeMemberUserRepo(users: List<User>) : UserRepository {
    val store = users.associateBy { it.id }.toMutableMap()
    override fun findById(id: UserId): User? = store[id]
    override fun findByEmail(email: Email): User? = store.values.firstOrNull { it.email == email }
    override fun save(user: User): User {
        store[user.id] = user
        return user
    }
    override fun findLastActiveTeamId(userId: UserId): TeamId? = null
    override fun rememberActiveTeam(userId: UserId, teamId: TeamId) = Unit
}

// Reads display names from [userRepo] so a save() is reflected by a later findByTeamId — mirroring the
// JPA adapter, which sources displayName from public.users rather than team_members. Tracks role and
// active state per (teamId, userId) so admin/role/deactivation rules can be exercised in-memory.
private class FakeMembershipRepo(
    private val userRepo: FakeMemberUserRepo,
    seed: Map<TeamId, List<Pair<UserId, Role>>>,
) : TeamMemberRepository {
    private data class Membership(
        var role: Role,
        var active: Boolean,
        var positionId: PositionId? = null,
        var onboarded: Boolean = false,
    )

    private val store: MutableMap<Pair<TeamId, UserId>, Membership> =
        seed.flatMap { (teamId, members) ->
            members.map { (uid, role) -> (teamId to uid) to Membership(role, active = true) }
        }.toMap().toMutableMap()

    override fun findByTeamId(teamId: TeamId): List<TeamMember> =
        store.filterKeys { it.first == teamId }
            .filterValues { it.active }
            .mapNotNull { (key, membership) ->
                userRepo.findById(key.second)?.let {
                    TeamMember(
                        userId = it.id,
                        displayName = it.displayName,
                        permission = membership.role,
                        positionId = membership.positionId,
                        position = null,
                        onboarded = membership.onboarded,
                    )
                }
            }

    override fun findDisplayName(userId: UserId): DisplayName? = userRepo.findById(userId)?.displayName
    override fun findMembersByUserIds(userIds: Set<UserId>) = emptyMap<UserId, TeamMember>()
    override fun findRole(teamId: TeamId, userId: UserId): Role? =
        store[teamId to userId]?.takeIf { it.active }?.role
    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? = null
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? = null
    override fun addMember(teamId: TeamId, userId: UserId) = Unit
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) {
        store[teamId to userId]?.role = role
    }
    override fun deactivate(teamId: TeamId, userId: UserId) {
        store[teamId to userId]?.active = false
    }
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) {
        store[teamId to userId]?.positionId = positionId
    }
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: java.time.Instant) {
        store[teamId to userId]?.onboarded = true
    }
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: java.time.Instant?,
    ) {
        userRepo.findById(userId)?.let { userRepo.save(it.copy(displayName = displayName)) }
        store[teamId to userId]?.apply {
            this.role = role
            this.positionId = positionId
            if (markOnboardedAt != null) onboarded = true
        }
    }
    override fun countAdmins(teamId: TeamId): Int =
        store.count { it.key.first == teamId && it.value.active && it.value.role == Role.ADMIN }

    override fun countByPosition(teamId: TeamId, positionId: PositionId): Int =
        store.count { it.value.active && it.value.positionId == positionId }
}

// Positions of ONE tenant, keyed by id. Since ADR-0026 the schema scopes them, so "a position of
// another team" is simply an id this repository does not hold — the same rejection path as an id
// that never existed, which is why the fake no longer tracks an owning team.
private class MemberFakePositionRepo(seed: List<Pair<PositionId, String>>) : PositionRepository {
    private val store: MutableMap<PositionId, PositionLabel> =
        seed.associate { (id, label) -> id to PositionLabel(label) }.toMutableMap()

    override fun list(): List<Position> =
        store.map { Position(it.key, it.value) }.sortedBy { it.label.value }
    override fun create(label: PositionLabel): Position {
        val id = PositionId(UUID.randomUUID())
        store[id] = label
        return Position(id, label)
    }
    override fun rename(id: PositionId, label: PositionLabel): Position {
        store[id] = label
        return Position(id, label)
    }
    override fun delete(id: PositionId) { store.remove(id) }
    override fun findById(id: PositionId): Position? = store[id]?.let { Position(id, it) }
    override fun exists(positionId: PositionId): Boolean = store.containsKey(positionId)
}

class MemberServiceTest : FunSpec() {

    init {
        val teamId = TeamId(UUID.randomUUID())
        val janId = UserId.random()
        val lisaId = UserId.random()

        // A "Setter" position on the team, plus one on a different team to test cross-team rejection.
        val setterPositionId = PositionId(UUID.randomUUID())
        // Not seeded into the repo: since ADR-0026 an id belonging to another team and an id that
        // never existed are indistinguishable here, because the tenant schema — not a predicate —
        // decides what this repository can see.
        val foreignPositionId = PositionId(UUID.randomUUID())

        val fixedClock = java.time.Clock.fixed(java.time.Instant.parse("2026-07-22T10:00:00Z"), java.time.ZoneOffset.UTC)

        // Jan is the admin, Lisa a regular user — the common admin-acts-on-member fixture.
        fun newService(
            janRole: Role = Role.ADMIN,
            lisaRole: Role = Role.USER,
        ): Triple<MemberService, FakeMemberUserRepo, FakeMembershipRepo> {
            val userRepo = FakeMemberUserRepo(
                listOf(
                    User(id = janId, email = Email("jan@test.com"), displayName = DisplayName("Jan de Vries")),
                    User(id = lisaId, email = Email("lisa@test.com"), displayName = DisplayName("Lisa Bakker")),
                ),
            )
            val memberRepo = FakeMembershipRepo(userRepo, mapOf(teamId to listOf(janId to janRole, lisaId to lisaRole)))
            val positionRepo = MemberFakePositionRepo(listOf(setterPositionId to "Setter"))
            return Triple(
                MemberService(userRepo, memberRepo, positionRepo, AuthorizationService(memberRepo, FakeActAsGateway()), fixedClock),
                userRepo,
                memberRepo,
            )
        }

        test("getMember returns the team member for the user") {
            val (service, _, _) = newService()
            service.getMember(teamId, janId).displayName shouldBe DisplayName("Jan de Vries")
        }

        test("getMember throws MemberNotFoundException for a user not on the team") {
            val (service, _, _) = newService()
            shouldThrow<MemberNotFoundException> { service.getMember(teamId, UserId.random()) }
        }

        test("updateOwnDisplayName trims surrounding whitespace") {
            val (service, userRepo, _) = newService()
            service.updateOwnDisplayName(teamId, janId, "  Jan Janssen  ").displayName shouldBe DisplayName("Jan Janssen")
            userRepo.findById(janId)?.displayName shouldBe DisplayName("Jan Janssen")
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
            service.updateOwnDisplayName(teamId, janId, "Jan de Vries").displayName shouldBe DisplayName("Jan de Vries")
        }

        test("listMembers returns the full team roster") {
            val (service, _, _) = newService()
            service.listMembers(teamId).map { it.displayName }.toSet() shouldBe
                setOf(DisplayName("Jan de Vries"), DisplayName("Lisa Bakker"))
        }

        test("admin updateMember edits another member's name and role") {
            val (service, userRepo, memberRepo) = newService()
            val updated = service.updateMember(janId, teamId, lisaId, "Lisa Nova", Role.ADMIN)
            updated.displayName shouldBe DisplayName("Lisa Nova")
            updated.permission shouldBe Role.ADMIN
            userRepo.findById(lisaId)?.displayName shouldBe DisplayName("Lisa Nova")
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
            service.listMembers(teamId).map { it.displayName } shouldBe listOf(DisplayName("Jan de Vries"))
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

        test("updateMember rejects a position this team does not have with PositionNotFoundException") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.updateMember(janId, teamId, lisaId, "Lisa Bakker", Role.USER, foreignPositionId)
            }
        }

        test("completeOnboarding marks the member onboarded and applies name and position") {
            val (service, userRepo, memberRepo) = newService()
            val updated = service.completeOnboarding(lisaId, teamId, "Lisa Nova", setterPositionId)
            updated.onboarded shouldBe true
            updated.displayName shouldBe DisplayName("Lisa Nova")
            updated.positionId shouldBe setterPositionId
            userRepo.findById(lisaId)?.displayName shouldBe DisplayName("Lisa Nova")
            memberRepo.findByTeamId(teamId).first { it.userId == lisaId }.onboarded shouldBe true
        }

        test("completeOnboarding is idempotent — a second call keeps onboarded true") {
            val (service, _, _) = newService()
            service.completeOnboarding(lisaId, teamId, "Lisa Nova", setterPositionId)
            val again = service.completeOnboarding(lisaId, teamId, "Lisa Nova", setterPositionId)
            again.onboarded shouldBe true
        }

        test("completeOnboarding does not change the member's role") {
            val (service, _, memberRepo) = newService(lisaRole = Role.ADMIN)
            service.completeOnboarding(lisaId, teamId, "Lisa Nova", null)
            memberRepo.findRole(teamId, lisaId) shouldBe Role.ADMIN
        }
    }
}
