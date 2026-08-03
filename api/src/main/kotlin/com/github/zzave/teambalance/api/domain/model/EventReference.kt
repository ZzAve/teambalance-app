package com.github.zzave.teambalance.api.domain.model

import java.net.URI

/**
 * A labeled, outbound URL an admin curates on an Event (see CONTEXT.md: "Reference") — e.g. the
 * Nevobo match page or the digital match form. Stored structured, not as rich text in the
 * description, so rendering is always a plain anchor with no HTML-injection surface (ADR-0016).
 *
 * The [Url] value object is the single guard: only `http`/`https` URLs within the length cap are
 * constructible, which is what makes a rendered `<a href>` safe by construction rather than by
 * runtime sanitising. The type IS the guard — an un-constructible bad URL can never reach a
 * rendered anchor, whichever layer built it.
 */
data class EventReference(
    val title: String?,
    val url: Url,
) {
    init {
        require((title?.length ?: 0) <= MAX_TITLE_LENGTH) {
            "Reference title must be at most $MAX_TITLE_LENGTH characters"
        }
    }

    /**
     * An outbound reference URL. Only a non-blank `http`/`https` URL with a host, no longer than
     * [MAX_URL_LENGTH], is constructible — the guard lives in `init`, so holding a [Url] is proof the
     * value passed it. Convert to the raw string only at the JPA and Wirespec edges via [value].
     */
    @JvmInline
    value class Url(val value: String) {
        init {
            require(value.isNotBlank()) { "Reference url must not be blank" }
            require(value.length <= MAX_URL_LENGTH) { "Reference url must be at most $MAX_URL_LENGTH characters" }
            require(isHttpUrl(value)) { "Reference url must be a valid http(s) URL: $value" }
        }

        companion object {
            const val MAX_URL_LENGTH = 2048

            private fun isHttpUrl(value: String): Boolean {
                val uri = runCatching { URI(value) }.getOrNull() ?: return false
                val scheme = uri.scheme?.lowercase()
                return (scheme == "http" || scheme == "https") && !uri.host.isNullOrBlank()
            }
        }
    }

    companion object {
        const val MAX_TITLE_LENGTH = 100

        /**
         * Normalizing factory: trims both fields and treats a blank title as absent (the UI derives
         * a host label when the title is null — that is a render concern, not stored state). Throws
         * [IllegalArgumentException] (→ 400) on an invalid URL via the [Url] guard.
         */
        fun of(title: String?, url: String): EventReference =
            EventReference(
                title = title?.trim()?.takeIf { it.isNotEmpty() },
                url = Url(url.trim()),
            )
    }
}
