package com.github.zzave.teambalance.api.domain.model

/** The name of a team's tenant schema. */
@JvmInline
value class SchemaName(val value: String) {
    override fun toString(): String = value
}
