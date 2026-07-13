package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

/** Guards that the e2e-only support endpoint never leaks outside the e2e profile. */
@AutoConfigureMockMvc
class E2eSupportDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("e2e magic-link token endpoint is absent outside the e2e profile") {
            mockMvc.perform(
                MockMvcRequestBuilders.get("/internal/e2e/magic-link-token").param("email", "e2e@example.com"),
            ).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
    }
}
