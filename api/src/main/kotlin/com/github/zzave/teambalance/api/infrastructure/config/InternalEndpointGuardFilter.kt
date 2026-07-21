package com.github.zzave.teambalance.api.infrastructure.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Profile
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.UrlPathHelper

/**
 * Launch blocker #5: in prod the API is a public origin (api.teambalance.nl) and no Spring Security
 * is wired, so anything served under the `/internal/` prefix — a future admin/provision endpoint,
 * plus the actuator's info/metrics — would be reachable from the internet. This filter fails those
 * requests closed with 403, allowing through only the health probe that Scaleway's Serverless
 * Container needs (`/internal/actuator/health`, with or without a trailing slash).
 *
 * The match is on the DECODED, NORMALIZED path (the same one the servlet container routes on), not
 * the raw request URI, so equivalent spellings — `//internal`, `/./internal`, a `%2e`-encoded prefix,
 * or `/internal/actuator/health/../metrics` — can't slip past the guard onto an internal handler.
 * `application-prod.yml` additionally narrows actuator exposure to `health`, so info/metrics are a
 * 404 there too — this filter is the defence-in-depth layer that also covers any future `/internal`.
 *
 * Prod-only (`@Profile("prod")`): dev keeps the full actuator, and e2e needs `/internal/e2e/...`.
 * Runs first (HIGHEST_PRECEDENCE) so it gates before any context-setup filter or handler.
 */
@Component
@Profile("prod")
@Order(Ordered.HIGHEST_PRECEDENCE)
class InternalEndpointGuardFilter : OncePerRequestFilter() {

    private val urlPathHelper = UrlPathHelper()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val path = StringUtils.cleanPath(urlPathHelper.getPathWithinApplication(request))
        val isInternal = path == INTERNAL_PREFIX || path.startsWith("$INTERNAL_PREFIX/")
        val isHealth = path.removeSuffix("/") == HEALTH_PATH
        if (isInternal && !isHealth) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN)
            return
        }
        filterChain.doFilter(request, response)
    }

    private companion object {
        // The private namespace convention. `/internal/actuator` (application.yml
        // management.endpoints.web.base-path) lives under it; a future admin surface would too.
        const val INTERNAL_PREFIX = "/internal"
        const val HEALTH_PATH = "/internal/actuator/health"
    }
}
