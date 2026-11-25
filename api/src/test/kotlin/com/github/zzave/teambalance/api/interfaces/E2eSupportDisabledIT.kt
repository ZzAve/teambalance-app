package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

/** Guards that the dev/e2e-only support endpoint is absent under the test profile (wiring per profile: E2eSupportProfileTest). */
@AutoConfigureMockMvc
class E2eSupportDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("e2e magic-link token endpoint is absent under the test profile") {
            mockMvc.perform(
                MockMvcRequestBuilders.get("/internal/e2e/magic-link-token").param("email", "e2e@example.com"),
            ).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
    }
}
