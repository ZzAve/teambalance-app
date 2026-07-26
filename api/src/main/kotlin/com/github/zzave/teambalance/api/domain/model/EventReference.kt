package com.github.zzave.teambalance.api.domain.model

import java.net.URI

/**
 * A labeled, outbound URL an admin curates on an Event (see CONTEXT.md: "Reference") — e.g. the
 * Nevobo match page or the digital match form. Stored structured, not as rich text in the
 * description, so rendering is always a plain anchor with no HTML-injection surface (ADR-0016).
 *
 * The value object is the single guard: only `http`/`https` URLs are constructible, which is what
 * makes a rendered `<a href>` safe by construction rather than by runtime sanitising.
 */
data class EventReference(
    val title: String?,
    val url: String,
) {
    init {
        require(url.isNotBlank()) { "Reference url must not be blank" }
        require(url.length <= MAX_URL_LENGTH) { "Reference url must be at most $MAX_URL_LENGTH characters" }
        require(isHttpUrl(url)) { "Reference url must be a valid http(s) URL: $url" }
        require((title?.length ?: 0) <= MAX_TITLE_LENGTH) {
            "Reference title must be at most $MAX_TITLE_LENGTH characters"
        }
    }

    companion object {
        const val MAX_URL_LENGTH = 2048
        const val MAX_TITLE_LENGTH = 100

        /**
         * Normalizing factory: trims both fields and treats a blank title as absent (the UI derives
         * a host label when the title is null — that is a render concern, not stored state). Throws
         * [IllegalArgumentException] (→ 400) on an invalid URL.
         */
        fun of(title: String?, url: String): EventReference =
            EventReference(
                title = title?.trim()?.takeIf { it.isNotEmpty() },
                url = url.trim(),
            )

        private fun isHttpUrl(value: String): Boolean {
            val uri = try {
                URI(value)
            } catch (_: Exception) {
                return false
            }
            val scheme = uri.scheme?.lowercase() ?: return false
            return (scheme == "http" || scheme == "https") && !uri.host.isNullOrBlank()
        }
    }
}
