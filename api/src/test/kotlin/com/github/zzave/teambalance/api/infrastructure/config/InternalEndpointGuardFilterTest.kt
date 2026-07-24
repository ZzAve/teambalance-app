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
    val filter = InternalEndpointGuardFilter()

    fun run(uri: String): Pair<Boolean, Int> {
        val request = MockHttpServletRequest("GET", uri)
        val response = MockHttpServletResponse()
        var proceeded = false
        filter.doFilter(request, response) { _, _ -> proceeded = true }
        return proceeded to response.status
    }

    context("lets through") {
        test("the exact health probe Scaleway uses") {
            run("/internal/actuator/health").first shouldBe true
        }
        test("the health probe with a trailing slash") {
            run("/internal/actuator/health/").first shouldBe true
        }
        test("a public /api path") {
            run("/api/events").first shouldBe true
        }
        // TODO(#95): temporary — the cold-start experiment (#92) exposes the startup timing tree in
        // prod. Remove this case (and the filter's STARTUP_PATH allowance) once numbers are captured.
        test("the startup timing endpoint while the cold-start experiment runs") {
            run("/internal/actuator/startup").first shouldBe true
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
                val (proceeded, status) = run(uri)
                proceeded shouldBe false
                status shouldBe HttpServletResponse.SC_FORBIDDEN
            }
        }
    }
})
