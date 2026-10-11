package com.github.zzave.teambalance.api.domain.model

/**
 * A team's bunq.me payment page. A value from [parse] has the form `https://bunq.me/{handle}`;
 * [restore] rebuilds persisted values unchecked.
 */
@JvmInline
value class BunqMeLink private constructor(val value: String) {
    /** False for a restored value that is not a bunq.me page, which nothing may redirect a member to. */
    val isBunqMePage: Boolean get() = value.startsWith(PAGE_PREFIX)

    companion object {
        private const val PAGE_PREFIX = "https://bunq.me/"
        const val MAX_LENGTH = 200
        private const val HOST = "bunq.me"
        private val SCHEME = Regex("^https?://", RegexOption.IGNORE_CASE)
        private val LINK = Regex("^${Regex.escape(HOST)}/([A-Za-z0-9_-]+)$", RegexOption.IGNORE_CASE)

        /** Rebuilds a persisted value; validation is for input, so an old stored link never breaks a read. */
        fun restore(stored: String) = BunqMeLink(stored)

        fun parse(raw: String): BunqMeLink {
            val trimmed = raw.trim()
            require(trimmed.length <= MAX_LENGTH) { "bunq.me link must be at most $MAX_LENGTH characters" }
            val handle = LINK.matchEntire(trimmed.replace(SCHEME, "").trimEnd('/'))?.groupValues?.get(1)
            requireNotNull(handle) { "Not a bunq.me link: https://bunq.me/{name}" }
            return BunqMeLink("https://$HOST/$handle")
        }
    }
}
