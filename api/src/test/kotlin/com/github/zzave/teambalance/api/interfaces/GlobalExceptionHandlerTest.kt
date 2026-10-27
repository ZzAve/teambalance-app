package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.exception.LastAdminException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.model.TeamId
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.types.shouldBeInstanceOf
import jakarta.servlet.ServletException
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.test.web.servlet.get
import java.util.UUID

@RestController
private class ThrowingController {
    @GetMapping("/boom/name-taken")
    fun nameTaken(): Nothing = throw NameTakenException("Ace")

    @GetMapping("/boom/illegal-state")
    fun illegalState(): Nothing = error("a server fault")

    @GetMapping("/boom/last-admin")
    fun lastAdmin(): Nothing = throw LastAdminException(TeamId(UUID.randomUUID()))
}

class GlobalExceptionHandlerTest : FunSpec({

    val mockMvc = MockMvcBuilders
        .standaloneSetup(ThrowingController())
        .setControllerAdvice(GlobalExceptionHandler())
        .build()

    test("NameTakenException maps to HTTP 409 with code NAME_TAKEN") {
        mockMvc.get("/boom/name-taken")
            .andExpect {
                status { isEqualTo(409) }
                jsonPath("$.code") { value("NAME_TAKEN") }
            }
    }

    test("LastAdminException maps to HTTP 409 with code LAST_ADMIN") {
        mockMvc.get("/boom/last-admin")
            .andExpect {
                status { isEqualTo(409) }
                jsonPath("$.code") { value("LAST_ADMIN") }
            }
    }

    test("an IllegalStateException that is not a request-parsing failure is left unhandled, so it stays a 500") {
        val failure = shouldThrow<ServletException> { mockMvc.get("/boom/illegal-state") }

        failure.cause.shouldBeInstanceOf<IllegalStateException>()
    }
})
