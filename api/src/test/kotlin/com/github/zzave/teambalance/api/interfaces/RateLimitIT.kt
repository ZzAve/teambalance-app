package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/**
 * Proves the throttle is actually on the servlet chain and short-circuits a real endpoint before the
 * controller — the wiring seam the pure [com.github.zzave.teambalance.api.infrastructure.ratelimit]
 * unit tests can't reach. Runs in its own context (the property override forks the cache key) with a
 * tiny limit and a unique client IP, so it neither pollutes nor is polluted by the shared-context suite.
 */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.rate-limit.magic-link-request.capacity=3"])
class RateLimitIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("throttles POST /api/auth/magic-link/request past its capacity with a 429") {
            // TEST-NET-3 address, unique to this test → its own token bucket.
            val clientIp = "198.51.100.7"

            // The first three (capacity) are accepted; each runs the async suspend controller to 202.
            repeat(3) { accepted(clientIp) }

            // The fourth is rejected by the filter before dispatch — a synchronous 429, no async started.
            val blocked = mockMvc.perform(requestBuilder(clientIp))
                .andExpect(MockMvcResultMatchers.status().isTooManyRequests)
                .andExpect(MockMvcResultMatchers.header().exists("Retry-After"))
                .andReturn()

            blocked.response.getHeader("Retry-After")!!.toInt() shouldBeGreaterThan 0
            blocked.response.contentAsString shouldContain "rate_limited"
        }

        test("a different client IP is unaffected by another IP's exhausted bucket") {
            val busyIp = "198.51.100.20"
            repeat(3) { accepted(busyIp) }
            mockMvc.perform(requestBuilder(busyIp))
                .andExpect(MockMvcResultMatchers.status().isTooManyRequests)

            // Fresh IP, fresh allowance.
            accepted("198.51.100.21")
        }
    }

    private fun accepted(clientIp: String) {
        val started = mockMvc.perform(requestBuilder(clientIp))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
        mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
            .andExpect(MockMvcResultMatchers.status().isAccepted)
    }

    private fun requestBuilder(clientIp: String) =
        MockMvcRequestBuilders.post("/api/auth/magic-link/request")
            .header("X-Forwarded-For", clientIp)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"email":"rate-${UUID.randomUUID()}@test.com"}""")
}
