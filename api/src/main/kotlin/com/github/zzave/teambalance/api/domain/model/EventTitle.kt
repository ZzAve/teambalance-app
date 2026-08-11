package com.github.zzave.teambalance.api.domain.model

/**
 * The human-readable name of an event ("Training", "Friendly Match") — the label the calendar and
 * the event detail page lead with. A `@JvmInline` value class, so it costs nothing at runtime (the
 * compiler erases it back to the `String` it wraps) while the type system stops it being confused
 * with the other free-text strings an event carries: description and location are the same shape,
 * sit next to it in every constructor, and are exactly the pair a positional mix-up would swap
 * silently today.
 *
 * Internal representation only. The wire contract and the `events.title` column are both still a
 * plain string and neither changes, so conversion happens **only at the edges** — the JPA mapper
 * ([com.github.zzave.teambalance.api.infrastructure.persistence.mapper] `internalize`/`externalize`)
 * and the Wirespec mapper (`consume`/`produce` in the controllers). Everything between those two
 * edges — domain model, ports, application services — speaks [EventTitle] and never unwraps it.
 *
 * Deliberately **unguarded**, unlike [EventReference.Url]: a title carries no invariant the domain
 * can defend (any text a human types is a legitimate event name), and bolting a blank/length check
 * on here would turn today's accepted inputs into 400s — a behaviour change this refactor is not
 * allowed to make. The type buys confusion-safety, not validation.
 */
@JvmInline
value class EventTitle(val value: String) {
    override fun toString(): String = value
}
