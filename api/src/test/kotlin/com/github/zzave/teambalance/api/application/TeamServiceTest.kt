package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.AlreadyInTeamException
import com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException
import com.github.zzave.teambalance.api.domain.exception.InvalidSlugException
import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException
import com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamNotificationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRegistrationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private class FakeMemberRepo(private val existingTeam: TeamId?) : TeamMemberRepository {
    override fun findTeamId(userId: UserId): TeamId? = existingTeam
    override fun findTenantRouting(userId: UserId): TenantRouting? = null
    override fun findByTeamId(teamId: TeamId): List<TeamMember> = emptyList()
    override fun findDisplayName(userId: UserId): DisplayName? = null
    override fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember> = emptyMap()
    override fun findRole(teamId: TeamId, userId: UserId): Role? = null
    override fun addMember(teamId: TeamId, userId: UserId) = Unit
    override fun updateRole(teamId: TeamId, userId: UserId, role: Role) = Unit
    override fun deactivate(teamId: TeamId, userId: UserId) = Unit
    override fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?) = Unit
    override fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant) = Unit
    override fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: Instant?,
    ) = Unit
    override fun countAdmins(teamId: TeamId): Int = 0
}

private class FakeTeamRepo(private val existingSlugs: Set<Slug> = emptySet()) : TeamRepository {
    override fun findAllSchemaNames(): List<String> = emptyList()
    override fun existsBySlug(slug: Slug): Boolean = slug in existingSlugs
    override fun findByUserId(userId: UUID): TeamSummary? = null
}

private class FakeCodeRepo(private val redeemable: Boolean) : TeamCreationCodeRepository {
    override fun isRedeemable(code: String, now: Instant): Boolean = redeemable
    override fun findAll(): List<TeamCreationCode> = emptyList()
    override fun findByCode(code: String): TeamCreationCode? = null
    override fun insert(code: String, createdAt: Instant, expiresAt: Instant?): TeamCreationCode =
        TeamCreationCode(code, createdAt, expiresAt, null, null, null)
    override fun delete(code: String) = Unit
}

// Both the provisioner and the registrar append to one shared log so tests can assert ordering
// (provision-first) as well as whether each step ran at all.
private class RecordingProvisioner(private val calls: MutableList<String>, private val fail: Boolean = false) :
    TenantProvisioningGateway {
    override fun provisionTenant(schemaName: String) {
        if (fail) throw IllegalStateException("provision boom")
        calls += "provision:$schemaName"
    }
}

private class RecordingRegistrar(
    private val calls: MutableList<String>,
    private val teamId: UUID,
) : TeamRegistrationGateway {
    override fun register(
        creationCode: String,
        founderId: UUID,
        name: TeamName,
        slug: Slug,
        schemaName: String,
        now: Instant,
    ): UUID {
        calls += "register:$slug"
        return teamId
    }
}

private class FakeUserRepo(private val user: User?) : UserRepository {
    override fun findById(id: UserId): User? = user
    override fun findByEmail(email: Email): User? = null
    override fun save(user: User): User = user
}

private class RecordingNotifier(private val throwing: Boolean = false) : TeamNotificationGateway {
    val created = mutableListOf<Triple<String, String, String>>()
    val audited = mutableListOf<Triple<String, String, String>>()
    override fun teamCreated(founderEmail: String, teamName: String, teamSlug: String) {
        if (throwing) throw IllegalStateException("mail boom")
        created += Triple(founderEmail, teamName, teamSlug)
    }
    override fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String) {
        if (throwing) throw IllegalStateException("mail boom")
        audited += Triple(teamName, teamSlug, founderEmail)
    }
}

