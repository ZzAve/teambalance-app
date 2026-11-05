package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get

/** With a SPA location set (the demo container), the app serves the SPA's files and nothing else changes. */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.spa.static-location=classpath:/spa-fixture/"])
class SpaStaticResourcesIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("the root and client routes without a session get index.html") {
            // MockMvc does not run the forward, so the root is asserted by where it forwards to.
            perform(get("/")).forwardedUrl shouldBe "/index.html"
            for (path in listOf("/index.html", "/demo", "/t/de-smashers/events")) {
                val response = perform(get(path))
                response.status shouldBe 200
                response.contentAsString shouldContain "spa-fixture"
            }
        }

        test("a built asset is served, a missing one is 404") {
            perform(get("/assets/app.js")).contentAsString shouldContain "fixture"
            perform(get("/assets/missing.js")).status shouldBe 404
        }

        test("the API and /internal keep their rules") {
            perform(get("/api/events")).status shouldBe 401
            perform(get("/api/no-such-route")).status shouldBe 401
            // Public in this profile (InternalEndpointGuardFilter guards it in prod); it must not become the SPA.
            perform(get("/internal/actuator/health")).contentAsString shouldNotContain "spa-fixture"
        }
    }

    private fun perform(builder: MockHttpServletRequestBuilder): MockHttpServletResponse {
        val started = mockMvc.perform(builder).andReturn()
        return if (started.request.isAsyncStarted) {
            mockMvc.perform(asyncDispatch(started)).andReturn().response
        } else {
            started.response
        }
    }
}
