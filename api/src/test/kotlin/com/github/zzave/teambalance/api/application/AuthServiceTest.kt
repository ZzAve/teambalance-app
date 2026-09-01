package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AuthSessionGateway
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
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

private class FakeMagicLinkTokenRepository : MagicLinkTokenRepository {
    override fun save(token: MagicLinkToken): MagicLinkToken = token
    override fun findByTokenHash(tokenHash: TokenHash): MagicLinkToken? = null
    override fun consumeAndResolveUser(consumedToken: MagicLinkToken, displayName: DisplayName): User =
        error("not used in these tests")
}

private class FakeEmailGateway : EmailGateway {
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
            displayName = DisplayName("Session"),
        )
        fun serviceWith(
            gateway: AuthSessionGateway,
            directory: TeamDirectory = TeamDirectory(),
            routingGateway: TenantRoutingGateway = RecordingTenantRoutingGateway(),
            episodes: InMemoryActAsRepository = InMemoryActAsRepository(),
        ) = AuthService(
            magicLinkTokenRepository = FakeMagicLinkTokenRepository(),
            userRepository = directory.userRepository(user),
            teamMemberRepository = directory.teamMemberRepository(),
            activeTeamService = directory.activeTeamService(routingGateway, user),
            actAsService = directory.actAsService(
                routingGateway = routingGateway,
                actAsRepository = episodes,
                clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC),
                platformAdmins = emptySet(),
            ),
            emailGateway = FakeEmailGateway(),
            platformAdminGateway = FakePlatformAdminGateway(),
            authSessionGateway = gateway,
            clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC),
        )

        test("startSession pins the Active Team the signed-in user lands in, and reports it") {
            val gateway = FakeAuthSessionGateway()
            val routingGateway = RecordingTenantRoutingGateway()
            val directory = TeamDirectory()
            val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
            directory.join(userId, setpoint)

            serviceWith(gateway, directory, routingGateway).startSession(userId) shouldBe setpoint

            gateway.startedFor shouldBe userId
            routingGateway.lastPinned?.schemaName shouldBe directory.schemaOf(setpoint)
        }

        test("startSession leaves the tenant unpinned for a teamless user") {
            val gateway = FakeAuthSessionGateway()
            val routingGateway = RecordingTenantRoutingGateway()

            serviceWith(gateway, routingGateway = routingGateway).startSession(userId) shouldBe null

            gateway.startedFor shouldBe userId
            routingGateway.lastPinned shouldBe null
        }

        // A Member of several Teams with none remembered is signed in but *unrouted*: the session
        // exists, no tenant is pinned, and the frontend asks them which Team they mean.
        test("startSession pins nothing when several Teams are open and none is remembered") {
            val gateway = FakeAuthSessionGateway()
            val routingGateway = RecordingTenantRoutingGateway()
            val directory = TeamDirectory()
            directory.join(userId, directory.addTeam("Setpoint VT", "setpoint-vt"))
            directory.join(userId, directory.addTeam("Tovo Heren 5", "tovo-heren-5"))

            serviceWith(gateway, directory, routingGateway).startSession(userId) shouldBe null

            gateway.startedFor shouldBe userId
            routingGateway.pins shouldBe emptyList()
        }

        // ADR-0024 §4 guardrail: a fresh sign-in must not silently resume act-as. The grant outlives a
        // session by design, so startSession closes any open one. Pinned here because the lower-level
        // AuthSessionGateway.startSession does *not* — the invariant is one direct call away from bypass.
        test("startSession closes an open act-as grant so a fresh sign-in never resumes it") {
            val gateway = FakeAuthSessionGateway()
            val directory = TeamDirectory()
            val episodes = InMemoryActAsRepository()
            val team = directory.addTeam("Dames 5", "dames-5")
            episodes.save(ActAs.enter(userId = userId, teamId = team, now = Instant.EPOCH))

            serviceWith(gateway, directory, episodes = episodes).startSession(userId)

            episodes.findOpenFor(userId).shouldBeNull()
        }

        test("findTeamsFor lists every Team the caller is a Member of") {
            val directory = TeamDirectory()
            directory.join(userId, directory.addTeam("Tovo Heren 5", "tovo-heren-5"))
            directory.join(userId, directory.addTeam("Setpoint VT", "setpoint-vt"))

            serviceWith(FakeAuthSessionGateway(userId), directory).findTeamsFor(userId)
                .map { it.name.value } shouldBe listOf("Setpoint VT", "Tovo Heren 5")
        }

        // The Role reported to the caller is the Role in the Team they are *in*, not a property of the
        // user: the same person is an Admin in one Team and a plain User in another.
        test("findRoleIn answers per Team, not per user") {
            val directory = TeamDirectory()
            val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
            val tovo = directory.addTeam("Tovo Heren 5", "tovo-heren-5")
            directory.join(userId, setpoint, Role.ADMIN)
            directory.join(userId, tovo, Role.USER)
            val service = serviceWith(FakeAuthSessionGateway(userId), directory)

            service.findRoleIn(setpoint, userId) shouldBe Role.ADMIN
            service.findRoleIn(tovo, userId) shouldBe Role.USER
        }

        test("findRoleIn is null for a Team the caller is not a Member of") {
            val directory = TeamDirectory()
            val theirs = directory.addTeam("Someone Else", "someone-else")

            serviceWith(FakeAuthSessionGateway(userId), directory).findRoleIn(theirs, userId) shouldBe null
        }

        test("currentUser resolves the user the session belongs to") {
            serviceWith(FakeAuthSessionGateway(userId)).currentUser() shouldBe user
        }

        test("currentUser is null without a session") {
            serviceWith(FakeAuthSessionGateway(null)).currentUser() shouldBe null
        }

        test("endSession drops the session, leaving no current user") {
            val gateway = FakeAuthSessionGateway(userId)
            val service = serviceWith(gateway)

            service.endSession()

            gateway.ended shouldBe true
            service.currentUser() shouldBe null
        }
    }
}
