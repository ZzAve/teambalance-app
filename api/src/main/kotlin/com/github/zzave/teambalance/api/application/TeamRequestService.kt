package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.TeamRequestNotFoundException
import com.github.zzave.teambalance.api.domain.exception.TeamRequestNotPendingException
import com.github.zzave.teambalance.api.domain.exception.TeamRequestPendingException
import com.github.zzave.teambalance.api.domain.model.PlatformAdminAllowlist
import com.github.zzave.teambalance.api.domain.model.TeamNaming
import com.github.zzave.teambalance.api.domain.model.TeamRequestEntry
import com.github.zzave.teambalance.api.domain.model.TeamRequestPurpose
import com.github.zzave.teambalance.api.domain.model.TeamRequestReason
import com.github.zzave.teambalance.api.domain.model.TeamRequestStatus
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamRequestRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.temporal.ChronoUnit
import java.util.UUID

/**
 * A signed-in user asks for a team and a Platform Admin decides (ADR-0047). Approving mints a creation
 * code that expires in [TeamRequestEntry.CODE_VALIDITY_DAYS] days; the code stays the only gate to a tenant schema.
 *
 * SECURITY CONTRACT: every `callerId` MUST be the authenticated principal, never a request-supplied id.
 * The decision methods are gated on [PlatformAdminGateway] (fail-closed). Mails go out after the
 * write has committed and are best-effort: a failed mail never undoes a stored request or decision.
 */
class TeamRequestService(
    private val repository: TeamRequestRepository,
    private val userRepository: UserRepository,
    private val platformAdminGateway: PlatformAdminGateway,
    private val platformAdmins: PlatformAdminAllowlist,
    private val emailGateway: EmailGateway,
    private val clock: Clock,
) {
    private val log = LoggerFactory.getLogger(TeamRequestService::class.java)

    fun submit(callerId: UserId, rawTeamName: String, rawPurpose: String): TeamRequestEntry {
        val teamName = TeamNaming.validatedName(rawTeamName)
        val purpose = TeamRequestPurpose(rawPurpose)
        // An approved, still-usable code counts as open too: ask again only once it is used or expired (ADR-0047).
        // shortcut: check-then-insert, not race-proof; a double submit in that window only adds a second request.
        if (repository.findLatestByUser(callerId)?.usableCode(clock.instant()) != null) {
            throw TeamRequestPendingException()
        }
        val request = repository.insertPending(callerId, teamName, purpose, clock.instant())
        platformAdmins.all().forEach { admin ->
            bestEffort("new-request mail to $admin") {
                emailGateway.sendTeamRequested(admin, request.requesterEmail, teamName.value, purpose.value)
            }
        }
        bestEffort("received mail for ${request.id}") {
            emailGateway.sendTeamRequestReceived(request.requesterEmail, teamName.value, purpose.value, languageOf(request))
        }
        return request
    }

    fun mine(callerId: UserId): TeamRequestEntry? = repository.findLatestByUser(callerId)

    fun list(callerId: UserId): List<TeamRequestEntry> {
        platformAdminGateway.requirePlatformAdmin(callerId.value)
        return repository.findForAdmin(DECIDED_LIMIT)
    }

    fun approve(callerId: UserId, id: UUID): TeamRequestEntry {
        platformAdminGateway.requirePlatformAdmin(callerId.value)
        requirePending(id)
        val now = clock.instant()
        val approved = repository.approve(
            id = id,
            decidedBy = callerId,
            code = CreationCodeAdminService.generateCode(),
            now = now,
            codeExpiresAt = now.plus(TeamRequestEntry.CODE_VALIDITY_DAYS, ChronoUnit.DAYS),
        )
        bestEffort("approved mail for $id") {
            emailGateway.sendTeamRequestApproved(
                approved.requesterEmail,
                approved.teamName.value,
                checkNotNull(approved.creationCode).code,
                languageOf(approved),
            )
        }
        return approved
    }

    fun reject(callerId: UserId, id: UUID, rawReason: String?): TeamRequestEntry {
        platformAdminGateway.requirePlatformAdmin(callerId.value)
        val reason = TeamRequestReason.ofOrNull(rawReason)
        requirePending(id)
        val rejected = repository.reject(id, callerId, reason, clock.instant())
        bestEffort("rejected mail for $id") {
            emailGateway.sendTeamRequestRejected(
                rejected.requesterEmail,
                rejected.teamName.value,
                reason?.value,
                languageOf(rejected),
            )
        }
        return rejected
    }

    // 404 for an unknown id; the not-pending 409 is raised by the repository's conditional update, so a
    // decision racing this check is refused too.
    private fun requirePending(id: UUID) {
        val request = repository.findById(id) ?: throw TeamRequestNotFoundException(id)
        if (request.status != TeamRequestStatus.PENDING) {
            throw TeamRequestNotPendingException(id)
        }
    }

    private fun languageOf(request: TeamRequestEntry) =
        emailLanguage(userRepository.findLanguage(request.requesterId), null)

    @Suppress("TooGenericExceptionCaught")
    private fun bestEffort(description: String, send: () -> Unit) {
        try {
            send()
        } catch (e: Exception) {
            log.warn("Team request mail failed ({}) - ignored", description, e)
        }
    }

    private companion object {
        private const val DECIDED_LIMIT = 20
    }
}
