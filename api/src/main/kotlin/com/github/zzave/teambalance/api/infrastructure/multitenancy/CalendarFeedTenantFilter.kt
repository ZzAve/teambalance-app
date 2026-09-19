package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Component
import org.springframework.util.AntPathMatcher
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.UrlPathHelper

// After SessionUserContextFilter (+2), SessionTenantContextFilter (+3) and RateLimitFilter (+4), so
// the throttle still runs before any database work and so this filter's own clear-up happens inside
// the session filter's — it must not clear a tenant the session filter is still relying on.
private const val FILTER_ORDER = Ordered.HIGHEST_PRECEDENCE + 5

/**
 * Binds the tenant schema for the one endpoint that has no session to resolve it from: the
 * calendar-link feed, `GET /api/calendar/{teamSlug}/{token}.ics` (ADR-0032).
 *
 * [SessionTenantContextFilter] resolves the tenant from the authenticated user's Active Team, so for a
 * cookie-less request it resolves nothing at all — and `TenantContext` then routes tenant tables to a
 * schema that intentionally does not exist. The feed addresses its team by **slug** instead, which is
 * a different question and gets its own, deliberately tiny answer here.
 *
 * SECURITY: binding a schema from a caller-supplied slug grants nothing on its own. The slug is public
 * (it is in every team-scoped URL the SPA uses), and every row the feed goes on to serve is still
 * gated on a token that must hash to a link *in this schema*, on that link being live, and on its
 * owner still being a member. What this filter decides is only *which* team's links the presented
 * token will be matched against — and getting that wrong is a miss, not a leak.
 */
@Component
@Order(FILTER_ORDER)
class CalendarFeedTenantFilter(
    private val teamRepository: TeamRepository,
) : OncePerRequestFilter() {

    private val pathHelper = UrlPathHelper()
    private val pathMatcher = AntPathMatcher()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val bound = slugOf(request)?.let(::bind) == true
        try {
            filterChain.doFilter(request, response)
        } finally {
            // Only what this filter set: on any other request the session filter owns the context and
            // clearing it here would unbind a tenant mid-request.
            if (bound) TenantContext.clear()
        }
    }

    /**
     * Routing for the team at [slug], with **no membership check** — there is no authenticated user on
     * this request to check one against. That is [TeamRepository.findTenantRoutingUnchecked]'s second
     * and only other sanctioned caller; see its documentation for why that is safe here.
     */
    private fun bind(slug: Slug): Boolean =
        teamRepository.findBySlug(slug)
            ?.let { teamRepository.findTenantRoutingUnchecked(it.id) }
            ?.also { TenantContext.set(it.schemaName.value) } != null

    // Single `*` per segment, so the slug is exactly one segment and cannot walk out of the pattern.
    private fun slugOf(request: HttpServletRequest): Slug? =
        request.takeIf { it.method == HttpMethod.GET.name() }
            ?.let { StringUtils.cleanPath(pathHelper.getPathWithinApplication(it)) }
            ?.takeIf { pathMatcher.match(FEED_PATTERN, it) }
            ?.let { pathMatcher.extractUriTemplateVariables(FEED_TEMPLATE, it)["teamSlug"] }
            ?.takeIf { it.isNotBlank() }
            ?.let(::Slug)

    private companion object {
        const val FEED_PATTERN = "/api/calendar/*/*.ics"
        const val FEED_TEMPLATE = "/api/calendar/{teamSlug}/{token}.ics"
    }
}
