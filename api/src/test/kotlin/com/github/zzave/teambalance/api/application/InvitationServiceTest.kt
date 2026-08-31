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
import io.kotest.matchers.shouldNotBe
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.util.Base64
import java.util.UUID

// Records saves and always resolves a live invitation for the accept path (token hashing is not the
// subject here — authorization is).
//
// `active` is deliberately separate from `live` and starts empty: `live` answers "some token was
// presented and it resolves", while `active` answers "this team already has a link", which is the
// question the idempotent mint asks. A team with no link yet is the state most tests want.
private class FakeInvitationRepo(private var live: Invitation?) : InvitationRepository {
    val saved = mutableListOf<Invitation>()
    var expiredTeam: TeamId? = null
    val rotated = mutableListOf<Invitation>()
    var active: Invitation? = null
    var activeAdmin: Invitation? = null
    private val consumed = mutableSetOf<UUID>()

    /** The way a rotate or a lapsed TTL does: every later lookup misses. */
    fun expire() { live = null; active = null }

    /** Make [invitation] the one the accept path resolves — a specific ADMIN link, say. */
    fun present(invitation: Invitation) { live = invitation }

    /** True once [consume] has stamped this id — the single-use assertion. */
    fun isConsumed(id: UUID): Boolean = id in consumed

    override fun save(invitation: Invitation): Invitation {
        saved += invitation
        // A save routes to the role-scoped "active" slot the matching lookup reads, so the idempotent
        // mint sees its own link back — the USER shareable one and the ADMIN handover one are separate.
        if (invitation.role == Role.ADMIN) activeAdmin = invitation else active = invitation
        return invitation
    }
    override fun findByTokenHash(tokenHash: TokenHash): Invitation? = live
    override fun findActiveByTeam(teamId: TeamId, now: Instant): Invitation? =
        active?.takeIf { it.role == Role.USER && it.teamId == teamId && it.expiresAt.isAfter(now) }
    override fun findActiveAdminByTeam(teamId: TeamId, now: Instant): Invitation? =
        activeAdmin?.takeIf {
            it.role == Role.ADMIN && it.consumedAt == null && it.id !in consumed &&
                it.teamId == teamId && it.expiresAt.isAfter(now)
        }
    override fun consume(invitationId: UUID, now: Instant): Boolean = consumed.add(invitationId)
    override fun expireActive(teamId: TeamId, now: Instant) { expiredTeam = teamId; active = null }
    override fun rotate(teamId: TeamId, replacement: Invitation, now: Instant): Invitation {
        rotated += replacement
        active = replacement
        return replacement
    }
}

