package com.github.zzave.teambalance.api.domain.model

/**
 * The label an admin puts on a [EventReference] — the text the client renders inside the anchor
 * ("Nevobo", "Digital match form"). Optional: when it is absent the UI derives a host label instead,
 * so a reference is a `EventReferenceText?` paired with a mandatory [EventReference.Url].
 *
 * **Guarded, but only by the length cap** that [EventReference] already enforced in its `init` — the
 * cap simply moved onto the type, in the same spirit as [EventReference.Url]: the type IS the guard,
 * so a title built directly (JPA mapper, test fixture) cannot bypass a rule that
 * [EventReference.of] happened to apply. It rejects nothing the system accepts today — the write
 * path enforced the same 100 characters, and `event_references.title` is a `VARCHAR(100)`, so no
 * stored row can exceed it either.
 *
 * Deliberately does **not** reject blank text. Trimming and "a blank title means absent" are
 * normalization, and normalization belongs to the [EventReference.of] factory, which nulls a blank
 * title before it ever reaches this constructor. Guarding blank here would only affect values read
 * back from the database — where an empty string would then turn a working GET into a 500.
 *
 * Internal representation only: the wire contract and the column stay plain strings, so conversion
 * happens at the JPA and Wirespec edges alone.
 */
@JvmInline
value class EventReferenceText(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "Reference title must be at most $MAX_LENGTH characters" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 100
    }
}
