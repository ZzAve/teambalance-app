package com.github.zzave.teambalance.api.infrastructure.ratelimit

import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.util.AntPathMatcher
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.UrlPathHelper
import kotlin.math.ceil

// Just after SessionUserContextFilter (+2) and SessionTenantContextFilter (+3): the session→user
// resolution must have run so `accept` can be throttled per authenticated user. Named (not an inline
// `+ 4`) to keep the ordering legible next to the sibling filters and to satisfy detekt's MagicNumber.
private const val FILTER_ORDER = Ordered.HIGHEST_PRECEDENCE + 4

/**
 * Defense-in-depth throttle (#200) on the endpoints that either run pre-authentication or accept a
 * caller-supplied token: the magic-link request/verify pair and invitation `accept`. Not a live-vuln
 * fix — invite tokens are 256-bit and `accept` is auth-gated — but the app otherwise has no ceiling on
 * attempts, so this caps abuse before token entropy is the only thing standing in the way.
 *
 * A rejected request gets a `429` with a `Retry-After` (seconds) and the app's standard error body,
 * written directly here (this runs before dispatch, so it never reaches [GlobalExceptionHandler]).
 *
 * Ordered just after [com.github.zzave.teambalance.api.infrastructure.identity.SessionUserContextFilter]
 * (`+2`) so [currentUserGateway] can already resolve the caller: `accept` is throttled per user, falling
 * back to IP only for the (401-bound) unauthenticated case. The magic-link endpoints have no session yet,
 * so they key on IP. Only the initial dispatch is filtered (OncePerRequestFilter default), so one HTTP
 * request spends exactly one token regardless of the async controller re-dispatch.
 */
@Component
@Order(FILTER_ORDER)
class RateLimitFilter(
    private val rateLimiter: RateLimiter,
    private val properties: RateLimitProperties,
    private val currentUserGateway: CurrentUserGateway,
) : OncePerRequestFilter() {

    private val pathHelper = UrlPathHelper()
    private val pathMatcher = AntPathMatcher()

    private enum class KeyStrategy { IP, USER_OR_IP }

    private data class Rule(
        val policyName: String,
        val policy: RateLimitProperties.Policy,
        val keyStrategy: KeyStrategy,
    )

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val rule = if (properties.enabled) resolveRule(request) else null
        if (rule == null) {
            filterChain.doFilter(request, response)
            return
        }

        val clientKey = clientKey(request, rule.keyStrategy)
        val consumption = rateLimiter.tryConsume(rule.policyName, rule.policy, clientKey)
        if (!consumption.allowed) {
            writeTooManyRequests(response, consumption.retryAfterMillis)
            return
        }
        filterChain.doFilter(request, response)
    }

    private fun resolveRule(request: HttpServletRequest): Rule? {
        if (request.method != HttpMethod.POST.name()) return null
        val path = StringUtils.cleanPath(pathHelper.getPathWithinApplication(request))
        return when {
            path == MAGIC_LINK_REQUEST_PATH ->
                Rule("magic-link-request", properties.magicLinkRequest, KeyStrategy.IP)
            path == MAGIC_LINK_VERIFY_PATH ->
                Rule("magic-link-verify", properties.magicLinkVerify, KeyStrategy.IP)
            pathMatcher.match(INVITATION_ACCEPT_PATTERN, path) ->
                Rule("invitation-accept", properties.invitationAccept, KeyStrategy.USER_OR_IP)
            else -> null
        }
    }

    private fun clientKey(request: HttpServletRequest, strategy: KeyStrategy): String =
        when (strategy) {
            KeyStrategy.IP -> "ip:${clientIp(request)}"
            KeyStrategy.USER_OR_IP ->
                currentUserGateway.getCurrentUserId()?.let { "user:${it.value}" } ?: "ip:${clientIp(request)}"
        }

    private fun clientIp(request: HttpServletRequest): String {
        if (properties.trustForwardedFor) {
            request.getHeader(X_FORWARDED_FOR)
                ?.substringBefore(',')
                ?.trim()
                ?.takeIf { it.isNotEmpty() }
                ?.let { return it }
        }
        return request.remoteAddr ?: "unknown"
    }

    private fun writeTooManyRequests(response: HttpServletResponse, retryAfterMillis: Long) {
        val retryAfterSeconds = ceil(retryAfterMillis / MILLIS_PER_SECOND).toLong().coerceAtLeast(1)
        response.status = HttpStatus.TOO_MANY_REQUESTS.value()
        response.setHeader(HttpHeaders.RETRY_AFTER, retryAfterSeconds.toString())
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.characterEncoding = Charsets.UTF_8.name()
        response.writer.write(BODY)
    }

    private companion object {
        const val MAGIC_LINK_REQUEST_PATH = "/api/auth/magic-link/request"
        const val MAGIC_LINK_VERIFY_PATH = "/api/auth/magic-link/verify"

        // Single `*` matches one path segment, so the token can't contain a slash that escapes onto
        // another handler — the token is a URL-safe Base64 string with no slashes anyway.
        const val INVITATION_ACCEPT_PATTERN = "/api/invitations/*/accept"

        const val X_FORWARDED_FOR = "X-Forwarded-For"
        const val MILLIS_PER_SECOND = 1000.0
        const val BODY = """{"error":"Too many requests. Please slow down and try again shortly.","code":"rate_limited"}"""
    }
}
