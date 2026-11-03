package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.domain.exception.BunqConnectDisabledException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.infrastructure.bunq.RealBunqGatewayAdapter
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.string.shouldStartWith
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.ApplicationContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/**
 * The pure `prod` profile as the live container runs it once `TEAMBALANCE_BUNQ_ENVIRONMENT=production` and the
 * client id and secret are set, with connecting still off: the real adapter is wired and the app is healthy.
 * Test values only. The default prod wiring (no Bunq environment) is asserted by [ProdProfileSmokeIT].
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.invitation.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1zbW9rZS1rZXktMzJieXQ=",
        "teambalance.calendar-link.token-salt=prod-smoke-calendar-salt",
        "teambalance.calendar-link.token-encryption-key=cHJvZC1zbW9rZS1jYWxlbmRhci1rZXktMzJieXRlcyE=",
        "teambalance.bunq.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1idW5xLXNtb2tlLWtleTE=",
        "teambalance.bunq.environment=production",
        "teambalance.bunq.client-id=prod-smoke-client-id",
        "teambalance.bunq.client-secret=prod-smoke-client-secret",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
        "teambalance.internal.api-key=prod-smoke-internal-key",
        "info.build.sha=smoke-sha",
    ],
)
class ProdProfileRealBunqIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var applicationContext: ApplicationContext

    init {
        test("prod with the production Bunq environment wires the real adapter on the public OAuth server") {
            val gateway = applicationContext.getBean(BunqGateway::class.java).shouldBeInstanceOf<RealBunqGatewayAdapter>()

            gateway.authorizationUrl("state", "https://api.teambalance.nl/api/bunq/oauth/callback") shouldStartWith
                "https://oauth.bunq.com/auth?"
        }

        test("connecting stays off: the flag defaults to false, and prod refuses it being on") {
            val service = applicationContext.getBean(BunqConnectionService::class.java)

            shouldThrow<BunqConnectDisabledException> { service.start(UserId.random(), TeamId(UUID.randomUUID())) }
        }

        test("the health probe is up") {
            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/health"))
                .andExpect(MockMvcResultMatchers.status().isOk)
        }
    }
}
