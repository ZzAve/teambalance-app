package com.github.zzave.teambalance.api.domain.model

/**
 * The free-text blurb an event carries under its title ("bring your own ball", "cup final") — the
 * paragraph the event detail page renders below the heading. A `@JvmInline` value class, so it costs
 * nothing at runtime (the compiler erases it back to the `String` it wraps) while the type system
 * stops it being confused with [EventTitle] and the event's location: all three are free text, sit
 * next to each other in every constructor, and are exactly the trio a positional mix-up would swap
 * silently today.
 *
 * **Optional**: the property is `EventDescription?` everywhere, and absent stays `null` rather than
 * becoming an empty description — the wire contract and the `events.description` column are both
 * nullable and neither changes.
 *
 * Internal representation only. Conversion happens **only at the edges** — the JPA mapper
 * ([com.github.zzave.teambalance.api.infrastructure.persistence.mapper] `internalize`/`externalize`)
 * and the Wirespec mapper in the event controllers. Everything between those two edges — domain
 * model, ports, application services — speaks [EventDescription] and never unwraps it.
 *
 * Deliberately **unguarded**, for the same reason as [EventTitle]: a description carries no invariant
 * the domain can defend, and bolting a blank/length check on here would turn today's accepted inputs
 * into 400s — a behaviour change this refactor is not allowed to make. The type buys
 * confusion-safety, not validation.
 */
@JvmInline
value class EventDescription(val value: String) {
    override fun toString(): String = value
}
