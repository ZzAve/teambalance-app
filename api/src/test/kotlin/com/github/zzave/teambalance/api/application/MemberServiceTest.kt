package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CannotChangeOwnRoleException
import com.github.zzave.teambalance.api.domain.exception.LastAdminException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.exception.ShirtNumberTakenException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionKind
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.ShirtNumber
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

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
    override fun setKind(id: PositionId, kind: PositionKind): Position = Position(id, store.getValue(id), kind)
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
        ): Triple<MemberService, UserRepository, TeamMemberRepository> {
            val directory = TeamDirectory().apply {
                join(janId, teamId, janRole)
                join(lisaId, teamId, lisaRole)
            }
            val userRepo = directory.userRepository(
                User(id = janId, email = Email("jan@test.com"), displayName = DisplayName("Jan de Vries")),
                User(id = lisaId, email = Email("lisa@test.com"), displayName = DisplayName("Lisa Bakker")),
            )
            val memberRepo = directory.teamMemberRepository()
            val positionRepo = MemberFakePositionRepo(listOf(setterPositionId to "Setter"))
            return Triple(
                MemberService(memberRepo, positionRepo, AuthorizationService(memberRepo, FakeActAsGateway()), fixedClock),
                userRepo,
                memberRepo,
            )
        }

        test("getMember returns the team member for the user") {
            val (service, _, _) = newService()
            service.getMember(TeamScope(janId, teamId), janId).displayName shouldBe DisplayName("Jan de Vries")
        }

        test("getMember throws MemberNotFoundException for a user not on the team") {
            val (service, _, _) = newService()
            shouldThrow<MemberNotFoundException> { service.getMember(TeamScope(janId, teamId), UserId.random()) }
        }

        test("listMembers returns the full team roster") {
            val (service, _, _) = newService()
            service.listMembers(TeamScope(janId, teamId)).map { it.displayName }.toSet() shouldBe
                setOf(DisplayName("Jan de Vries"), DisplayName("Lisa Bakker"))
        }

        test("admin updateMember edits another member's name and role") {
            val (service, userRepo, memberRepo) = newService()
            val updated = service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Nova", Role.ADMIN)
            updated.displayName shouldBe DisplayName("Lisa Nova")
            updated.permission shouldBe Role.ADMIN
            userRepo.findById(lisaId)?.displayName shouldBe DisplayName("Lisa Nova")
            memberRepo.findRole(teamId, lisaId) shouldBe Role.ADMIN
        }

        test("admin promotes a USER to ADMIN") {
            val (service, _, memberRepo) = newService()
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.ADMIN)
            memberRepo.findRole(teamId, lisaId) shouldBe Role.ADMIN
        }

        test("admin demotes another ADMIN to USER when another admin remains") {
            val (service, _, memberRepo) = newService(lisaRole = Role.ADMIN)
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER)
            memberRepo.findRole(teamId, lisaId) shouldBe Role.USER
        }

        test("demoting the last remaining admin throws LastAdminException") {
            val (service, _, _) = newService() // Jan is the only admin
            shouldThrow<LastAdminException> { service.updateMember(TeamScope(janId, teamId), janId, "Jan de Vries", Role.USER) }
        }

        test("a USER cannot self-promote to ADMIN") {
            val (service, _, _) = newService(janRole = Role.USER, lisaRole = Role.ADMIN)
            shouldThrow<CannotChangeOwnRoleException> { service.updateMember(TeamScope(janId, teamId), janId, "Jan de Vries", Role.ADMIN) }
        }

        test("a non-admin cannot edit another member") {
            val (service, _, _) = newService(janRole = Role.USER, lisaRole = Role.ADMIN)
            shouldThrow<NotTeamAdminException> { service.updateMember(TeamScope(janId, teamId), lisaId, "Hijacked", Role.USER) }
        }

        test("updateMember rejects a name another member already uses, excluding the target") {
            val (service, _, _) = newService()
            shouldThrow<NameTakenException> { service.updateMember(TeamScope(janId, teamId), lisaId, "Jan de Vries", Role.USER) }
        }

        test("removeMember deactivates the target so the roster excludes them") {
            val (service, _, _) = newService()
            service.removeMember(TeamScope(janId, teamId), lisaId)
            service.listMembers(TeamScope(janId, teamId)).map { it.displayName } shouldBe listOf(DisplayName("Jan de Vries"))
        }

        test("removeMember by a non-admin is forbidden") {
            val (service, _, _) = newService(janRole = Role.USER, lisaRole = Role.ADMIN)
            shouldThrow<NotTeamAdminException> { service.removeMember(TeamScope(janId, teamId), lisaId) }
        }

        test("removeMember refuses to remove the last remaining admin") {
            val (service, _, _) = newService() // Jan is the only admin
            shouldThrow<LastAdminException> { service.removeMember(TeamScope(janId, teamId), janId) }
        }

        test("admin updateMember assigns a position that belongs to the team") {
            val (service, _, _) = newService()
            val updated = service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, setterPositionId)
            updated.positionId shouldBe setterPositionId
        }

        test("updateMember with a null positionId clears the assignment") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, setterPositionId)
            val cleared = service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, null)
            cleared.positionId shouldBe null
        }

        test("updateMember rejects a position this team does not have with PositionNotFoundException") {
            val (service, _, _) = newService()
            shouldThrow<PositionNotFoundException> {
                service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, foreignPositionId)
            }
        }

        test("admin updateMember sets another member's shirt number") {
            val (service, _, _) = newService()
            val updated = service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 7)
            updated.shirtNumber shouldBe ShirtNumber(7)
        }

        test("updateMember accepts a three-digit shirt number") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(lisaId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 999)
                .shirtNumber shouldBe ShirtNumber(999)
        }

        test("updateMember with a null shirt number clears it") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 7)
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = null)
                .shirtNumber shouldBe null
        }

        test("completeOnboarding with a shirt number sets it") {
            val (service, _, _) = newService()
            service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa B", null, shirtNumber = 9).shirtNumber shouldBe ShirtNumber(9)
        }

        test("completeOnboarding with a null shirt number keeps the current one") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 4)
            service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa B", null, shirtNumber = null)
                .shirtNumber shouldBe ShirtNumber(4)
        }

        test("completeOnboarding rejects a shirt number another member wears") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), janId, "Jan de Vries", Role.ADMIN, shirtNumber = 7)
            shouldThrow<ShirtNumberTakenException> {
                service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa B", null, shirtNumber = 7)
            }
        }

        test("updateMember rejects a shirt number outside 0..999") {
            val (service, _, _) = newService()
            shouldThrow<IllegalArgumentException> {
                service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 1000)
            }
            shouldThrow<IllegalArgumentException> {
                service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = -1)
            }
        }

        test("updateMember rejects a shirt number another member wears with ShirtNumberTakenException") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), janId, "Jan de Vries", Role.ADMIN, shirtNumber = 7)
            shouldThrow<ShirtNumberTakenException> {
                service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 7)
            }
        }

        test("updateMember lets a member keep their own shirt number") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(lisaId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 7)
            service.updateMember(TeamScope(lisaId, teamId), lisaId, "Lisa B", Role.USER, shirtNumber = 7)
                .shirtNumber shouldBe ShirtNumber(7)
        }

        test("a removed member's shirt number is free for someone else") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 7)
            service.removeMember(TeamScope(janId, teamId), lisaId)
            service.updateMember(TeamScope(janId, teamId), janId, "Jan de Vries", Role.ADMIN, shirtNumber = 7)
                .shirtNumber shouldBe ShirtNumber(7)
        }

        test("completeOnboarding keeps the shirt number the member already has") {
            val (service, _, _) = newService()
            service.updateMember(TeamScope(janId, teamId), lisaId, "Lisa Bakker", Role.USER, shirtNumber = 12)
            service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa Nova", null)
                .shirtNumber shouldBe ShirtNumber(12)
        }

        test("completeOnboarding marks the member onboarded and applies name and position") {
            val (service, userRepo, memberRepo) = newService()
            val updated = service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa Nova", setterPositionId)
            updated.onboarded shouldBe true
            updated.displayName shouldBe DisplayName("Lisa Nova")
            updated.positionId shouldBe setterPositionId
            userRepo.findById(lisaId)?.displayName shouldBe DisplayName("Lisa Nova")
            memberRepo.findByTeamId(teamId).first { it.userId == lisaId }.onboarded shouldBe true
        }

        test("completeOnboarding is idempotent - a second call keeps onboarded true") {
            val (service, _, _) = newService()
            service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa Nova", setterPositionId)
            val again = service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa Nova", setterPositionId)
            again.onboarded shouldBe true
        }

        test("completeOnboarding does not change the member's role") {
            val (service, _, memberRepo) = newService(lisaRole = Role.ADMIN)
            service.completeOnboarding(TeamScope(lisaId, teamId), "Lisa Nova", null)
            memberRepo.findRole(teamId, lisaId) shouldBe Role.ADMIN
        }
    }
}
