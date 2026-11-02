package com.github.zzave.teambalance.api.infrastructure.bunq

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * The platform's OAuth client at Bunq, bound from `teambalance.bunq.*`. With an [environment] other than
 * [BunqEnvironment.NONE] the client id and secret must be set, so a half-configured deploy stops at startup.
 */
@ConfigurationProperties(prefix = "teambalance.bunq")
class BunqClientProperties(
    environment: BunqEnvironment?,
    val clientId: String,
    val clientSecret: String,
    /** Name Bunq shows for this client. */
    val serviceName: String,
) {
    /** An empty `TEAMBALANCE_BUNQ_ENVIRONMENT` binds as null and stops startup; only an unset one means [BunqEnvironment.NONE]. */
    val environment: BunqEnvironment = requireNotNull(environment) {
        "teambalance.bunq.environment is empty. Set TEAMBALANCE_BUNQ_ENVIRONMENT to none, sandbox or production, or leave it unset."
    }

    init {
        require(environment == BunqEnvironment.NONE || (clientId.isNotBlank() && clientSecret.isNotBlank())) {
            "teambalance.bunq.environment is $environment, so TEAMBALANCE_BUNQ_CLIENT_ID and TEAMBALANCE_BUNQ_CLIENT_SECRET " +
                "must both be set. Set TEAMBALANCE_BUNQ_ENVIRONMENT to none to run without Bunq."
        }
    }

    override fun toString(): String = "BunqClientProperties(environment=$environment, clientId=$clientId, clientSecret=****)"
}
