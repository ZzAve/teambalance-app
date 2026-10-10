package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.infrastructure.identity.SessionUserContextFilter
import com.github.zzave.teambalance.api.infrastructure.multitenancy.CalendarFeedTenantFilter
import com.github.zzave.teambalance.api.infrastructure.multitenancy.SessionTenantContextFilter
import com.github.zzave.teambalance.api.infrastructure.ratelimit.RateLimitFilter
import jakarta.servlet.DispatcherType
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.savedrequest.NullRequestCache
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher
import org.springframework.security.web.util.matcher.AndRequestMatcher
import org.springframework.security.web.util.matcher.OrRequestMatcher
import org.springframework.web.filter.OncePerRequestFilter

/**
 * The one SecurityFilterChain (ADR-0012). It wraps the session model rather than replacing it: the
 * app's own filters run inside the chain in the order they always had, and keep owning the
 * `UserContext` / `TenantContext` ThreadLocals the application layer reads. Spring Security adds
 * three things on top: authenticated-by-default, CSRF, and its default response headers. Session-ID
 * rotation on sign-in is done by `AuthSessionGatewayAdapter.startSession`.
 *
 * Nothing here stores state on the session: the security context is rebuilt from the session's
 * `userId` on every request by [SessionUserContextFilter], and the request cache is off, so an
 * unauthenticated call never creates a session row.
 */
@Configuration
class SecurityConfig(
    // `.teambalance.nl` in prod, so the SPA on app.teambalance.nl can read a cookie set by
    // api.teambalance.nl. Empty (host-only) everywhere else.
    @param:Value("\${teambalance.csrf.cookie-domain:}") private val csrfCookieDomain: String,
    // The CSRF cookie takes the session cookie's flags: HTTPS-only and SameSite=Lax in prod.
    @param:Value("\${server.servlet.session.cookie.secure:false}") private val secureCookie: Boolean,
) {

    @Bean
    @Suppress("LongParameterList")
    fun securityFilterChain(
        http: HttpSecurity,
        sessionUserContextFilter: SessionUserContextFilter,
        sessionTenantContextFilter: SessionTenantContextFilter,
        rateLimitFilter: RateLimitFilter,
        calendarFeedTenantFilter: CalendarFeedTenantFilter,
    ): SecurityFilterChain = http
        .cors(withDefaults())
        .csrf {
            it.spa()
                .csrfTokenRepository(csrfTokenRepository())
                // A browser's first request to the API can be the magic-link request or verify (the
                // login and verify pages make no API call before it), so it has no XSRF-TOKEN cookie to
                // echo yet. JSON only: a cross-origin JSON request needs a CORS preflight, which an
                // untrusted origin fails, while a plain HTML form post would not, and would otherwise
                // sign the victim in as whoever's magic-link token it carries. See ADR-0012.
                .ignoringRequestMatchers(
                    AndRequestMatcher(OrRequestMatcher(post(MAGIC_LINK_REQUEST), post(MAGIC_LINK_VERIFY)), ::isJson),
                )
        }
        .authorizeHttpRequests {
            it
                // An ASYNC dispatch (every suspend handler) or an ERROR dispatch belongs to a request
                // the REQUEST dispatch already authorized; the security context is not carried to it.
                .dispatcherTypeMatchers(DispatcherType.ASYNC, DispatcherType.ERROR).permitAll()
                .requestMatchers(*PUBLIC_PATHS).permitAll()
                .anyRequest().authenticated()
        }
        .exceptionHandling { it.authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) }
        .requestCache { it.requestCache(NullRequestCache()) }
        // Sign-out is the Logout endpoint's (AuthController), not Spring Security's `/logout`.
        .logout { it.disable() }
        // User, then tenant (it needs the user), then the throttle (it keys on the user, and runs before
        // the feed filter's database lookup), then the feed's tenant. All before
        // AnonymousAuthenticationFilter, so a session's user is the authentication it sees.
        .addFilterBefore(sessionUserContextFilter, AnonymousAuthenticationFilter::class.java)
        .addFilterAfter(sessionTenantContextFilter, SessionUserContextFilter::class.java)
        .addFilterAfter(rateLimitFilter, SessionTenantContextFilter::class.java)
        .addFilterAfter(calendarFeedTenantFilter, RateLimitFilter::class.java)
        .addFilterAfter(CsrfCookieFilter(), CsrfFilter::class.java)
        .build()

    private fun csrfTokenRepository() = CookieCsrfTokenRepository.withHttpOnlyFalse().apply {
        setCookieCustomizer { cookie ->
            cookie.secure(secureCookie).sameSite("Lax")
            if (csrfCookieDomain.isNotBlank()) cookie.domain(csrfCookieDomain)
        }
    }

    // These filters run inside the chain; without these, Boot would also register each one as a
    // servlet filter of its own and they would run twice.
    @Bean
    fun sessionUserContextFilterRegistration(filter: SessionUserContextFilter) = notAServletFilter(filter)

    @Bean
    fun sessionTenantContextFilterRegistration(filter: SessionTenantContextFilter) = notAServletFilter(filter)

    @Bean
    fun rateLimitFilterRegistration(filter: RateLimitFilter) = notAServletFilter(filter)

    @Bean
    fun calendarFeedTenantFilterRegistration(filter: CalendarFeedTenantFilter) = notAServletFilter(filter)

    private fun isJson(request: HttpServletRequest): Boolean =
        runCatching { MediaType.parseMediaType(request.contentType) }
            .getOrNull()
            ?.isCompatibleWith(MediaType.APPLICATION_JSON) == true

    private fun post(path: String) = PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.POST, path)

    private fun <T : OncePerRequestFilter> notAServletFilter(filter: T) =
        FilterRegistrationBean(filter).apply { isEnabled = false }

    /**
     * Issues the `XSRF-TOKEN` cookie on any response that does not carry one yet. The repository only
     * writes it when something reads the token, and a GET never does, so without this the SPA would
     * have no cookie to echo on its first mutating request after sign-in.
     */
    private class CsrfCookieFilter : OncePerRequestFilter() {
        override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain,
        ) {
            (request.getAttribute(CsrfToken::class.java.name) as? CsrfToken)?.token
            filterChain.doFilter(request, response)
        }
    }

    private companion object {
        const val MAGIC_LINK_REQUEST = "/api/auth/magic-link/request"
        const val MAGIC_LINK_VERIFY = "/api/auth/magic-link/verify"

        /**
         * Every route that answers without a session. Checked against each controller: these are the
         * handlers that never call `CurrentUserGateway.requireCurrentUserId()`.
         * - under `/api/auth/`: magic-link request and verify, `/me` (answers 401 itself), logout.
         * - under `/api/calendar/`: the webcal feed; the token in the path is the credential (ADR-0039).
         * - under `/internal/actuator/`: `InternalEndpointGuardFilter` is the boundary for these in prod.
         * - under `/internal/e2e/`: exists only under the e2e profile.
         */
        val PUBLIC_PATHS = arrayOf(
            "/api/auth/**",
            "/api/ping",
            "/api/calendar/**",
            "/internal/actuator/**",
            "/internal/e2e/**",
        )
    }
}
