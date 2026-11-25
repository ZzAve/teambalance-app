package com.github.zzave.teambalance.testroutes

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * `suspend` handlers that write one log line: one on the request thread, one after a switch to
 * [Dispatchers.IO]. Spring calls it through the same coroutine path as the
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

    @GetMapping(PATH_AFTER_DISPATCHER_SWITCH)
    suspend fun logAfterDispatcherSwitch(): String {
        val requestThread = Thread.currentThread().name
        withContext(Dispatchers.IO) {
            log.info("after a dispatcher switch from {}", requestThread)
        }
        return "ok"
    }

    companion object {
        const val PATH = "/api/test/suspend-log"
        const val PATH_AFTER_DISPATCHER_SWITCH = "/api/test/suspend-log-after-dispatcher-switch"
        val log = LoggerFactory.getLogger(SuspendLoggingController::class.java)
    }
}
