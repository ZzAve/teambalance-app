package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.port.EmailSender
import com.github.zzave.teambalance.api.infrastructure.devdata.DemoDataSeeder
import com.github.zzave.teambalance.api.infrastructure.email.ScalewayTemEmailSender
import com.zaxxer.hikari.HikariDataSource
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import javax.sql.DataSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.Cookie
import org.springframework.boot.web.server.autoconfigure.ServerProperties
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpHeaders
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

/**
 * Boots the real, PURE `prod` profile (inheritProfiles = false, so TeamBalanceIT's "test" profile
 * is dropped) — this is the context the live Scaleway container flips to, so a prod-only wiring
 * defect or an application-prod.yml typo fails here, not on deploy. Secrets that fail-fast in prod
 * (token-salt, TEM api-key/project-id) are supplied by the test; the datasource comes from
 * TeamBalanceIT's Testcontainers Postgres. Covers the split-origin CORS contract, the hardened
 * session cookie, and the prod email-sender selection against the real prod configuration.
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
    ],
)
class ProdProfileSmokeIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var applicationContext: ApplicationContext

    @Autowired
    lateinit var serverProperties: ServerProperties

    init {
        test("prod profile hardens the session cookie (Secure + SameSite=Lax)") {
            val cookie = serverProperties.servlet.session.cookie
            cookie.secure shouldBe true
            cookie.sameSite shouldBe Cookie.SameSite.LAX
        }

        test("prod profile keeps no minimum idle DB pool (so the scale-to-zero DB can pause)") {
            // application-prod.yml sets spring.datasource.hikari.minimum-idle=0 so Hikari does not
            // proactively reopen connections to the Serverless SQL DB, which would keep waking it.
            val dataSource = applicationContext.getBean(DataSource::class.java).shouldBeInstanceOf<HikariDataSource>()
            dataSource.minimumIdle shouldBe 0
        }

        test("prod profile activates the Scaleway TEM email sender") {
            applicationContext.getBean(EmailSender::class.java).shouldBeInstanceOf<ScalewayTemEmailSender>()
        }

        test("prod profile does not load the dev demo-data seeder") {
            // DemoDataSeeder is @Profile("dev"); prod must never auto-seed the demo team.
            applicationContext.getBeanNamesForType(DemoDataSeeder::class.java).toList().shouldBeEmpty()
        }

        test("CORS allows the SPA origin with credentials (from application-prod.yml)") {
            preflight(origin = "https://app.teambalance.nl")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(
                    MockMvcResultMatchers.header()
                        .string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://app.teambalance.nl"),
                )
                .andExpect(
                    MockMvcResultMatchers.header()
                        .string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"),
                )
        }

        test("CORS allows the landing-page origin") {
            preflight(origin = "https://teambalance.nl")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(
                    MockMvcResultMatchers.header()
                        .string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://teambalance.nl"),
                )
        }

        test("CORS rejects an untrusted origin") {
            preflight(origin = "https://evil.example.com")
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        // Blocker #5 — proves InternalEndpointGuardFilter is registered and active in the prod
        // profile. The guard's path-matching logic (alternate spellings, traversal) is proven at the
        // unit layer in InternalEndpointGuardFilterTest; these two assertions cover the wiring seam.
        test("the health probe stays publicly reachable in prod (Scaleway health check)") {
            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/health"))
                .andExpect(MockMvcResultMatchers.status().isOk)
        }

        test("everything else under /internal is blocked in prod") {
            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/metrics"))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        // TODO(#95): temporary — the cold-start experiment (#92) exposes the startup timing tree in
        // prod (application-prod.yml exposure + guard allowance). This asserts the guard lets it
        // THROUGH: a blocked path would be 403 (like /metrics above). It is 404 here — not 200 —
        // because the StartupEndpoint is @ConditionalOnBean(BufferingApplicationStartup), and that
        // bean is only installed by the real main() (SpringApplication.setApplicationStartup), not in
        // a @SpringBootTest context. On the live container the same path returns the timing tree.
        // Remove with the experiment.
        test("the startup timing endpoint is not blocked by the prod guard (reachable, unlike /metrics)") {
            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/startup"))
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }
    }

    private fun preflight(origin: String) = mockMvc.perform(
        MockMvcRequestBuilders.options("/api/events")
            .header(HttpHeaders.ORIGIN, origin)
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "X-Team-Id,Content-Type"),
    )
}
