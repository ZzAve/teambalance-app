package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

// Records saves and always resolves a live invitation for the accept path (token hashing is not the
// subject here — authorization is).
private class FakeInvitationRepo(private var live: Invitation?) : InvitationRepository {
    val saved = mutableListOf<Invitation>()
    var expiredTeam: TeamId? = null
    val rotated = mutableListOf<Invitation>()

    /** Kills the stored link the way a rotate or a lapsed TTL does — every later lookup misses. */
    fun expire() { live = null }

    override fun save(invitation: Invitation): Invitation { saved += invitation; return invitation }
    override fun findByTokenHash(tokenHash: TokenHash): Invitation? = live
    override fun expireActive(teamId: TeamId, now: Instant) { expiredTeam = teamId }
    override fun rotate(teamId: TeamId, replacement: Invitation, now: Instant): Invitation {
        rotated += replacement
        return replacement
    }
}

class InvitationServiceTest : FunSpec() {
    init {
        val clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC)
        val adminId = UserId.random()
        val nonAdmin = UserId.random()
        val joiner = User(id = nonAdmin, email = Email("joiner@example.com"), displayName = DisplayName("Joiner"))

        class Fixture(val directory: TeamDirectory, val teamId: TeamId) {
            val invitations = FakeInvitationRepo(
                Invitation(
                    id = UUID.randomUUID(),
                    teamId = teamId,
                    tokenHash = TokenHash("hash"),
                    createdBy = adminId,
                    expiresAt = Instant.EPOCH.plus(Duration.ofDays(1)),
                    createdAt = Instant.EPOCH,
                ),
            )
            val routingGateway = RecordingTenantRoutingGateway()
            val members = directory.teamMemberRepository()
            val service = InvitationService(
                invitationRepository = invitations,
                teamMemberRepository = members,
                authorizationService = AuthorizationService(members),
                activeTeamService = directory.activeTeamService(routingGateway, joiner),
                clock = clock,
                tokenSalt = "salt",
            )
        }

        fun newFixture(): Fixture {
            val directory = TeamDirectory()
            val teamId = directory.addTeam("Setpoint VT", "setpoint-vt")
            directory.join(adminId, teamId, Role.ADMIN)
            return Fixture(directory, teamId)
        }

        test("generateInviteLink by a non-admin is forbidden") {
            val f = newFixture()
            shouldThrow<NotTeamAdminException> { f.service.generateInviteLink(callerId = nonAdmin, teamId = f.teamId) }
        }

        test("expireActiveInvitations by a non-admin is forbidden") {
            val f = newFixture()
            shouldThrow<NotTeamAdminException> {
                f.service.expireActiveInvitations(callerId = nonAdmin, teamId = f.teamId)
            }
        }

        test("rotateInviteLink by a non-admin is forbidden") {
            val f = newFixture()
            shouldThrow<NotTeamAdminException> { f.service.rotateInviteLink(callerId = nonAdmin, teamId = f.teamId) }
        }

        // The expire and the mint must reach the port as ONE call: that single call is what the adapter
        // makes atomic, so a failure to mint can't leave the team with no usable link. Two separate
        // calls would be two transactions and would reintroduce that gap.
        test("rotateInviteLink hands the expire and the mint over as a single port call") {
            val f = newFixture()
            val result = f.service.rotateInviteLink(callerId = adminId, teamId = f.teamId)

            f.invitations.rotated.single().createdBy shouldBe adminId
            f.invitations.saved.isEmpty() shouldBe true
            f.invitations.expiredTeam shouldBe null
            result.token.value.isNotBlank() shouldBe true
        }

        test("generateInviteLink by an admin mints a link attributed to the caller") {
            val f = newFixture()
            val result = f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)
            result.token.value.isNotBlank() shouldBe true
            f.invitations.saved.single().createdBy shouldBe adminId
        }

        test("acceptInvitation requires no admin role — any authenticated user may join") {
            val f = newFixture()
            val joinedTeam = f.service.acceptInvitation(token = "anything", userId = nonAdmin)
            joinedTeam shouldBe f.teamId
            f.members.findRole(f.teamId, nonAdmin) shouldBe Role.USER
        }

        // ADR-0021 §4: accepting is no longer fire-and-forget. A joiner who is already a Member
        // somewhere would otherwise join and keep looking at their other Team.
        test("acceptInvitation makes the joined Team the joiner's Active Team") {
            val f = newFixture()
            val other = f.directory.addTeam("Tovo Heren 5", "tovo-heren-5")
            f.directory.join(nonAdmin, other)

            f.service.acceptInvitation(token = "anything", userId = nonAdmin)

            f.directory.rememberedTeamOf(nonAdmin) shouldBe f.teamId
            f.routingGateway.lastPinned?.schemaName shouldBe f.directory.schemaOf(f.teamId)
        }

        // A dead token must not disturb the Active Team of whoever presented it.
        test("an expired token joins nothing and switches nothing") {
            val f = newFixture()
            val other = f.directory.addTeam("Tovo Heren 5", "tovo-heren-5")
            f.directory.join(nonAdmin, other)
            f.service.acceptInvitation(token = "anything", userId = nonAdmin)
            f.invitations.expire()
            f.routingGateway.writes.clear()

            f.service.acceptInvitation(token = "anything", userId = nonAdmin) shouldBe null

            f.routingGateway.pins shouldBe emptyList()
        }
    }
}
