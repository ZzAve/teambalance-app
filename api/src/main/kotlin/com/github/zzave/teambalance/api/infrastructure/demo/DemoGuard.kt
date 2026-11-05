package com.github.zzave.teambalance.api.infrastructure.demo

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.net.URI

private val LOOPBACK_HOSTS = setOf("127.0.0.1", "localhost")

/** Null when the environment is safe for the demo, else the reason the app must not start. */
internal fun demoBootRefusal(enabled: Boolean, emailSend: Boolean, bunqEnvironment: String, jdbcUrl: String): String? =
    when {
        !enabled -> null
        emailSend -> "teambalance.demo.enabled needs teambalance.email.send=false"
        // shortcut: slice 0 has no `fake` Bunq environment yet; slice 2 replaces "none" with "fake" here.
        !bunqEnvironment.equals("none", ignoreCase = true) -> "teambalance.demo.enabled needs teambalance.bunq.environment=none"
        jdbcHost(jdbcUrl) !in LOOPBACK_HOSTS ->
            "teambalance.demo.enabled needs a loopback datasource host (127.0.0.1 or localhost)"
        else -> null
    }

private fun jdbcHost(jdbcUrl: String): String? =
    runCatching { URI(jdbcUrl.removePrefix("jdbc:")).host }.getOrNull()

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
) {
    init {
        demoBootRefusal(enabled, emailSend, bunqEnvironment, jdbcUrl)?.let { error(it) }
    }
}
