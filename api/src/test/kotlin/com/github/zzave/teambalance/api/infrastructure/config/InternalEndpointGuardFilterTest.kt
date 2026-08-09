package com.github.zzave.teambalance.api.infrastructure.config

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import jakarta.servlet.http.HttpServletResponse
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse

/**
 * Pure path-matching unit for the prod `/internal` guard (blocker #5). The filter must gate on the
 * DECODED, NORMALIZED path — the same one the servlet container routes on — so equivalent spellings
 * (`//internal`, `/./internal`, `%2e`-encoded, `/health/../metrics`) can't slip past. Exercising the
 * filter directly is the lowest layer that proves this; the prod-profile wiring seam (filter actually
 * registered) is covered by ProdProfileSmokeIT.
 */
class InternalEndpointGuardFilterTest : FunSpec({

    fun run(filter: InternalEndpointGuardFilter, uri: String, apiKeyHeader: String? = null): Pair<Boolean, Int> {
        val request = MockHttpServletRequest("GET", uri)
        if (apiKeyHeader != null) request.addHeader("X-Internal-Api-Key", apiKeyHeader)
        val response = MockHttpServletResponse()
        var proceeded = false
        filter.doFilter(request, response) { _, _ -> proceeded = true }
        return proceeded to response.status
    }

    val filter = InternalEndpointGuardFilter(startupActuatorEnabled = false, apiKey = "")

    context("lets through") {
        test("the exact health probe Scaleway uses") {
            run(filter, "/internal/actuator/health").first shouldBe true
        }
        test("the health probe with a trailing slash") {
            run(filter, "/internal/actuator/health/").first shouldBe true
        }
        test("a public /api path") {
            run(filter, "/api/events").first shouldBe true
        }
    }

    context("blocks with 403") {
        listOf(
            "the actuator metrics endpoint" to "/internal/actuator/metrics",
            "the actuator info endpoint" to "/internal/actuator/info",
            "a future admin/provision endpoint" to "/internal/admin/teams/team_setpoint_vt/provision",
            "a leading-double-slash spelling" to "//internal/admin/teams/team_setpoint_vt/provision",
            "a dot-segment spelling" to "/./internal/admin/teams/team_setpoint_vt/provision",
            "a percent-encoded spelling" to "/%2e/internal/admin/teams/team_setpoint_vt/provision",
            "a traversal out of the health path" to "/internal/actuator/health/../env",
        ).forEach { (name, uri) ->
            test("blocks $name") {
                val (proceeded, status) = run(filter, uri)
                proceeded shouldBe false
                status shouldBe HttpServletResponse.SC_FORBIDDEN
            }
        }
    }

    // Non-health actuator (info/metrics) is reachable from the internet only with the internal API key.
    // CI reads /internal/actuator/info to confirm the deployed image's build SHA is actually serving.
    context("the internal API key") {
        val guarded = InternalEndpointGuardFilter(startupActuatorEnabled = false, apiKey = "s3cret-key")

        test("lets the info endpoint through when the correct key is presented") {
            run(guarded, "/internal/actuator/info", apiKeyHeader = "s3cret-key").first shouldBe true
        }
        test("blocks the info endpoint with 403 when no key is presented") {
            val (proceeded, status) = run(guarded, "/internal/actuator/info")
            proceeded shouldBe false
            status shouldBe HttpServletResponse.SC_FORBIDDEN
        }
        test("blocks the info endpoint with 403 when a wrong key is presented") {
            val (proceeded, status) = run(guarded, "/internal/actuator/info", apiKeyHeader = "wrong")
            proceeded shouldBe false
            status shouldBe HttpServletResponse.SC_FORBIDDEN
        }
        test("fails closed: a blank configured key never bypasses, even with a blank header") {
            val (proceeded, status) = run(filter, "/internal/actuator/info", apiKeyHeader = "")
            proceeded shouldBe false
            status shouldBe HttpServletResponse.SC_FORBIDDEN
        }
        test("still lets the public health probe through without a key") {
            run(guarded, "/internal/actuator/health").first shouldBe true
        }
    }

    // The startup timing endpoint is a perf-testing tool gated behind teambalance.startup.actuator.enabled.
    context("the startup timing endpoint") {
        test("is blocked with 403 by default (flag off)") {
            val (proceeded, status) = run(filter, "/internal/actuator/startup")
            proceeded shouldBe false
            status shouldBe HttpServletResponse.SC_FORBIDDEN
        }
        test("is let through when the flag is set (perf-test window)") {
            val enabled = InternalEndpointGuardFilter(startupActuatorEnabled = true, apiKey = "")
            run(enabled, "/internal/actuator/startup").first shouldBe true
        }
        test("stays blocked even with the flag set once a traversal leaves the startup path") {
            val enabled = InternalEndpointGuardFilter(startupActuatorEnabled = true, apiKey = "")
            val (proceeded, status) = run(enabled, "/internal/actuator/startup/../env")
            proceeded shouldBe false
            status shouldBe HttpServletResponse.SC_FORBIDDEN
        }
    }
})
