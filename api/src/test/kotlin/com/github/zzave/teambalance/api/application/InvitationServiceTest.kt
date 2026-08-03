package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
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
private class FakeInvitationRepo(private val live: Invitation) : InvitationRepository {
    val saved = mutableListOf<Invitation>()
    var expiredTeam: UUID? = null
    val rotated = mutableListOf<Invitation>()
    override fun save(invitation: Invitation): Invitation { saved += invitation; return invitation }
    override fun findByTokenHash(tokenHash: String): Invitation = live
    override fun expireActive(teamId: UUID, now: Instant) { expiredTeam = teamId }
    override fun rotate(teamId: UUID, replacement: Invitation, now: Instant): Invitation {
        rotated += replacement
        return replacement
    }
}

// USER for everyone except the seeded admins; records joins so the open accept path can be asserted.
private class InviteFakeMemberRepo(private val admins: Set<UUID>) : TeamMemberRepository {
    val joined = mutableListOf<Pair<UUID, UUID>>()
    override fun findRole(teamId: UUID, userId: UUID): Role = if (userId in admins) Role.ADMIN else Role.USER
    override fun addMember(teamId: UUID, userId: UUID) { joined += teamId to userId }
    override fun findByTeamId(teamId: UUID): List<TeamMember> = emptyList()
    override fun findDisplayName(userId: UUID): String? = null
    override fun findMembersByUserIds(userIds: Set<UUID>): Map<UUID, TeamMember> = emptyMap()
    override fun findTeamId(userId: UUID): UUID? = null
    override fun updateRole(teamId: UUID, userId: UUID, role: Role) = Unit
    override fun deactivate(teamId: UUID, userId: UUID) = Unit
    override fun assignPosition(teamId: UUID, userId: UUID, positionId: PositionId?) = Unit
    override fun markOnboarded(teamId: UUID, userId: UUID, at: Instant) = Unit
    override fun countAdmins(teamId: UUID): Int = admins.size
}

class InvitationServiceTest : FunSpec() {
    init {
        val clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC)
        val teamId = UUID.randomUUID()
        val adminId = UUID.randomUUID()
        val nonAdmin = UUID.randomUUID()

        val liveInvitation = Invitation(
            id = UUID.randomUUID(),
            teamId = teamId,
            tokenHash = "hash",
            createdBy = adminId,
            expiresAt = Instant.EPOCH.plus(Duration.ofDays(1)),
            createdAt = Instant.EPOCH,
        )

        fun newService(): Triple<InvitationService, FakeInvitationRepo, InviteFakeMemberRepo> {
            val invitations = FakeInvitationRepo(liveInvitation)
            val members = InviteFakeMemberRepo(admins = setOf(adminId))
            val service = InvitationService(invitations, members, AuthorizationService(members), clock, "salt")
            return Triple(service, invitations, members)
        }

        test("generateInviteLink by a non-admin is forbidden") {
            val (service, _, _) = newService()
            shouldThrow<NotTeamAdminException> { service.generateInviteLink(callerId = nonAdmin, teamId = teamId) }
        }

        test("expireActiveInvitations by a non-admin is forbidden") {
            val (service, _, _) = newService()
            shouldThrow<NotTeamAdminException> { service.expireActiveInvitations(callerId = nonAdmin, teamId = teamId) }
        }

        test("rotateInviteLink by a non-admin is forbidden") {
            val (service, _, _) = newService()
            shouldThrow<NotTeamAdminException> { service.rotateInviteLink(callerId = nonAdmin, teamId = teamId) }
        }

        // The expire and the mint must reach the port as ONE call: that single call is what the adapter
        // makes atomic, so a failure to mint can't leave the team with no usable link. Two separate
        // calls would be two transactions and would reintroduce that gap.
        test("rotateInviteLink hands the expire and the mint over as a single port call") {
            val (service, invitations, _) = newService()
            val result = service.rotateInviteLink(callerId = adminId, teamId = teamId)

            invitations.rotated.single().createdBy shouldBe adminId
            invitations.saved.isEmpty() shouldBe true
            invitations.expiredTeam shouldBe null
            result.token.isNotBlank() shouldBe true
        }

        test("generateInviteLink by an admin mints a link attributed to the caller") {
            val (service, invitations, _) = newService()
            val result = service.generateInviteLink(callerId = adminId, teamId = teamId)
            result.token.isNotBlank() shouldBe true
            invitations.saved.single().createdBy shouldBe adminId
        }

        test("acceptInvitation requires no admin role — any authenticated user may join") {
            val (service, _, members) = newService()
            val joinedTeam = service.acceptInvitation(token = "anything", userId = nonAdmin)
            joinedTeam shouldBe teamId
            members.joined shouldBe listOf(teamId to nonAdmin)
        }
    }
}
