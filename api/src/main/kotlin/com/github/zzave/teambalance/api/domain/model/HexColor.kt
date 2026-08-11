package com.github.zzave.teambalance.api.domain.model

/**
 * An event type's accent colour, as the CSS hex triplet the client paints swatches and chips with
 * (`#249E6C`). A `@JvmInline` value class, so it costs nothing at runtime while separating the
 * colour from [EventTypeName], the display string sitting next to it in every constructor.
 *
 * **Guarded**, unlike the free-text value classes of this rollout ([EventTitle], [EventDescription],
 * [EventLocation], [EventTypeName]) — and the reason is the write path, not taste. Those wrap text a
 * user typed, so a `require()` would turn requests that are accepted today into 400s. A colour is
 * never typed by anyone: the only values in existence are the three literals seeded per tenant
 * schema by `V002__seed_event_types.sql`, into a `VARCHAR(7)` column, and no endpoint creates or
 * edits an event type. So the guard cannot reject anything the system accepts today, while it does
 * make "this is a renderable colour" true by construction for every layer that holds one.
 *
 * Accepts `#` plus exactly six hex digits, in either case (`#249E6C` is seeded, `#abcdef` appears in
 * test fixtures). Shorthand (`#abc`), alpha (`#rrggbbaa`) and named colours are deliberately out:
 * the column is seven characters wide, so nothing else fits anyway.
 *
 * When an admin surface for event types lands, validate at the Wirespec edge so a malformed colour
 * comes back as a 400 rather than surfacing as this constructor's [IllegalArgumentException].
 *
 * Internal representation only — the wire contract and the `event_types.color` column stay plain
 * strings; conversion happens at the JPA and Wirespec edges.
 */
@JvmInline
value class HexColor(val value: String) {
    init {
        require(PATTERN.matches(value)) { "Colour must be a #rrggbb hex triplet: $value" }
    }

    override fun toString(): String = value

    companion object {
        private val PATTERN = Regex("^#[0-9a-fA-F]{6}$")
    }
}
