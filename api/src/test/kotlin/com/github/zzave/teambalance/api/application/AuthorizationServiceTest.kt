package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ActAsExpiredException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

class AuthorizationServiceTest : FunSpec() {

    init {
        val teamId = TeamId(UUID.randomUUID())
        val otherTeamId = TeamId(UUID.randomUUID())
        val adminId = UserId.random()
        val memberId = UserId.random()
        val strangerId = UserId.random()

        val directory = TeamDirectory().apply {
            join(adminId, teamId, Role.ADMIN)
            join(memberId, teamId, Role.USER)
        }
        val roster = directory.teamMemberRepository()
        val service = AuthorizationService(roster, FakeActAsGateway())

        /** The Platform Admin — structurally a Member of nothing (ADR-0024 §3). */
        val operator = UserId.random()
        val now = Instant.parse("2026-08-23T10:00:00Z")

        fun actingAs(team: TeamId, who: UserId = operator) =
            AuthorizationService(roster, FakeActAsGateway(grant = ActAs.enter(who, team, now)))

        fun scope(user: UserId, team: TeamId = teamId) = TeamScope(user, team)

        test("roleOf is the member's Role in that team") {
            service.roleOf(adminId, teamId) shouldBe Role.ADMIN
            service.roleOf(memberId, teamId) shouldBe Role.USER
        }

        // The Role reported to the caller is the Role in the Team they are *in*, not a property of the
        // user: the same person is an Admin in one Team and a plain User in another.
        test("roleOf answers per Team, not per user") {
            val directory = TeamDirectory().apply {
                join(memberId, otherTeamId, Role.ADMIN)
                join(memberId, teamId, Role.USER)
            }
            val perTeam = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway())

            perTeam.roleOf(memberId, otherTeamId) shouldBe Role.ADMIN
            perTeam.roleOf(memberId, teamId) shouldBe Role.USER
        }

        test("roleOf is null for a user with no team_members row for that team") {
            service.roleOf(strangerId, teamId) shouldBe null
        }

        test("roleOf is null for a member of a different team (cross-team isolation)") {
            service.roleOf(adminId, otherTeamId) shouldBe null
        }

        test("requireAdmin passes through silently for an admin") {
            service.requireAdmin(scope(adminId))
        }

        test("requireAdmin throws NotTeamAdminException for a non-admin member") {
            shouldThrow<NotTeamAdminException> { service.requireAdmin(scope(memberId)) }
        }

        test("requireAdmin throws NotTeamAdminException for a user with no membership") {
            shouldThrow<NotTeamAdminException> { service.requireAdmin(scope(strangerId)) }
        }

        test("requireAdmin throws NotTeamAdminException for an admin of a different team (cross-team isolation)") {
            shouldThrow<NotTeamAdminException> { service.requireAdmin(scope(adminId, otherTeamId)) }
        }

        test("requireMember passes through silently for any active member, admin or not") {
            service.requireMember(scope(memberId))
            service.requireMember(scope(adminId))
        }

        test("requireMember throws NoTeamMembershipException for a non-member") {
            shouldThrow<NoTeamMembershipException> { service.requireMember(scope(strangerId)) }
        }

        test("requireMember throws NoTeamMembershipException for a member of a different team (cross-team isolation)") {
            shouldThrow<NoTeamMembershipException> { service.requireMember(scope(memberId, otherTeamId)) }
        }

        test("requireMember on a target requires both the caller and the target to be members") {
            service.requireMember(scope(adminId), targetUserId = memberId)
            shouldThrow<NoTeamMembershipException> { service.requireMember(scope(strangerId), targetUserId = memberId) }
            shouldThrow<NoTeamMembershipException> { service.requireMember(scope(adminId), targetUserId = strangerId) }
        }

        test("requireSelfOrAdmin lets any member act on themselves") {
            service.requireSelfOrAdmin(scope(memberId), memberId)
        }

        test("requireSelfOrAdmin lets an admin act on someone else") {
            service.requireSelfOrAdmin(scope(adminId), memberId)
        }

        test("requireSelfOrAdmin refuses a non-admin acting on someone else") {
            shouldThrow<NotTeamAdminException> { service.requireSelfOrAdmin(scope(memberId), adminId) }
        }

        // ADR-0024 §2. These are the two invariants the whole feature's safety rests on; each one
        // fails the moment someone "helpfully" turns act-as into a standing property.
        context("the Virtual Member a Platform Admin holds during Act-as") {
            test("an active grant synthesizes ADMIN for the team it names") {
                actingAs(teamId).roleOf(operator, teamId) shouldBe Role.ADMIN
                actingAs(teamId).requireMember(scope(operator))
                actingAs(teamId).requireAdmin(scope(operator))
            }

            // The synthesis is asked for, never inherited: this same operator, this same session,
            // is nobody in a team they did not enter.
            test("a grant on one team says nothing about another") {
                actingAs(teamId).roleOf(operator, otherTeamId) shouldBe null
                shouldThrow<NotTeamAdminException> { actingAs(teamId).requireAdmin(scope(operator, otherTeamId)) }
            }

            // The keystone: without an ENTERED grant there is no synthesis at all. A platform admin
            // who has not entered is an ordinary teamless caller, whatever tenant the request is
            // routed to — otherwise act-as stops being a mode and becomes a property.
            test("no grant means no synthesis, however platform-admin the caller is") {
                service.roleOf(operator, teamId) shouldBe null
            }

            test("a grant belonging to someone else authorizes nobody") {
                val otherOperator = UserId.random()

                actingAs(teamId, who = otherOperator).roleOf(operator, teamId) shouldBe null
            }

            test("an operator acting as a team may write for one of its members") {
                actingAs(teamId).requireMember(scope(operator), targetUserId = memberId)
            }

            test("the synthesis never touches team_members - no row is written, ever") {
                actingAs(teamId).requireAdmin(scope(operator))

                directory.writes.shouldBeEmpty()
            }

            test("an existing member keeps their own role - the grant does not overwrite it") {
                actingAs(teamId).roleOf(memberId, teamId) shouldBe Role.USER
            }
        }

        context("a grant that ran out") {
            val lapsed = AuthorizationService(roster, FakeActAsGateway(lapsed = ActAs.enter(operator, teamId, now)))

            test("authorizes nothing") {
                lapsed.roleOf(operator, teamId) shouldBe null
            }

            test("is refused as ACT_AS_EXPIRED, not as a generic denial the frontend cannot read") {
                shouldThrow<ActAsExpiredException> { lapsed.requireAdmin(scope(operator)) }
                shouldThrow<ActAsExpiredException> { lapsed.requireMember(scope(operator)) }
            }

            test("is refused as ACT_AS_EXPIRED when writing for a member") {
                shouldThrow<ActAsExpiredException> { lapsed.requireMember(scope(operator), targetUserId = memberId) }
            }

            // The lapse explains a refusal only for the caller it belongs to. Asking "is this member
            // an admin?" inside a lapsed request is an ordinary denial, and dressing it as a lapse
            // would send the frontend off to recover from something that never expired.
            test("does not turn a refusal about someone else into a lapse report") {
                shouldThrow<NotTeamAdminException> { lapsed.requireAdmin(scope(memberId)) }
                shouldThrow<NoTeamMembershipException> { lapsed.requireMember(scope(adminId), targetUserId = strangerId) }
            }
        }
    }
}