class TeamServiceTest : FunSpec() {
    init {
        val clock = Clock.fixed(Instant.EPOCH, ZoneOffset.UTC)
        val founder = UserId.random()
        val newTeamId = UUID.randomUUID()
        val founderUser = User(id = founder, email = Email("founder@example.com"), displayName = DisplayName("Founder"))

        fun service(
            calls: MutableList<String> = mutableListOf(),
            existingTeam: TeamId? = null,
            existingSlugs: Set<Slug> = emptySet(),
            redeemable: Boolean = true,
            provisionFails: Boolean = false,
            user: User? = founderUser,
            notifier: TeamNotificationGateway = RecordingNotifier(),
        ) = TeamService(
            teamMemberRepository = FakeMemberRepo(existingTeam),
            teamRepository = FakeTeamRepo(existingSlugs),
            creationCodeRepository = FakeCodeRepo(redeemable),
            tenantProvisioningGateway = RecordingProvisioner(calls, provisionFails),
            teamRegistrationGateway = RecordingRegistrar(calls, newTeamId),
            userRepository = FakeUserRepo(user),
            teamNotificationGateway = notifier,
            clock = clock,
        )

        test("creates the team: provisions the schema, registers, and returns id/name/slug") {
            val calls = mutableListOf<String>()
            val created = service(calls).createTeam(founder, "Setpoint VT", "setpoint-vt", "GOODCODE")

            created.id shouldBe newTeamId
            created.name shouldBe TeamName("Setpoint VT")
            created.slug shouldBe Slug("setpoint-vt")
            // Provision-first: the schema is created before the atomic register commits.
            calls shouldContainExactly listOf("provision:team_setpoint_vt", "register:setpoint-vt")
        }

        test("rejects a founder who already belongs to a team, without provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<AlreadyInTeamException> {
                service(calls, existingTeam = TeamId(UUID.randomUUID()))
                    .createTeam(founder, "New Team", "new-team", "GOODCODE")
            }
            calls shouldBe emptyList()
        }

        test("rejects a blank name with 400 before any provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<InvalidTeamNameException> { service(calls).createTeam(founder, "   ", "valid-slug", "GOODCODE") }
            calls shouldBe emptyList()
        }

        test("rejects an invalid slug with 400 before any provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<InvalidSlugException> { service(calls).createTeam(founder, "Setpoint VT", "Bad Slug", "GOODCODE") }
            calls shouldBe emptyList()
        }

        test("rejects a taken slug with 409 before any provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<TeamSlugTakenException> {
                service(calls, existingSlugs = setOf(Slug("setpoint-vt"))).createTeam(founder, "Setpoint VT", "setpoint-vt", "GOODCODE")
            }
            calls shouldBe emptyList()
        }

        test("rejects a non-redeemable code with opaque 403 and does NOT provision a schema") {
            val calls = mutableListOf<String>()
            shouldThrow<InvalidCreationCodeException> {
                service(calls, redeemable = false).createTeam(founder, "Setpoint VT", "setpoint-vt", "BADCODE")
            }
            // The peek gates provisioning — a bad code never leaves an orphan schema behind.
            calls shouldBe emptyList()
        }

        test("a provisioning failure propagates and no registration happens") {
            val calls = mutableListOf<String>()
            shouldThrow<RuntimeException> {
                service(calls, provisionFails = true).createTeam(founder, "Setpoint VT", "setpoint-vt", "GOODCODE")
            }
            calls shouldBe emptyList() // provisioner threw before recording; register never reached
        }

        test("notifies the founder and audits the platform admins on success") {
            val notifier = RecordingNotifier()
            service(notifier = notifier).createTeam(founder, "Setpoint VT", "setpoint-vt", "GOODCODE")

            notifier.created shouldContainExactly listOf(Triple("founder@example.com", "Setpoint VT", "setpoint-vt"))
            notifier.audited shouldContainExactly listOf(Triple("Setpoint VT", "setpoint-vt", "founder@example.com"))
        }

        test("a failing notifier never fails a committed creation (fire-and-forget)") {
            val created = service(notifier = RecordingNotifier(throwing = true))
                .createTeam(founder, "Setpoint VT", "setpoint-vt", "GOODCODE")
            created.id shouldBe newTeamId
        }
    }
}
