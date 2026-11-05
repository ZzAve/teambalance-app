package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post

/** With the demo switch off (the default, and prod's state) the guest login answers 404 and signs nobody in. */
@AutoConfigureMockMvc
class DemoSessionDisabledIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("the guest login answers 404 and signs nobody in while the demo switch is off") {
            val response = perform(
                post("/api/demo/session").contentType(MediaType.APPLICATION_JSON).content("""{"persona":"MEMBER"}"""),
            )

            response.status shouldBe 404
            val me = response.getCookie("SESSION")?.let { perform(get("/api/auth/me").cookie(it)) }
                ?: perform(get("/api/auth/me"))
            me.status shouldBe 401
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
