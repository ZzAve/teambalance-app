package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BunqServer
import com.bunq.sdk.Config
import com.bunq.sdk.Context
import com.bunq.sdk.SigningKeys
import tools.jackson.databind.json.JsonMapper
import java.time.Instant

/**
 * The SDK has no serializer for a [Context]; it asks the caller to store every field and rebuild it. The result holds the
 * session and installation tokens, the API key (for a team, its OAuth access token) and the private signing key, so it is
 * stored only encrypted. The server and service name are not stored: they come from the configuration of the running app.
 */
internal object BunqApiContextCodec {
    private val mapper = JsonMapper.builder().build()

    fun encode(context: Context): String = mapper.writeValueAsString(
        mapOf(
            SERVER_PUBLIC_KEY to context.serverPublicKey,
            DEVICE_ID to context.deviceId,
            SESSION_ID to context.sessionId,
            SESSION_TOKEN to context.sessionToken,
            USER_ID to context.userId,
            SESSION_EXPIRY_TIME to context.sessionExpiryTime.toString(),
            INSTALLATION_TOKEN to context.installationToken,
            API_KEY to context.config.apiKey,
            PRIVATE_KEY to context.config.signingKeys.privateKeyAsPem(),
            PUBLIC_KEY to context.config.signingKeys.publicKeyAsPem(),
        ),
    )

    /** Fails with a message that quotes nothing from [json], which holds secrets. */
    @Suppress("TooGenericExceptionCaught", "SwallowedException")
    fun decode(json: String, server: BunqServer, serviceName: String): Context =
        try {
            val fields = mapper.readTree(json)
            fun text(name: String) = fields.get(name).asString()
            fun number(name: String) = fields.get(name).asLong()
            Context(
                serverPublicKey = text(SERVER_PUBLIC_KEY),
                deviceId = number(DEVICE_ID),
                sessionId = number(SESSION_ID),
                sessionToken = text(SESSION_TOKEN),
                userId = number(USER_ID),
                sessionExpiryTime = Instant.parse(text(SESSION_EXPIRY_TIME)),
                installationToken = text(INSTALLATION_TOKEN),
                config = Config(server, serviceName, text(API_KEY), SigningKeys.FromPem(text(PRIVATE_KEY), text(PUBLIC_KEY))),
            )
        } catch (e: Exception) {
            throw IllegalStateException("The stored Bunq API context cannot be read (${e.javaClass.simpleName})")
        }

    private const val SERVER_PUBLIC_KEY = "serverPublicKey"
    private const val DEVICE_ID = "deviceId"
    private const val SESSION_ID = "sessionId"
    private const val SESSION_TOKEN = "sessionToken"
    private const val USER_ID = "userId"
    private const val SESSION_EXPIRY_TIME = "sessionExpiryTime"
    private const val INSTALLATION_TOKEN = "installationToken"
    private const val API_KEY = "apiKey"
    private const val PRIVATE_KEY = "privateKey"
    private const val PUBLIC_KEY = "publicKey"
}
