package com.github.zzave.teambalance.api.domain.model

/** The name a [User] (and their [TeamMember]) is shown under. */
@JvmInline
value class DisplayName(val value: String) {
    override fun toString(): String = value
}
