package com.github.zzave.teambalance.api.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Server side of the split-origin contract (launch blocker #3). In prod the SPA
 * (app.teambalance.nl) and landing page (teambalance.nl) call the API on api.teambalance.nl
 * cross-origin with the session cookie, so CORS must echo those origins and allow credentials.
 *
 * Origins come from `teambalance.cors.allowed-origins` (set in application-prod.yml). When the
 * property is empty — dev/test/e2e, where the SPA is same-origin behind the Vite proxy — no CORS
 * mapping is registered, so cross-origin requests are denied by default.
 */
@Configuration
class WebConfig(
    @Value("\${teambalance.cors.allowed-origins:}") allowedOrigins: List<String>,
) : WebMvcConfigurer {

    private val allowedOrigins = allowedOrigins.filter { it.isNotBlank() }

    override fun addCorsMappings(registry: CorsRegistry) {
        if (allowedOrigins.isEmpty()) return
        // Scope to the SPA contract only — /internal/actuator/** is never called cross-origin.
        registry.addMapping("/api/**")
            .allowedOrigins(*allowedOrigins.toTypedArray())
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
    }
}
