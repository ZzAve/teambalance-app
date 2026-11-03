package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BunqApiException
import java.time.Clock
import java.time.Duration
import java.util.concurrent.Callable
import java.util.concurrent.ExecutionException
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

private const val TOO_MANY_REQUESTS = 429

/**
 * Runs the SDK's blocking calls with the two limits the SDK does not have: a time limit per call (its HTTP client sets
 * none, so a Bunq that never answers would hold the caller for good) and the pause after a 429 ([BunqRateLimitPause]).
 *
 * Each call runs on its own virtual thread, which is interrupted when the time is up; the SDK's `HttpClient.send` stops
 * on an interrupt. A call that fails with a 429 starts the pause and ends as [BunqUnavailableException]; every other
 * failure reaches the caller as it was thrown.
 */
internal class BunqCalls(private val properties: BunqCallProperties, clock: Clock) {
    private val pause = BunqRateLimitPause(properties, clock)
    private val executor = Executors.newThreadPerTaskExecutor(Thread.ofVirtual().name("bunq-call-", 0).factory())

    fun requireOpen() = pause.requireOpen()

    fun <T> run(block: () -> T): T = execute(properties.callTimeout, block)

    /** Setting a session up is three calls made as one by the SDK, which is why it has its own, longer limit. */
    fun <T> runSetup(block: () -> T): T = execute(properties.setupTimeout, block)

    @Suppress("TooGenericExceptionCaught")
    private fun <T> execute(timeout: Duration, block: () -> T): T {
        pause.requireOpen()
        val future = executor.submit(Callable { block() })
        try {
            return future.get(timeout.toNanos(), TimeUnit.NANOSECONDS)
        } catch (e: ExecutionException) {
            throw failureOf(e.cause ?: e)
        } catch (e: Exception) {
            future.cancel(true)
            if (e is InterruptedException) Thread.currentThread().interrupt()
            val reason = if (e is TimeoutException) "did not answer within $timeout" else "was waited for in vain"
            throw BunqUnavailableException("Bunq $reason", e)
        }
    }

    private fun failureOf(failure: Throwable): Throwable {
        if (failure is BunqApiException && failure.status == TOO_MANY_REQUESTS) {
            val pausedFor = pause.startFrom(failure.body)
            return BunqUnavailableException("Bunq answered 429, leaving it alone for $pausedFor", failure)
        }
        return failure
    }
}
