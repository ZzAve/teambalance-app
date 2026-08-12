package com.github.zzave.teambalance.api.domain.model

/** A team's human-facing name. */
@JvmInline
value class TeamName(val value: String) {
    override fun toString(): String = value
}
