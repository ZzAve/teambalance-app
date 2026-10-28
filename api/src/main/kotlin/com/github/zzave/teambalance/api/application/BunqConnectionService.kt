package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BunqConnectDisabledException
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.slf4j.LoggerFactory
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.util.Base64
import java.util.UUID

enum class BunqConnectResult { CONNECTED, DECLINED, FAILED }

/** What the callback did, and the team it concerned if the `state` named one. */
data class BunqConnectOutcome(val result: BunqConnectResult, val teamSlug: Slug?)

data class BunqConnectionStatus(val connectAvailable: Boolean, val connected: Boolean)

/**
 * What connecting needs: the cipher the grant is encrypted with and the callback URL Bunq returns the
 * browser to. It exists only while `teambalance.bunq.connect-enabled` is true; the key itself is read
 * at startup in every profile (see BunqGrantCipherConfiguration), so a deployment with connecting off
 * still needs it.
 */
class BunqConnectConfig(val grantCipher: TokenCipher, val callbackUrl: String)

/**
 * How a team Admin connects the team's Bunq account through OAuth (ADR-0042). [start] and [status] are
 * Admin-only; act-as counts as Admin. [connectConfig] is null when connecting is switched off.
 *
 * [complete] runs on the browser's return from Bunq, which names no team. The credential there is the
 * single-use `state` minted by [start]: it is looked up by hash, spent *before* the code is exchanged
 * so a replay never exchanges twice, and says which Admin started it for which team. The write then
 * goes to that team's tenant through [TenantScopeGateway], after the Admin's rights are checked again,
 * since they may have been demoted in the minutes in between.
 */
