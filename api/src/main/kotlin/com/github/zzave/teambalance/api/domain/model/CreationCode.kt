package com.github.zzave.teambalance.api.domain.model

/** A one-time team-creation code; [toString] is masked because it is a bearer credential. */
@JvmInline
value class CreationCode(val value: String) {
    override fun toString(): String = "CreationCode(****)"
}
