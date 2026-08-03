package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * The identity of a [User]. Same shape and the same edges-only conversion as [EventId], which
 * documents the pattern.
 *
 * This is the identity the whole application reasons about: who is calling, whose attendance a row
 * records, who created an event. It travels across every aggregate, which is exactly why it is worth
 * a type — a raw `UUID` here is interchangeable with a team's, and the compiler could not tell.
 */
@JvmInline
value class UserId(val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        /** Mints an identity for a user signing in for the first time, before their row exists. */
        fun random(): UserId = UserId(UUID.randomUUID())
    }
}
