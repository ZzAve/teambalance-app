package com.github.zzave.teambalance.testroutes

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.model.EventId
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

/**
 * `suspend` handlers that fail in the three ways error reporting must tell apart: an unhandled
 * exception (a 500), an ERROR log line on a request that succeeds, and a domain exception that the
 * GlobalExceptionHandler maps to a 4xx. Outside the app's component scan, as [SuspendLoggingController].
 */
@RestController
class FailingController {
    @GetMapping(THROW_PATH)
    suspend fun throwUnhandled(): String = throw UnhandledTestException("an unhandled fault")

    @GetMapping(LOG_ERROR_PATH)
    suspend fun logError(): String {
        log.error("an error log line")
        return "ok"
    }

    @GetMapping(NOT_FOUND_PATH)
    suspend fun throwNotFound(): String = throw EventNotFoundException(EventId(UUID(0, 0)))

    companion object {
        const val THROW_PATH = "/api/test/throw"
        const val LOG_ERROR_PATH = "/api/test/log-error"
        const val NOT_FOUND_PATH = "/api/test/not-found"
        val log = LoggerFactory.getLogger(FailingController::class.java)
    }
}

/** Top level, so error tracking names its type `UnhandledTestException`, as it would a real one. */
class UnhandledTestException(message: String) : RuntimeException(message)
