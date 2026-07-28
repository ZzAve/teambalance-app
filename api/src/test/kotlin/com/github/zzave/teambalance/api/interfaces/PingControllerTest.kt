package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@AutoConfigureMockMvc
class PingControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        // 204 is the whole contract — the wake ping is fire-and-forget and the frontend never reads
        // the body. Assert status only, matching the proven Logout (also 204 -> Unit) test; Wirespec's
        // Unit-body serialization doesn't emit a strictly-empty string, same as the shipped Logout.
        test("GET api/ping returns 204") {
            val mvcResult = mockMvc.get("/api/ping")
                .andExpect { request { asyncStarted() } }
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isNoContent)
        }
    }
}
