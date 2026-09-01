package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException
import com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamNaming
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import com.github.zzave.teambalance.api.domain.port.TeamNotificationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRegistrationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Instant

/** The newly created team, as returned to the founder (schema_name is deliberately not exposed). */
data class CreatedTeam(val id: TeamId, val name: TeamName, val slug: Slug)

/**
 * Self-service team creation (issue #154, ADR-0019). A logged-in, teamless user creates a team from a
 * name + a one-time creation code and becomes its founding admin.
 *
 * Ordering is deliberately provision-first so a partial failure never strands a consumed code:
 *  1. validate the name + user-supplied slug and derive the tenant schema name (bad name/slug → 400);
 *  2. pre-check slug uniqueness and code redeemability (fast, clean 409 / opaque 403 before any writes);
 *  3. provision the tenant schema (idempotent, on its own connection — commits independently);
 *  4. atomically consume the code and insert the team + founding admin ([TeamRegistrationGateway]);
 *  5. make the new Team the founder's Active Team, so they land in what they just created.
 *
 * If step 3 fails nothing is consumed and the user simply retries. If step 4 loses a race (code taken
 * or slug collision) the only residue is a harmless empty orphan schema, self-healed by the startup
 * migration runner. Notifications are best-effort and can never fail a committed creation.
 *
 * The founder need not be teamless: ADR-0023 lifted ADR-0019 §3's `409 ALREADY_IN_TEAM` along with
 * the one-team routing constraint behind it.
 */
class TeamService(
    private val teamRepository: TeamRepository,
    private val creationCodeRepository: TeamCreationCodeRepository,
    private val tenantProvisioningGateway: TenantProvisioningGateway,
    private val teamRegistrationGateway: TeamRegistrationGateway,
    private val userRepository: UserRepository,
    private val teamNotificationGateway: TeamNotificationGateway,
    private val activeTeamService: ActiveTeamService,
    private val platformAdminGateway: PlatformAdminGateway,
    private val clock: Clock,
) {
    private val log = LoggerFactory.getLogger(TeamService::class.java)

    fun createTeam(founderId: UserId, rawName: String, rawSlug: String, creationCode: CreationCode): CreatedTeam {
        val names = TeamNaming.validate(rawName, rawSlug)
        requireSlugAvailable(names.slug)

        val now = clock.instant()
        // Peek before provisioning so an obviously-bad code is rejected without leaving an orphan
        // schema behind. The authoritative, race-free consume happens inside register().
        requireRedeemable(creationCode, now)

        tenantProvisioningGateway.provisionTenant(names.schemaName)

        val teamId = teamRegistrationGateway.register(
            creationCode = creationCode,
            founderId = founderId.value,
            name = names.name,
            slug = names.slug,
            schemaName = names.schemaName,
            now = now,
        )

        // Without this a founder who already plays elsewhere stays routed to their old Team.
        activeTeamService.activate(founderId, teamId)

        notifyBestEffort(founderId, names.name, names.slug)

        return CreatedTeam(id = teamId, name = names.name, slug = names.slug)
    }

    /**
     * Memberless team creation by a Platform Admin (ADR-0024 §5, issue #240): provision the tenant
     * schema and insert the `teams` row with **no `team_members` rows at all**. The admin does not
     * become a member or a founder — the platform account is structurally teamless (ADR-0024 §3) — and
     * the new team is deliberately **not** made their Active Team: they enter it via act-as, prepare it,
     * and hand it over with an ADMIN invite link.
     *
     * Gated by the platform-admin allowlist, the same gate the rest of `/admin` carries — a stronger
     * gate than a creation code, so no code is required here. [adminId] is recorded as the team's
     * creator for provenance (who created which team, when).
     *
     * Provision-first, mirroring [createTeam]: a failed insert leaves at worst a harmless empty orphan
     * schema, self-healed by the startup runner. Notifications are best-effort and never fail creation.
     */
    fun createMemberlessTeam(adminId: UserId, rawName: String, rawSlug: String): CreatedTeam {
        platformAdminGateway.requirePlatformAdmin(adminId.value)

        val names = TeamNaming.validate(rawName, rawSlug)
        requireSlugAvailable(names.slug)

        tenantProvisioningGateway.provisionTenant(names.schemaName)

        val teamId = teamRegistrationGateway.registerMemberless(
            createdBy = adminId.value,
            name = names.name,
            slug = names.slug,
            schemaName = names.schemaName,
            now = clock.instant(),
        )

        notifyCreatedBestEffort(adminId, names.name, names.slug)

        return CreatedTeam(id = teamId, name = names.name, slug = names.slug)
    }

    private fun requireSlugAvailable(slug: Slug) {
        if (teamRepository.existsBySlug(slug)) {
            // The exception carries the slug for its message only, so it takes the primitive.
            throw TeamSlugTakenException(slug.value)
        }
    }

    private fun requireRedeemable(creationCode: CreationCode, now: Instant) {
        if (!creationCodeRepository.isRedeemable(creationCode, now)) {
            throw InvalidCreationCodeException()
        }
    }

    /**
     * Emits the creator + audit notifications. The team is already committed, so nothing here may
     * propagate: a notifier is contractually fire-and-forget, and this extra guard also stops an
     * unexpected failure (e.g. resolving the founder's email) from turning a successful creation into
     * a 500 — hence the deliberately broad catch.
     */
    @Suppress("TooGenericExceptionCaught")
    private fun notifyBestEffort(founderId: UserId, teamName: TeamName, teamSlug: Slug) {
        try {
            val founderEmail = userRepository.findById(founderId)?.email ?: return
            // Notifications are plain text for humans, so the value objects unwrap here — the same
            // treatment [Email] already gets at this port.
            teamNotificationGateway.teamCreated(founderEmail.value, teamName.value, teamSlug.value)
            teamNotificationGateway.creationCodeConsumed(teamName.value, teamSlug.value, founderEmail.value)
        } catch (e: Exception) {
            log.warn("Post-create notifications failed for team '{}' (creation succeeded)", teamSlug, e)
        }
    }

    /**
     * The memberless creator confirmation — just "the team is created", no code-consumed audit (no
     * code was spent). Best-effort for the same reason as [notifyBestEffort]: the team is committed, so
     * a failure to resolve the admin's email or send mail must never turn a success into a 500.
     */
    @Suppress("TooGenericExceptionCaught")
    private fun notifyCreatedBestEffort(creatorId: UserId, teamName: TeamName, teamSlug: Slug) {
        try {
            val creatorEmail = userRepository.findById(creatorId)?.email ?: return
            teamNotificationGateway.teamCreated(creatorEmail.value, teamName.value, teamSlug.value)
        } catch (e: Exception) {
            log.warn("Post-create notification failed for team '{}' (creation succeeded)", teamSlug, e)
        }
    }
}
