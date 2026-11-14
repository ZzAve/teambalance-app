package com.github.zzave.teambalance.api.infrastructure.config

import io.micrometer.observation.ObservationPredicate
import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.server.observation.ServerRequestObservationContext
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

/**
 * Scaleway's liveness probe calls `/internal/actuator/health` every 10 seconds. Its requests make no
 * observations, so they add no traces to Tempo and no `http.server.requests` series to the metrics.
 *
 * The HTTP server observation starts before the request is bound to [RequestContextHolder], so it is
 * matched on its own request. The observations made inside the request (Spring Security's) are
 * matched on the bound request: without them, they would be pushed as root traces of their own.
 */
@Configuration
class HealthProbeObservationConfiguration {

    @Bean
    fun skipHealthProbeObservations() = ObservationPredicate { _, context ->
        val request = (context as? ServerRequestObservationContext)?.carrier ?: boundRequest()
        request?.requestURI?.startsWith(HEALTH_PATH) != true
    }

    private fun boundRequest(): HttpServletRequest? =
        (RequestContextHolder.getRequestAttributes() as? ServletRequestAttributes)?.request

    private companion object {
        const val HEALTH_PATH = "/internal/actuator/health"
    }
}
