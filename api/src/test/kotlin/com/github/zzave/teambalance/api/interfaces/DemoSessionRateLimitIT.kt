package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * The guest login is unauthenticated and starts a session, so it is throttled per client IP like the magic-link
 * pair. Own context with the production capacity (the shared test profile raises it) and a unique client IP.
 */
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.bunq.environment=fake",
        "teambalance.rate-limit.demo-session.capacity=10",
    ],
)
class DemoSessionRateLimitIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("the eleventh guest login within a minute from one IP is a 429, another IP is unaffected") {
            repeat(10) { accepted("198.51.100.40") }

            val blocked = mockMvc.perform(login("198.51.100.40"))
                .andExpect(status().isTooManyRequests)
                .andExpect(header().exists("Retry-After"))
                .andReturn()
            blocked.response.contentAsString shouldContain "rate_limited"

            accepted("198.51.100.41")
        }
    }

    // The suspend controller runs async; a throttled request is answered synchronously by the filter.
    private fun accepted(clientIp: String) {
        val started = mockMvc.perform(login(clientIp)).andExpect(request().asyncStarted()).andReturn()
        mockMvc.perform(asyncDispatch(started)).andExpect(status().isNoContent)
    }

    private fun login(clientIp: String) = post("/api/demo/session")
        .header("X-Forwarded-For", clientIp)
        .contentType(MediaType.APPLICATION_JSON)
        .content("""{"persona":"MEMBER"}""")
}
