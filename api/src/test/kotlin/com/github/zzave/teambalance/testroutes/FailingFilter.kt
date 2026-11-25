package com.github.zzave.teambalance.testroutes

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.filter.OncePerRequestFilter

/**
 * Throws for one path before any controller runs, as a filter that cannot reach the database does
 * (the calendar feed's tenant filter, for example). Such an exception never reaches Spring MVC's
 * exception resolvers. Registered only by a test.
 */
class FailingFilter : OncePerRequestFilter() {
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        if (request.requestURI == PATH) throw FilterFaultException("a fault in a filter")
        chain.doFilter(request, response)
    }

    companion object {
        const val PATH = "/api/test/filter-fault"
    }
}

class FilterFaultException(message: String) : RuntimeException(message)
