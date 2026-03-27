package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@AutoConfigureMockMvc
class HealthControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("GET api/health returns 200") {
            val mvcResult = mockMvc.get("/api/health")
                .andExpect { request { asyncStarted() } }
                .andReturn()

            mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(mvcResult))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("UP"))
        }
    }
}
