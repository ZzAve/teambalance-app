package com.github.zzave.teambalance.api.domain.model

/** A team's URL identity, chosen at team creation. */
@JvmInline
value class Slug(val value: String) {
    override fun toString(): String = value
}
