package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.AlreadyInTeamException
import com.github.zzave.teambalance.api.domain.exception.InvalidCreationCodeException
import com.github.zzave.teambalance.api.domain.exception.TeamSlugTakenException
import com.github.zzave.teambalance.api.domain.model.TeamNaming
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import com.github.zzave.teambalance.api.domain.port.TeamNotifier
import com.github.zzave.teambalance.api.domain.port.TeamRegistrar
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TenantProvisioner
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.Instant
import java.util.UUID

/** The newly created team, as returned to the founder (schema_name is deliberately not exposed). */
data class CreatedTeam(val id: UUID, val name: String, val slug: String)

/**
 * Self-service team creation (issue #154, ADR-0015). A logged-in, teamless user creates a team from a
 * name + a one-time creation code and becomes its founding admin.
 *
 * Ordering is deliberately provision-first so a partial failure never strands a consumed code:
 *  1. reject if the caller already belongs to a team (v1 one-team-per-user, #143);
 *  2. derive + validate the slug / tenant schema name (bad name → 400);
 *  3. pre-check slug uniqueness and code redeemability (fast, clean 409 / opaque 403 before any writes);
 *  4. provision the tenant schema (idempotent, on its own connection — commits independently);
 *  5. atomically consume the code and insert the team + founding admin ([TeamRegistrar]).
 *
 * If step 4 fails nothing is consumed and the user simply retries. If step 5 loses a race (code taken
 * or slug collision) the only residue is a harmless empty orphan schema, self-healed by the startup
 * migration runner. Notifications are best-effort and can never fail a committed creation.
 */
@Service
class TeamService(
    private val teamMemberRepository: TeamMemberRepository,
    private val teamRepository: TeamRepository,
    private val creationCodeRepository: TeamCreationCodeRepository,
    private val tenantProvisioner: TenantProvisioner,
    private val teamRegistrar: TeamRegistrar,
    private val userRepository: UserRepository,
    private val teamNotifier: TeamNotifier,
    private val clock: Clock,
) {
    private val log = LoggerFactory.getLogger(TeamService::class.java)

    fun createTeam(founderId: UUID, rawName: String, creationCode: String): CreatedTeam {
        requireTeamless(founderId)
        val names = TeamNaming.derive(rawName)
        requireSlugAvailable(names.slug)

        val now = clock.instant()
        // Peek before provisioning so an obviously-bad code is rejected without leaving an orphan
        // schema behind. The authoritative, race-free consume happens inside register().
        requireRedeemable(creationCode, now)

        tenantProvisioner.provisionTenant(names.schemaName)

        val teamId = teamRegistrar.register(
            creationCode = creationCode,
            founderId = founderId,
            name = names.name,
            slug = names.slug,
            schemaName = names.schemaName,
            now = now,
        )

        notifyBestEffort(founderId, names.name, names.slug)

        return CreatedTeam(id = teamId, name = names.name, slug = names.slug)
    }

    private fun requireTeamless(founderId: UUID) {
        teamMemberRepository.findTeamId(founderId)?.let { throw AlreadyInTeamException(founderId) }
    }

    private fun requireSlugAvailable(slug: String) {
        if (teamRepository.existsBySlug(slug)) {
            throw TeamSlugTakenException(slug)
        }
    }

    private fun requireRedeemable(creationCode: String, now: Instant) {
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
    private fun notifyBestEffort(founderId: UUID, teamName: String, teamSlug: String) {
        try {
            val founderEmail = userRepository.findById(founderId)?.email ?: return
            teamNotifier.teamCreated(founderEmail, teamName, teamSlug)
            teamNotifier.creationCodeConsumed(teamName, teamSlug, founderEmail)
        } catch (e: Exception) {
            log.warn("Post-create notifications failed for team '{}' (creation succeeded)", teamSlug, e)
        }
    }
}
