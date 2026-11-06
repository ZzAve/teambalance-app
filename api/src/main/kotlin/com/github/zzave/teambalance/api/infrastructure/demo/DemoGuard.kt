package com.github.zzave.teambalance.api.infrastructure.demo

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.net.URI
import java.util.Locale

private val LOOPBACK_HOSTS = setOf("127.0.0.1", "localhost")

/** Null when the environment is safe for the demo, else the reason the app must not start. */
internal fun demoBootRefusal(
    enabled: Boolean,
    emailSend: Boolean,
    bunqEnvironment: String,
    jdbcUrl: String,
    poolJdbcUrl: String = "",
    dataSourceClassName: String = "",
    dataSourceJndi: String = "",
    jndiName: String = "",
): String? =
    when {
        !enabled -> null
        emailSend -> "teambalance.demo.enabled needs teambalance.email.send=false"
        !bunqEnvironment.equals("fake", ignoreCase = true) -> "teambalance.demo.enabled needs teambalance.bunq.environment=fake"
        // With either set, Hikari builds its own DataSource and ignores every URL.
        dataSourceClassName.isNotBlank() || dataSourceJndi.isNotBlank() ->
            "teambalance.demo.enabled needs a datasource without hikari.data-source-class-name or data-source-j-n-d-i"
        // Spring Boot then looks the DataSource up in JNDI and never reads the URL.
        jndiName.isNotBlank() -> "teambalance.demo.enabled needs a datasource without spring.datasource.jndi-name"
        // Hikari connects to spring.datasource.hikari.jdbc-url when it is set, so that URL is held to the same rule.
        !isLoopbackOnly(jdbcUrl) || (poolJdbcUrl.isNotBlank() && !isLoopbackOnly(poolJdbcUrl)) ->
            "teambalance.demo.enabled needs a loopback datasource host (127.0.0.1 or localhost) " +
                "and no host override in the query string"
        else -> null
    }

// pgjdbc lets these query parameters replace the host named in the URL's authority.
private val HOST_OVERRIDE_KEYS = setOf("PGHOST", "HOST", "SERVICE", "PGSERVICE")

private fun isLoopbackOnly(jdbcUrl: String): Boolean {
    val host = runCatching { URI(jdbcUrl.removePrefix("jdbc:")).host }.getOrNull()
    val overridesHost = jdbcUrl.substringAfter('?', "").split('&')
        .any { it.substringBefore('=').uppercase(Locale.ROOT) in HOST_OVERRIDE_KEYS } // as pgjdbc does
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
    @param:Value("\${spring.datasource.hikari.data-source-class-name:}") dataSourceClassName: String,
    @param:Value("\${spring.datasource.hikari.data-source-j-n-d-i:}") dataSourceJndi: String,
    @param:Value("\${spring.datasource.jndi-name:}") jndiName: String,
) {
    init {
        demoBootRefusal(enabled, emailSend, bunqEnvironment, jdbcUrl, poolJdbcUrl, dataSourceClassName, dataSourceJndi, jndiName)
            ?.let { error(it) }
    }
}
