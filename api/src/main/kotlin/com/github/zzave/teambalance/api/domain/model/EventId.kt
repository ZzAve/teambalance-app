package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * The identity of an [Event] (ADR-0018). A `@JvmInline` value class, so it costs nothing at runtime —
 * the compiler erases it back to the `UUID` it wraps — while the type system stops a `UUID` that
 * means something else (a user, a team, an event *type*) being passed where an event is expected.
 *
 * It is the internal representation only: the wire contract and the database column are both still a
 * UUID, and neither changes. Conversion therefore happens **only at the edges** — the JPA mapper
 * ([com.github.zzave.teambalance.api.infrastructure.persistence.mapper] `internalize`/`externalize`)
 * and the Wirespec mapper (`consume`/`produce` in the controllers). Everything between those two
 * edges — domain model, ports, application services — speaks [EventId] and never unwraps it.
 */
@JvmInline
value class EventId(val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        /**
         * Mints an identity for an event that does not exist yet. The domain names its own events —
         * the id is chosen before anything is persisted, so nothing downstream has to wait for a
         * database-generated key.
         */
        fun random(): EventId = EventId(UUID.randomUUID())
    }
}
