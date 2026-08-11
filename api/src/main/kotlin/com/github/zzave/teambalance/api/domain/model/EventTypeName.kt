package com.github.zzave.teambalance.api.domain.model

/**
 * The name of a kind of event — "Training", "Match", "Other" — as seeded per tenant schema by
 * `V002__seed_event_types.sql`. A `@JvmInline` value class, so it costs nothing at runtime (the
 * compiler erases it back to the `String` it wraps) while the type system stops it being confused
 * with the other display strings an event type carries next to it: [HexColor] is the same shape and
 * sits in the very next constructor position.
 *
 * Internal representation only. The wire contract and the `event_types.name` column are both still
 * a plain string and neither changes, so conversion happens **only at the edges** — the JPA mapper
 * ([com.github.zzave.teambalance.api.infrastructure.persistence.mapper] `internalize`) and the
 * Wirespec mappers in the event-type and event controllers.
 *
 * Deliberately **unguarded**, like [EventTitle]: the name is display text with no invariant the
 * domain can defend, and there is nothing to reject — it is written by a migration, never by a
 * request.
 */
@JvmInline
value class EventTypeName(val value: String) {
    override fun toString(): String = value
}
