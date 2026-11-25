package com.github.zzave.teambalance.api.infrastructure.config

import io.micrometer.tracing.Tracer
import io.sentry.Sentry
import io.sentry.SentryOptions
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.ObjectProvider
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.web.filter.OncePerRequestFilter

/**
 * Error events to Bugsink through the Sentry SDK (only when `SENTRY_DSN` is set, see
 * application-prod.yml; without it every call here is a no-op).
 */
@Configuration
class ErrorReportingConfiguration {

    /**
     * Prepares each event before the SDK sends it.
     *
     * - Adds the `trace_id` tag: the trace ID of the current OTel span, so the event leads to the request
     *   in Cockpit Tempo. The SDK calls this on the thread that reports the error, where the span is current.
     * - Removes the user and the request URL, query string, cookies, headers and body. The URL of a
     *   calendar feed and the query of a magic-link verify hold tokens.
     * - Keeps the event's `transaction` only when it is a route template (`GET /api/events/{id}`). When
     *   no route matched (a fault in a filter), the SDK names the event after the raw path instead.
     */
    @Bean
    fun traceIdAndNoRequestData(tracer: ObjectProvider<Tracer>) = SentryOptions.BeforeSendCallback { event, _ ->
        tracer.ifAvailable?.currentSpan()?.context()?.traceId()?.let { event.setTag(TRACE_ID_TAG, it) }
        event.user = null
        if (event.transaction?.contains('{') != true) event.transaction = null
        event.request?.apply {
            url = null
            queryString = null
            cookies = null
            headers = null
            data = null
        }
        event
    }

    /**
     * Reports an exception that leaves the filter chain while the request's span is still current.
     * An exception thrown in a servlet filter never reaches the SDK's exception resolver, and the
     * container logs it only after the span has ended: that event would have no trace ID. The SDK
     * drops the later reports of the same exception (the resolver's, the container's log line).
     */
    @Bean
    fun reportUnhandledExceptionsInSpan(): FilterRegistrationBean<OncePerRequestFilter> =
        FilterRegistrationBean<OncePerRequestFilter>(UnhandledExceptionReportingFilter()).apply {
            // Directly inside Spring Boot's HTTP server observation filter (HIGHEST_PRECEDENCE + 1).
            order = Ordered.HIGHEST_PRECEDENCE + 2
        }

    private class UnhandledExceptionReportingFilter : OncePerRequestFilter() {
        // A suspend handler fails in the async dispatch: report there too.
        override fun shouldNotFilterAsyncDispatch() = false

        @Suppress("TooGenericExceptionCaught") // Reports any exception, then rethrows it unchanged.
        override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
            try {
                chain.doFilter(request, response)
            } catch (ex: Exception) {
                Sentry.captureException(ex)
                throw ex
            }
        }
    }

    private companion object {
        const val TRACE_ID_TAG = "trace_id"
    }
}
