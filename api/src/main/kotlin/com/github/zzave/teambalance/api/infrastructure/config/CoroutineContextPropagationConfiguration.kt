package com.github.zzave.teambalance.api.infrastructure.config

import org.springframework.context.annotation.Configuration
import reactor.core.publisher.Hooks

/**
 * Keeps the trace context (and so the `traceId` in log lines) when a `suspend` handler switches thread,
 * for example with `withContext(Dispatchers.IO)`.
 *
 * Spring calls each `suspend` handler through `CoroutinesUtils`, which adds a `PropagationContextElement`
 * to the coroutine only while Reactor's automatic context propagation is on. That element is a
 * `ThreadContextElement`: it is copied into `withContext` and child coroutines and restores the
 * request's observation on the new thread. Without it, a line logged after a thread switch has no
 * trace ID. OtlpTracesExportIT proves both cases.
 */
@Configuration
class CoroutineContextPropagationConfiguration {
    init {
        Hooks.enableAutomaticContextPropagation()
    }
}
