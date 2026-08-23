package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException
import com.github.zzave.teambalance.api.domain.exception.InvalidSlugException
import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException
import com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import com.github.zzave.teambalance.api.domain.port.TeamNotificationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRegistrationGateway
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private class FakeCodeRepo(private val redeemable: Boolean) : TeamCreationCodeRepository {
    override fun isRedeemable(code: CreationCode, now: Instant): Boolean = redeemable
    override fun findAll(): List<TeamCreationCode> = emptyList()
    override fun findByCode(code: CreationCode): TeamCreationCode? = null
    override fun insert(code: CreationCode, createdAt: Instant, expiresAt: Instant?): TeamCreationCode =
        TeamCreationCode(code, createdAt, expiresAt, null, null, null)
    override fun delete(code: CreationCode) = Unit
}

// Both the provisioner and the registrar append to one shared log so tests can assert ordering
// (provision-first) as well as whether each step ran at all.
private class RecordingProvisioner(private val calls: MutableList<String>, private val fail: Boolean = false) :
    TenantProvisioningGateway {
    override fun provisionTenant(schemaName: SchemaName) {
        if (fail) throw IllegalStateException("provision boom")
        calls += "provision:$schemaName"
    }
}

private class RecordingRegistrar(
    private val calls: MutableList<String>,
    private val directory: TeamDirectory,
    private val founder: UserId,
) : TeamRegistrationGateway {
    override fun register(
        creationCode: CreationCode,
        founderId: UUID,
        name: TeamName,
        slug: Slug,
        schemaName: SchemaName,
        now: Instant,
    ): TeamId {
        calls += "register:$slug"
        // What the real registrar commits in one transaction: the team row plus the founding admin.
        return directory.addTeam(name.value, slug.value).also { directory.join(founder, it, Role.ADMIN) }
    }
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
        val founderUser = User(id = founder, email = Email("founder@example.com"), displayName = DisplayName("Founder"))

        // The registrar is faked, so the directory has to be told what a successful register() would
        // have written: the Team row and the founder's ADMIN membership. Handing that to
        // RecordingRegistrar keeps "the founder is a Member as of register()" true here too — which is
        // exactly the precondition the Active Team switch that follows it depends on.
        fun fixture(
            calls: MutableList<String> = mutableListOf(),
            existingSlugs: Set<Slug> = emptySet(),
            redeemable: Boolean = true,
            provisionFails: Boolean = false,
            user: User? = founderUser,
            notifier: TeamNotificationGateway = RecordingNotifier(),
        ): Triple<TeamDirectory, RecordingTenantRoutingGateway, TeamService> {
            val directory = TeamDirectory()
            existingSlugs.forEach { directory.addTeam(it.value, it.value) }
            val gateway = RecordingTenantRoutingGateway()
            val service = TeamService(
                teamRepository = directory.teamRepository(),
                creationCodeRepository = FakeCodeRepo(redeemable),
                tenantProvisioningGateway = RecordingProvisioner(calls, provisionFails),
                teamRegistrationGateway = RecordingRegistrar(calls, directory, founder),
                userRepository = directory.userRepository(*listOfNotNull(user).toTypedArray()),
                teamNotificationGateway = notifier,
                activeTeamService = directory.activeTeamService(gateway, *listOfNotNull(user).toTypedArray()),
                clock = clock,
            )
            return Triple(directory, gateway, service)
        }

        fun service(
            calls: MutableList<String> = mutableListOf(),
            existingSlugs: Set<Slug> = emptySet(),
            redeemable: Boolean = true,
            provisionFails: Boolean = false,
            user: User? = founderUser,
            notifier: TeamNotificationGateway = RecordingNotifier(),
        ) = fixture(calls, existingSlugs, redeemable, provisionFails, user, notifier).third

        test("creates the team: provisions the schema, registers, and returns id/name/slug") {
            val calls = mutableListOf<String>()
            val (directory, _, service) = fixture(calls)
            val created = service.createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))

            directory.summaryOf(created.id).slug shouldBe Slug("setpoint-vt")
            created.name shouldBe TeamName("Setpoint VT")
            created.slug shouldBe Slug("setpoint-vt")
            // Provision-first: the schema is created before the atomic register commits.
            calls shouldContainExactly listOf("provision:team_setpoint_vt", "register:setpoint-vt")
        }

        // ADR-0019 §3's 409 ALREADY_IN_TEAM is lifted (ADR-0023 §4): it existed only to match a
        // routing layer that could hold one Team per user, and that constraint is gone.
        test("a founder who already plays in a team may create another") {
            val calls = mutableListOf<String>()
            val (directory, _, service) = fixture(calls)
            directory.join(founder, directory.addTeam("Tovo Heren 5", "tovo-heren-5"))

            val created = service.createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))

            created.name shouldBe TeamName("Setpoint VT")
            calls shouldContainExactly listOf("provision:team_setpoint_vt", "register:setpoint-vt")
        }

        // Without this the founder would create a Team and stay routed to the one they were already
        // in — the new Team would exist and be invisible to the person who made it.
        test("the new team becomes the founder's Active Team") {
            val (directory, gateway, service) = fixture()
            directory.join(founder, directory.addTeam("Tovo Heren 5", "tovo-heren-5"))

            val created = service.createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))

            directory.rememberedTeamOf(founder) shouldBe created.id
            gateway.lastPinned.shouldNotBeNull().schemaName shouldBe directory.schemaOf(created.id)
        }

        test("rejects a blank name with 400 before any provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<InvalidTeamNameException> { service(calls).createTeam(founder, "   ", "valid-slug", CreationCode("GOODCODE")) }
            calls shouldBe emptyList()
        }

        test("rejects an invalid slug with 400 before any provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<InvalidSlugException> { service(calls).createTeam(founder, "Setpoint VT", "Bad Slug", CreationCode("GOODCODE")) }
            calls shouldBe emptyList()
        }

        test("rejects a taken slug with 409 before any provisioning") {
            val calls = mutableListOf<String>()
            shouldThrow<TeamSlugTakenException> {
                service(calls, existingSlugs = setOf(Slug("setpoint-vt")))
                    .createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))
            }
            calls shouldBe emptyList()
        }

        test("rejects a non-redeemable code with opaque 403 and does NOT provision a schema") {
            val calls = mutableListOf<String>()
            shouldThrow<InvalidCreationCodeException> {
                service(calls, redeemable = false)
                    .createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("BADCODE"))
            }
            // The peek gates provisioning — a bad code never leaves an orphan schema behind.
            calls shouldBe emptyList()
        }

        test("a provisioning failure propagates and no registration happens") {
            val calls = mutableListOf<String>()
            shouldThrow<RuntimeException> {
                service(calls, provisionFails = true).createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))
            }
            calls shouldBe emptyList() // provisioner threw before recording; register never reached
        }

        test("notifies the founder and audits the platform admins on success") {
            val notifier = RecordingNotifier()
            service(notifier = notifier).createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))

            notifier.created shouldContainExactly listOf(Triple("founder@example.com", "Setpoint VT", "setpoint-vt"))
            notifier.audited shouldContainExactly listOf(Triple("Setpoint VT", "setpoint-vt", "founder@example.com"))
        }

        test("a failing notifier never fails a committed creation (fire-and-forget)") {
            val (directory, _, service) = fixture(notifier = RecordingNotifier(throwing = true))
            val created = service.createTeam(founder, "Setpoint VT", "setpoint-vt", CreationCode("GOODCODE"))
            directory.summaryOf(created.id).name shouldBe TeamName("Setpoint VT")
        }
    }
}
