package com.github.zzave.teambalance.testroutes

import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * A `suspend` handler that writes one log line. Spring calls it through the same coroutine path as the
 * Wirespec-generated handlers. Its package is outside the app's component scan, so only a test that
 * registers it as a bean has the route.
 */
@RestController
class SuspendLoggingController {
    @GetMapping(PATH)
    suspend fun logOnce(): String {
        log.info("inside a suspend handler")
        return "ok"
    }

    companion object {
        const val PATH = "/api/test/suspend-log"
        val log = LoggerFactory.getLogger(SuspendLoggingController::class.java)
    }
}
