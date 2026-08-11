package com.github.zzave.teambalance.api.domain.model

/**
 * Where an event takes place, as the free text a human typed ("Sporthal de Pijp", "away — De Meent",
 * "TBD"). Deliberately *not* an address or a venue reference: the domain never parses, geocodes or
 * matches on it, it only carries it through to the screen. A `@JvmInline` value class, so it costs
 * nothing at runtime (the compiler erases it back to the `String` it wraps) while the type system
 * completes the free-text trio — [EventTitle], [EventDescription] and this — which sit next to each
 * other in every constructor and were, until now, three interchangeable `String`s a positional
 * mix-up would swap silently.
 *
 * **Optional**: the property is `EventLocation?` everywhere, and absent stays `null` rather than
 * becoming an empty location — the wire contract and the `events.location` column are both nullable
 * and neither changes.
 *
 * Internal representation only. Conversion happens **only at the edges** — the JPA mapper
 * ([com.github.zzave.teambalance.api.infrastructure.persistence.mapper] `internalize`/`externalize`)
 * and the Wirespec mapper in the event controllers. Everything between those two edges — domain
 * model, ports, application services — speaks [EventLocation] and never unwraps it.
 *
 * Deliberately **unguarded**, for the same reason as [EventTitle] and [EventDescription]: a location
 * carries no invariant the domain can defend (a blank one and "TBD" are equally meaningful), and
 * bolting a check on here would turn today's accepted inputs into 400s — a behaviour change this
 * refactor is not allowed to make. The type buys confusion-safety, not validation.
 */
@JvmInline
value class EventLocation(val value: String) {
    override fun toString(): String = value
}
