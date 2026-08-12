package com.github.zzave.teambalance.api.domain.model

/** An [EventType]'s accent colour, as a `#rrggbb` hex triplet. */
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
