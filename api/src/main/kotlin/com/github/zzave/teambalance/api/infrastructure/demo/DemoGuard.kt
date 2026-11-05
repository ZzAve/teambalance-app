package com.github.zzave.teambalance.api.infrastructure.demo

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.net.URI

private val LOOPBACK_HOSTS = setOf("127.0.0.1", "localhost")

/** Null when the environment is safe for the demo, else the reason the app must not start. */
internal fun demoBootRefusal(
    enabled: Boolean,
    emailSend: Boolean,
    bunqEnvironment: String,
    jdbcUrl: String,
    poolJdbcUrl: String = "",
): String? =
    when {
        !enabled -> null
        emailSend -> "teambalance.demo.enabled needs teambalance.email.send=false"
        // shortcut: slice 0 has no `fake` Bunq environment yet; slice 2 replaces "none" with "fake" here.
        !bunqEnvironment.equals("none", ignoreCase = true) -> "teambalance.demo.enabled needs teambalance.bunq.environment=none"
        // Hikari connects to spring.datasource.hikari.jdbc-url when it is set, so that URL is held to the same rule.
        !isLoopbackOnly(jdbcUrl) || (poolJdbcUrl.isNotBlank() && !isLoopbackOnly(poolJdbcUrl)) ->
            "teambalance.demo.enabled needs a loopback datasource host (127.0.0.1 or localhost) " +
                "and no host override in the query string"
        else -> null
    }

// pgjdbc lets these query parameters replace the host named in the URL's authority.
private val HOST_OVERRIDE_KEYS = setOf("pghost", "host", "service", "pgservice")

private fun isLoopbackOnly(jdbcUrl: String): Boolean {
    val host = runCatching { URI(jdbcUrl.removePrefix("jdbc:")).host }.getOrNull()
    val overridesHost = jdbcUrl.substringAfter('?', "").split('&')
        .any { it.substringBefore('=').lowercase() in HOST_OVERRIDE_KEYS }
    return host in LOOPBACK_HOSTS && !overridesHost
}

/**
 * Stops the application at startup when the demo switch is on in an environment that could reach real mail,
 * Bunq or data. All inputs are raw properties: EmailProperties exists under the prod profile only (its default
 * `send=true` is mirrored here), and BunqClientProperties belongs to another adapter package.
 */
@Component
class DemoGuard(
    @param:Value("\${teambalance.demo.enabled:false}") enabled: Boolean,
    @param:Value("\${teambalance.email.send:true}") emailSend: Boolean,
    @param:Value("\${teambalance.bunq.environment:none}") bunqEnvironment: String,
    @param:Value("\${spring.datasource.url}") jdbcUrl: String,
    @param:Value("\${spring.datasource.hikari.jdbc-url:}") poolJdbcUrl: String,
) {
    init {
        demoBootRefusal(enabled, emailSend, bunqEnvironment, jdbcUrl, poolJdbcUrl)?.let { error(it) }
    }
}