@Suppress("LongParameterList")
class BunqConnectionService(
    private val connectionRepository: BunqConnectionRepository,
    private val stateRepository: BunqOAuthStateRepository,
    private val bunqGateway: BunqGateway,
    private val tenantScopeGateway: TenantScopeGateway,
    private val teamRepository: TeamRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val actAsService: ActAsService,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
    private val connectConfig: BunqConnectConfig?,
) {
    companion object {
        /** Where Bunq sends the browser back to; the API's own origin is prefixed by the composition root. */
        const val CALLBACK_PATH = "/api/bunq/oauth/callback"

        private const val ACCESS_DENIED = "access_denied"
        private val STATE_TTL: Duration = Duration.ofMinutes(10)
        private val STATE_RETENTION: Duration = Duration.ofDays(1)
        private const val STATE_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()
        private val log = LoggerFactory.getLogger(BunqConnectionService::class.java)
    }

    fun status(callerId: UserId, teamId: TeamId): BunqConnectionStatus {
        authorizationService.requireAdmin(callerId, teamId)
        return BunqConnectionStatus(connectAvailable = connectConfig != null, connected = connectionRepository.find() != null)
    }

    /** The Bunq page where the Admin approves. Allowed while connected: the new grant replaces the old. */
    fun start(callerId: UserId, teamId: TeamId): String {
        val config = connectConfig ?: throw BunqConnectDisabledException()
        authorizationService.requireAdmin(callerId, teamId)
        val now = clock.instant()
        // Housekeeping on the way in: the container scales to zero, so there is no scheduler to do it.
        stateRepository.deleteExpiredBefore(now.minus(STATE_RETENTION))
        val state = generateState()
        stateRepository.save(
            BunqOAuthState(
                id = UUID.randomUUID(),
                tokenHash = hash(state),
                teamId = teamId,
                adminUserId = callerId,
                expiresAt = now.plus(STATE_TTL),
                usedAt = null,
                createdAt = now,
            ),
        )
        return bunqGateway.authorizationUrl(state, config.callbackUrl)
    }

    /**
     * Finishes a connection from what Bunq put on the callback. [sessionUser] is the signed-in user of
     * the browser and must be the Admin who started the flow: otherwise an Admin could hand their
     * authorize link to someone else, and whatever Bunq account that person approved would be connected
     * to the Admin's team. The state is the credential in addition to the session, not instead of it.
     * Nothing is connected once connecting has been switched off, whenever the state was minted.
     *
     * Every refusal is a [BunqConnectResult.FAILED] outcome, never an exception, and an unknown,
     * expired or already used state is not told apart from the others.
     */
    fun complete(state: String?, code: String?, error: String?, sessionUser: UserId?): BunqConnectOutcome =
        guarded(teamId = null, teamSlug = null) {
            val pending = state?.let { stateRepository.findByTokenHash(hash(it)) } ?: return@guarded failed(null)
            val teamSlug = teamRepository.findById(pending.teamId)?.slug
            guarded(pending.teamId, teamSlug) {
                val routing = if (connectConfig != null && spend(pending)) routingForAdmin(pending, sessionUser) else null
                when {
                    connectConfig == null || routing == null -> failed(teamSlug)
                    error == ACCESS_DENIED -> BunqConnectOutcome(BunqConnectResult.DECLINED, teamSlug)
                    error != null || code == null -> failed(teamSlug)
                    else -> connect(connectConfig, pending, BunqAuthorizationCode(code), routing, teamSlug)
                }
            }
        }

    /** The callback must always answer with a redirect, so anything unexpected ends as a failed outcome. */
    @Suppress("TooGenericExceptionCaught")
    private inline fun guarded(teamId: TeamId?, teamSlug: Slug?, block: () -> BunqConnectOutcome): BunqConnectOutcome =
        try {
            block()
        } catch (e: Exception) {
            // Class name only: a message may carry secrets.
            log.warn("Completing the Bunq connection for team $teamId failed: ${e.javaClass.simpleName}")
            failed(teamSlug)
        }

    /** Marks a live, unused state as used. False for an expired or already used one, and for the loser of a race. */
    private fun spend(pending: BunqOAuthState): Boolean {
        val now = clock.instant()
        return pending.usedAt == null && pending.expiresAt.isAfter(now) && stateRepository.consume(pending.id, now)
    }

    /**
     * Where the Admin's work lands, or null when they may not connect this team any more or the
     * browser has no session or one that is somebody else's. The lookup is membership-checked, with act-as as the only
     * other way in.
     */
    private fun routingForAdmin(pending: BunqOAuthState, sessionUser: UserId?): TenantRouting? =
        pending.takeIf { sessionUser == it.adminUserId }
            ?.takeIf { authorizationService.isAdmin(it.adminUserId, it.teamId) }
            ?.let {
                teamMemberRepository.findTenantRouting(it.teamId, it.adminUserId)
                    ?: (actAsService.resolve(it.adminUserId) as? ActAsResolution.Active)
                        ?.routing?.takeIf { routing -> routing.teamId == it.teamId }
            }

    @Suppress("TooGenericExceptionCaught")
    private fun connect(
        config: BunqConnectConfig,
        pending: BunqOAuthState,
        code: BunqAuthorizationCode,
        routing: TenantRouting,
        teamSlug: Slug?,
    ): BunqConnectOutcome {
        return try {
            val grant = bunqGateway.exchangeCode(code, config.callbackUrl)
            // TRACER SHORTCUT (3.1), removed in 3.2 where the Admin picks the account: when the grant
            // covers exactly one account that account becomes the pool, and anything else fails the
            // connection. The pick step replaces this line, not the code around it.
            val account = bunqGateway.listAccounts(grant).singleOrNull() ?: return failed(teamSlug)
            val now = clock.instant()
            tenantScopeGateway.within(routing) {
                connectionRepository.save(
                    BunqConnection(
                        accountId = account.id,
                        connectedAt = now,
                        grant = config.grantCipher.encrypt(grant.accessToken),
                        connectedBy = pending.adminUserId,
                    ),
                )
            }
            BunqConnectOutcome(BunqConnectResult.CONNECTED, teamSlug)
        } catch (e: Exception) {
            // Class name only: a client's exception message may carry the code or the token.
            log.warn("Connecting Bunq for team ${pending.teamId} failed: ${e.javaClass.simpleName}")
            failed(teamSlug)
        }
    }

    private fun failed(teamSlug: Slug?) = BunqConnectOutcome(BunqConnectResult.FAILED, teamSlug)

    private fun generateState(): String {
        val bytes = ByteArray(STATE_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun hash(state: String): TokenHash = TokenHash.unsalted(state)
}
