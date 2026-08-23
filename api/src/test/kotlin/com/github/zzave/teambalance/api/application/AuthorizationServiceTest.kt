package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ActAsExpiredException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

private class FakeTeamMemberRepository(private val roles: Map<Pair<TeamId, UserId>, Role>) : TeamMemberRepository {
    /** Every roster-mutating call, so "the synthesis writes nothing" is observable, not assumed. */
    val writes = mutableListOf<String>()

    override fun findByTeamId(teamId: TeamId) = emptyList<TeamMember>()
    override fun findDisplayName(userId: UserId): DisplayName? = null
    override fun findMembersByUserIds(userIds: Set<UserId>) = emptyMap<UserId, TeamMember>()
    override fun findRole(teamId: TeamId, userId: UserId): Role? = roles[teamId to userId]
    override fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting? = null
    override fun findSoleTenantRouting(userId: UserId): TenantRouting? = null
    override fun addMember(teamId: TeamId, userId: UserId) {
        writes += "addMember"
    }
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) {
        writes += "updateRole"
    }
    override fun deactivate(teamId: TeamId, userId: UserId) {
        writes += "deactivate"
    }
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) = Unit
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: java.time.Instant?,
    ) = Unit
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: java.time.Instant) = Unit
    override fun countAdmins(teamId: TeamId): Int = 0
}

class AuthorizationServiceTest : FunSpec() {

    init {
        val teamId = TeamId(UUID.randomUUID())
        val otherTeamId = TeamId(UUID.randomUUID())
        val adminId = UserId.random()
        val memberId = UserId.random()
        val strangerId = UserId.random()

        val roster = FakeTeamMemberRepository(
            mapOf(
                (teamId to adminId) to Role.ADMIN,
                (teamId to memberId) to Role.USER,
            ),
        )
        val service = AuthorizationService(roster, FakeActAsGateway())

        /** The Platform Admin — structurally a Member of nothing (ADR-0024 §3). */
        val operator = UserId.random()
        val now = Instant.parse("2026-08-23T10:00:00Z")

        fun actingAs(team: TeamId, who: UserId = operator) =
            AuthorizationService(roster, FakeActAsGateway(grant = ActAs.enter(who, team, now)))

        test("isAdmin is true for a user with the ADMIN role on that team") {
            service.isAdmin(adminId, teamId) shouldBe true
        }

        test("isAdmin is false for a non-admin member of that team") {
            service.isAdmin(memberId, teamId) shouldBe false
        }

        test("isAdmin is false for a user with no team_members row for that team") {
            service.isAdmin(strangerId, teamId) shouldBe false
        }

        test("isAdmin is false for an admin of a different team (cross-team isolation)") {
            service.isAdmin(adminId, otherTeamId) shouldBe false
        }

        test("requireAdmin passes through silently for an admin") {
            service.requireAdmin(adminId, teamId)
        }

        test("requireAdmin throws NotTeamAdminException for a non-admin") {
            shouldThrow<NotTeamAdminException> {
                service.requireAdmin(memberId, teamId)
            }
        }

        test("isMember is true for any active member of that team, admin or not") {
            service.isMember(adminId, teamId) shouldBe true
            service.isMember(memberId, teamId) shouldBe true
        }

        test("isMember is false for a user with no membership on that team") {
            service.isMember(strangerId, teamId) shouldBe false
        }

        test("isMember is false for a member of a different team (cross-team isolation)") {
            service.isMember(memberId, otherTeamId) shouldBe false
        }

        test("requireMember passes through silently for a plain (non-admin) member") {
            service.requireMember(memberId, teamId)
        }

        test("requireMember throws NoTeamMembershipException for a non-member") {
            shouldThrow<NoTeamMembershipException> {
                service.requireMember(strangerId, teamId)
            }
        }

        // ADR-0024 §2. These are the two invariants the whole feature's safety rests on; each one
        // fails the moment someone "helpfully" turns act-as into a standing property.
        context("the Virtual Member a Platform Admin holds during Act-as") {
            test("an active grant synthesizes ADMIN for the team it names") {
                actingAs(teamId).isAdmin(operator, teamId) shouldBe true
                actingAs(teamId).isMember(operator, teamId) shouldBe true
                actingAs(teamId).requireAdmin(operator, teamId)
            }

            // The synthesis is asked for, never inherited: this same operator, this same session,
            // is nobody in a team they did not enter.
            test("a grant on one team says nothing about another") {
                actingAs(teamId).isAdmin(operator, otherTeamId) shouldBe false
                shouldThrow<NotTeamAdminException> { actingAs(teamId).requireAdmin(operator, otherTeamId) }
            }

            // The keystone: without an ENTERED grant there is no synthesis at all. A platform admin
            // who has not entered is an ordinary teamless caller, whatever tenant the request is
            // routed to — otherwise act-as stops being a mode and becomes a property.
            test("no grant means no synthesis, however platform-admin the caller is") {
                service.isAdmin(operator, teamId) shouldBe false
                service.isMember(operator, teamId) shouldBe false
            }

            test("a grant belonging to someone else authorizes nobody") {
                val otherOperator = UserId.random()

                actingAs(teamId, who = otherOperator).isAdmin(operator, teamId) shouldBe false
            }

            test("the synthesis never touches team_members — no row is written, ever") {
                actingAs(teamId).requireAdmin(operator, teamId)

                roster.writes.shouldBeEmpty()
            }

            test("an existing member keeps their own role — the grant does not overwrite it") {
                actingAs(teamId).isAdmin(memberId, teamId) shouldBe false
                actingAs(teamId).isMember(memberId, teamId) shouldBe true
            }
        }

        context("a grant that ran out") {
            val lapsed = AuthorizationService(roster, FakeActAsGateway(lapsed = ActAs.enter(operator, teamId, now)))

            test("authorizes nothing") {
                lapsed.isAdmin(operator, teamId) shouldBe false
                lapsed.isMember(operator, teamId) shouldBe false
            }

            test("is refused as ACT_AS_EXPIRED, not as a generic denial the frontend cannot read") {
                shouldThrow<ActAsExpiredException> { lapsed.requireAdmin(operator, teamId) }
                shouldThrow<ActAsExpiredException> { lapsed.requireMember(operator, teamId) }
            }

            // The lapse explains a refusal only for the caller it belongs to. Asking "is this member
            // an admin?" inside a lapsed request is an ordinary denial, and dressing it as a lapse
            // would send the frontend off to recover from something that never expired.
            test("does not turn a refusal about someone else into a lapse report") {
                shouldThrow<NotTeamAdminException> { lapsed.requireAdmin(memberId, teamId) }
            }
        }
    }
}
