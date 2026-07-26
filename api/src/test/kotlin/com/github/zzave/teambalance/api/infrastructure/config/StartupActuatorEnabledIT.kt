package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

/**
 * Boots the real `prod` profile with the perf-testing flag ON (teambalance.startup.actuator.enabled=true)
 * to prove the wiring seam ProdProfileSmokeIT can't (it runs flag-off): InternalEndpointGuardFilter's
 * @Value actually binds the flag in a prod context and, when set, stops 403-ing /internal/actuator/startup.
 *
 * The endpoint returns 404 (not 200) here because StartupEndpoint is @ConditionalOnBean(
 * BufferingApplicationStartup) and that bean is only installed by the real main()
 * (SpringApplication.setApplicationStartup), not in a @SpringBootTest context. The point is that the
 * guard no longer blocks it — /metrics stays 403 for contrast. On the live container the same path
 * returns the timing tree.
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.startup.actuator.enabled=true",
        "teambalance.invitation.token-salt=prod-smoke-salt",
        "teambalance.email.api-key=prod-smoke-key",
        "teambalance.email.project-id=prod-smoke-project",
    ],
)
class StartupActuatorEnabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("the guard lets /internal/actuator/startup through when the flag is set (unlike /metrics)") {
            // Not 403: the guard opened. 404 because the StartupEndpoint bean is absent in @SpringBootTest.
            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/startup"))
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("the guard still blocks other /internal actuator paths even with the flag set") {
            mockMvc.perform(MockMvcRequestBuilders.get("/internal/actuator/metrics"))
                .andExpect(MockMvcResultMatchers.status().isForbidden)
        }
    }
}
