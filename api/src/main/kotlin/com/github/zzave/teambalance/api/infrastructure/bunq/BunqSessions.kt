package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BunqServer
import com.bunq.sdk.BunqSigningKeysGenerator
import com.bunq.sdk.Config
import com.bunq.sdk.Context
import com.bunq.sdk.bunqClient
import com.bunq.sdk.generated.Client
import com.bunq.sdk.initContext
import com.bunq.sdk.refreshSession
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import org.slf4j.LoggerFactory
import java.security.MessageDigest
import java.util.HexFormat
import java.util.concurrent.ConcurrentHashMap

/**
 * One access token's API session at Bunq: the SDK client, and the [Context] it currently holds. The SDK keeps the refreshed
 * context inside the client and reports it through the callback, which is where [context] is updated from. [persisted]
 * is the context last read from or written to the store, so that only a changed one is written.
 */
internal class BunqSession(initial: Context, @Volatile var persisted: Context?) {
    @Volatile
    var context: Context = initial
        private set

    @Volatile
    var client: Client = clientFor(initial)
        private set

    val userId: Long get() = context.userId

    fun adopt(refreshed: Context) {
        context = refreshed
        client = clientFor(refreshed)
    }

    private fun clientFor(from: Context): Client = bunqClient(from) { context = it }
}

/**
 * The sessions in use by this instance, one per access token (a team has one), and where they are kept for the others.
 *
 * Setting up a session is an installation, a device and a session (three POSTs that Bunq limits to about ten a day), so it
 * happens once per access token: a session is taken from memory, else from the [store] (written by any instance), else set
 * up and then stored. The stored copy is used only if it was made for this very access token. Sessions are keyed by a hash
 * of the token, which is how this works without knowing which team it is for: a new connection has a new token.
 */
internal class BunqSessions(
    private val server: BunqServer,
    private val serviceName: String,
    private val store: BunqApiContextRepository,
    private val cipher: TokenCipher,
    private val calls: BunqCalls,
) {
    // A holder per access token that sets the session up on first use, so that a slow setup holds up only the readers of that
    // token and not the map.
    private val sessions = ConcurrentHashMap<String, Lazy<BunqSession>>()

    fun sessionFor(grant: BunqGrant): BunqSession =
        sessions.computeIfAbsent(keyOf(grant)) { lazy { restored(grant) ?: setUp(grant) } }.value

    /**
     * Stores the session's context if it differs from what the store holds, and only on the connection row that holds the
     * session's own access token. The tenant in scope may be another team's (the Admin's active team while connecting), and
     * the row may have been replaced by a reconnect since this session was made: then nothing is written and the session
     * stays unstored, to be written by a later read that finds its own row. Never fails the read it follows.
     */
    @Suppress("TooGenericExceptionCaught")
    fun persistIfChanged(session: BunqSession) {
        val current = session.context
        if (current === session.persisted) return
        try {
            val row = store.find()
            if (row != null && cipher.decrypt(row.grant) == current.config.apiKey &&
                store.save(cipher.encrypt(BunqApiContextCodec.encode(current)), ifGrant = row.grant)
            ) {
                session.persisted = current
            }
        } catch (e: Exception) {
            log.warn("Storing the Bunq API context failed: {}", e.javaClass.simpleName)
        }
    }

    /** Asks Bunq for a new session on the same installation and device. */
    fun refresh(session: BunqSession) {
        session.adopt(calls.run { session.context.refreshSession() })
    }

    fun forget(grant: BunqGrant) {
        sessions.remove(keyOf(grant))
    }

    @Suppress("TooGenericExceptionCaught")
    private fun restored(grant: BunqGrant): BunqSession? =
        try {
            store.find()
                ?.context
                ?.let { BunqApiContextCodec.decode(cipher.decrypt(it), server, serviceName) }
                ?.takeIf { it.config.apiKey == grant.accessToken }
                ?.let { BunqSession(it, persisted = it) }
        } catch (e: Exception) {
            log.warn("Reading the stored Bunq API context failed: {}", e.javaClass.simpleName)
            null
        }

    private fun setUp(grant: BunqGrant): BunqSession {
        val config = Config(server, serviceName, grant.accessToken, BunqSigningKeysGenerator.generateBunqSigningKeys())
        return BunqSession(calls.runSetup { initContext(config) }, persisted = null)
    }

    private fun keyOf(grant: BunqGrant): String =
        HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(grant.accessToken.toByteArray()))

    private companion object {
        val log = LoggerFactory.getLogger(BunqSessions::class.java)
    }
}
