package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AuthSessionGateway
import com.github.zzave.teambalance.api.domain.port.EmailSender
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private class FakeAuthSessionGateway(private var sessionUserId: UserId? = null) : AuthSessionGateway {
    var startedFor: UserId? = null
    var ended = false

    override fun startSession(userId: UserId) {
        startedFor = userId
        sessionUserId = userId
    }

    override fun currentUserId(): UserId? = sessionUserId

    override fun endSession() {
        ended = true
        sessionUserId = null
    }
}

private class FakeTenantRoutingGateway : TenantRoutingGateway {
    var pinnedRouting: TenantRouting? = null

    override fun pinRouting(routing: TenantRouting) {
        pinnedRouting = routing
    }
}

private class FakeUserRepository(private val users: Map<UserId, User>) : UserRepository {
    override fun findById(id: UserId): User? = users[id]
    override fun findByEmail(email: Email): User? = users.values.firstOrNull { it.email == email }
    override fun save(user: User): User = user
}

private class FakeRoutingTeamMemberRepository(private val routing: TenantRouting?) : TeamMemberRepository {
    override fun findByTeamId(teamId: TeamId) = emptyList<TeamMember>()
    override fun findDisplayName(userId: UserId): String? = null
    override fun findMembersByUserIds(userIds: Set<UserId>) = emptyMap<UserId, TeamMember>()
    override fun findRole(teamId: TeamId, userId: UserId): Role? = Role.USER
    override fun findTeamId(userId: UserId): TeamId? = routing?.teamId
    override fun findTenantRouting(userId: UserId): TenantRouting? = routing
    override fun addMember(teamId: TeamId, userId: UserId) = Unit
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) = Unit
    override fun deactivate(teamId: TeamId, userId: UserId) = Unit
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) = Unit
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: String,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: Instant?,
    ) = Unit
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant) = Unit
    override fun countAdmins(teamId: TeamId): Int = 0
}

private class FakeMagicLinkTokenRepository : MagicLinkTokenRepository {
    override fun save(token: MagicLinkToken): MagicLinkToken = token
    override fun findByTokenHash(tokenHash: TokenHash): MagicLinkToken? = null
    override fun consumeAndResolveUser(consumedToken: MagicLinkToken, displayName: String): User =
        error("not used in these tests")
}

private class FakeTeamRepository : TeamRepository {
    override fun findAllSchemaNames() = emptyList<String>()
    override fun existsBySlug(slug: String) = false
    override fun findByUserId(userId: UUID): TeamSummary? = null
}

private class FakeEmailSender : EmailSender {
    override fun sendMagicLink(email: Email, token: String) = Unit
}

private class FakePlatformAdminGateway : PlatformAdminGateway {
    override fun isPlatformAdmin(userId: UUID) = false
    override fun requirePlatformAdmin(userId: UUID) = Unit
}

/**
 * Covers the session-lifecycle seam AuthService owns on behalf of the inbound layer: the controller
 * asks for a session, it does not know how one is stored (ADR-0018). The tenant-routing pin is the
 * part worth a test — it is what keeps the SPA's first authenticated burst off a concurrent
 * session-attribute write (#205).
 */
class AuthServiceTest : FunSpec() {

    init {
        val userId = UserId.random()
        val user = User(
            id = userId,
            email = Email("session@test.com"),
            displayName = "Session",
        )
        val routing = TenantRouting(teamId = TeamId(UUID.randomUUID()), schemaName = "team_alpha")

        fun serviceWith(
            gateway: AuthSessionGateway,
            tenantRouting: TenantRouting?,
            routingGateway: TenantRoutingGateway = FakeTenantRoutingGateway(),
        ) = AuthService(
            magicLinkTokenRepository = FakeMagicLinkTokenRepository(),
            userRepository = FakeUserRepository(mapOf(userId to user)),
            teamRepository = FakeTeamRepository(),
            teamMemberRepository = FakeRoutingTeamMemberRepository(tenantRouting),
            emailSender = FakeEmailSender(),
            platformAdminGateway = FakePlatformAdminGateway(),
            authSessionGateway = gateway,
            tenantRoutingGateway = routingGateway,
            clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC),
        )

        test("startSession pins the signed-in user's tenant routing") {
            val gateway = FakeAuthSessionGateway()
            val routingGateway = FakeTenantRoutingGateway()

            serviceWith(gateway, routing, routingGateway).startSession(userId)

            gateway.startedFor shouldBe userId
            routingGateway.pinnedRouting shouldBe routing
        }

        test("startSession leaves the tenant unpinned for a teamless user") {
            val gateway = FakeAuthSessionGateway()
            val routingGateway = FakeTenantRoutingGateway()

            serviceWith(gateway, null, routingGateway).startSession(userId)

            gateway.startedFor shouldBe userId
            routingGateway.pinnedRouting shouldBe null
        }

        test("currentUser resolves the user the session belongs to") {
            serviceWith(FakeAuthSessionGateway(userId), routing).currentUser() shouldBe user
        }

        test("currentUser is null without a session") {
            serviceWith(FakeAuthSessionGateway(null), routing).currentUser() shouldBe null
        }

        test("endSession drops the session, leaving no current user") {
            val gateway = FakeAuthSessionGateway(userId)
            val service = serviceWith(gateway, routing)

            service.endSession()

            gateway.ended shouldBe true
            service.currentUser() shouldBe null
        }
    }
}