class InvitationServiceTest : FunSpec() {
    init {
        val clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC)
        val testCipher = InviteTokenCipher.fromBase64Key(
            Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() }),
        )
        val adminId = UserId.random()
        val nonAdmin = UserId.random()
        val joiner = User(id = nonAdmin, email = Email("joiner@example.com"), displayName = DisplayName("Joiner"))

        class Fixture(val directory: TeamDirectory, val teamId: TeamId) {
            val invitations = FakeInvitationRepo(
                Invitation(
                    id = UUID.randomUUID(),
                    teamId = teamId,
                    role = Role.USER,
                    consumedAt = null,
                    tokenHash = TokenHash("hash"),
                    // Hash-only, like every invitation minted before ADR-0025.
                    encryptedToken = null,
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
                authorizationService = AuthorizationService(members, FakeActAsGateway()),
                activeTeamService = directory.activeTeamService(routingGateway, joiner),
                clock = clock,
                tokenSalt = "salt",
                tokenCipher = testCipher,
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

        test("acceptInvitation makes the joined Team the joiner's Active Team") {
            val f = newFixture()
            val other = f.directory.addTeam("Tovo Heren 5", "tovo-heren-5")
            f.directory.join(nonAdmin, other)

            f.service.acceptInvitation(token = "anything", userId = nonAdmin)

            f.directory.rememberedTeamOf(nonAdmin) shouldBe f.teamId
            f.routingGateway.lastPinned?.schemaName shouldBe f.directory.schemaOf(f.teamId)
        }

        // The defect ADR-0025 fixes: the dialog re-minted whenever it had no in-memory link, which
        // after a refresh was always, so a team accumulated an unbounded set of concurrently-valid
        // credentials that no screen ever showed. A team has one link; asking again returns that one.
        test("generateInviteLink returns the team's existing link instead of minting a second") {
            val f = newFixture()
            val first = f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)
            val second = f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)

            second.token.value shouldBe first.token.value
            f.invitations.saved.size shouldBe 1
        }

        test("activeInviteLink hands back the very token that was minted") {
            val f = newFixture()
            val minted = f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)

            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId)?.token?.value shouldBe
                minted.token.value
        }

        test("activeInviteLink is null for a team with no link") {
            val f = newFixture()
            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId) shouldBe null
        }

        test("activeInviteLink is null once the link is expired") {
            val f = newFixture()
            f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)
            f.service.expireActiveInvitations(callerId = adminId, teamId = f.teamId)

            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId) shouldBe null
        }

        test("activeInviteLink follows a rotate to the replacement link") {
            val f = newFixture()
            val before = f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)
            val rotated = f.service.rotateInviteLink(callerId = adminId, teamId = f.teamId)

            rotated.token.value shouldNotBe before.token.value
            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId)?.token?.value shouldBe
                rotated.token.value
        }

        // V011 expired every hash-only row, so this is unreachable in practice — but a stray one must
        // read as "no link" (which the UI turns into an offer to generate) rather than throwing.
        test("activeInviteLink treats a pre-ADR-0025 hash-only link as no link") {
            val f = newFixture()
            f.invitations.active = Invitation(
                id = UUID.randomUUID(),
                teamId = f.teamId,
                role = Role.USER,
                consumedAt = null,
                tokenHash = TokenHash("legacy"),
                encryptedToken = null,
                createdBy = adminId,
                expiresAt = Instant.EPOCH.plus(Duration.ofDays(1)),
                createdAt = Instant.EPOCH,
            )

            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId) shouldBe null
        }

        // ...and the mint must not be blocked by one either, or such a team could never get a link.
        test("generateInviteLink replaces a pre-ADR-0025 hash-only link with a readable one") {
            val f = newFixture()
            f.invitations.active = Invitation(
                id = UUID.randomUUID(),
                teamId = f.teamId,
                role = Role.USER,
                consumedAt = null,
                tokenHash = TokenHash("legacy"),
                encryptedToken = null,
                createdBy = adminId,
                expiresAt = Instant.EPOCH.plus(Duration.ofDays(1)),
                createdAt = Instant.EPOCH,
            )

            val minted = f.service.generateInviteLink(callerId = adminId, teamId = f.teamId)

            minted.token.value.isNotBlank() shouldBe true
            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId)?.token?.value shouldBe
                minted.token.value
        }

        test("activeInviteLink by a non-admin is forbidden") {
            val f = newFixture()
            shouldThrow<NotTeamAdminException> {
                f.service.activeInviteLink(callerId = nonAdmin, teamId = f.teamId)
            }
        }

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

        // ----- Role-granting Admin handover link (ADR-0024 §5, #240) -----

        val recipient = UserId.random()

        fun adminLink(id: UUID = UUID.randomUUID(), teamId: TeamId) = Invitation(
            id = id,
            teamId = teamId,
            role = Role.ADMIN,
            consumedAt = null,
            tokenHash = TokenHash("hash"),
            encryptedToken = null,
            createdBy = adminId,
            expiresAt = Instant.EPOCH.plus(Duration.ofDays(1)),
            createdAt = Instant.EPOCH,
        )

        test("generateAdminInviteLink by a non-admin is forbidden") {
            val f = newFixture()
            shouldThrow<NotTeamAdminException> {
                f.service.generateAdminInviteLink(callerId = nonAdmin, teamId = f.teamId)
            }
        }

        test("generateAdminInviteLink mints an ADMIN link attributed to the caller") {
            val f = newFixture()
            val result = f.service.generateAdminInviteLink(callerId = adminId, teamId = f.teamId)

            result.token.value.isNotBlank() shouldBe true
            f.invitations.saved.single().role shouldBe Role.ADMIN
            f.invitations.saved.single().createdBy shouldBe adminId
        }

        // At most one live ADMIN credential per team, mirroring the USER link's anti-accumulation rule.
        test("generateAdminInviteLink returns the existing unspent admin link instead of minting a second") {
            val f = newFixture()
            val first = f.service.generateAdminInviteLink(callerId = adminId, teamId = f.teamId)
            val second = f.service.generateAdminInviteLink(callerId = adminId, teamId = f.teamId)

            second.token.value shouldBe first.token.value
            f.invitations.saved.size shouldBe 1
        }

        // The ADMIN link does not masquerade as the shareable USER link: the "current link" read and the
        // USER idempotent mint must never surface it.
        test("an admin handover link is not returned as the team's shareable USER link") {
            val f = newFixture()
            f.service.generateAdminInviteLink(callerId = adminId, teamId = f.teamId)

            f.service.activeInviteLink(callerId = adminId, teamId = f.teamId) shouldBe null
        }

        test("accepting an ADMIN link joins the recipient as ADMIN and switches them in") {
            val f = newFixture()
            f.invitations.present(adminLink(teamId = f.teamId))

            val joined = f.service.acceptInvitation(token = "handover", userId = recipient)

            joined shouldBe f.teamId
            f.members.findRole(f.teamId, recipient) shouldBe Role.ADMIN
            f.routingGateway.lastPinned?.schemaName shouldBe f.directory.schemaOf(f.teamId)
        }

        // Single-use: the link is spent on the first accept, and forwarding it to a second person grants
        // them nothing (ADR-0024 §5 — the decision made in #240).
        test("an ADMIN link is single-use: a second accept joins nobody and switches nothing") {
            val f = newFixture()
            val id = UUID.randomUUID()
            f.invitations.present(adminLink(id = id, teamId = f.teamId))
            val second = UserId.random()

            f.service.acceptInvitation(token = "handover", userId = recipient) shouldBe f.teamId
            f.invitations.isConsumed(id) shouldBe true
            f.routingGateway.writes.clear()

            f.service.acceptInvitation(token = "handover", userId = second) shouldBe null
            f.members.findRole(f.teamId, second) shouldBe null
            f.routingGateway.pins shouldBe emptyList()
        }

        // A USER link is never consumed — the shareable "many joiners" model is unchanged (ADR-0025).
        test("a USER link is reusable: two different people can both accept it") {
            val f = newFixture()
            val second = UserId.random()

            f.service.acceptInvitation(token = "shared", userId = nonAdmin) shouldBe f.teamId
            f.service.acceptInvitation(token = "shared", userId = second) shouldBe f.teamId

            f.members.findRole(f.teamId, nonAdmin) shouldBe Role.USER
            f.members.findRole(f.teamId, second) shouldBe Role.USER
        }
    }
}
