package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * The identity of a team. Same shape and the same edges-only conversion as [EventId], which
 * documents the pattern.
 *
 * Every tenant-scoped use case takes one alongside a [UserId], and the two were the pair most easily
 * transposed while both were bare UUIDs — `requireAdmin(userId, teamId)` compiled just as happily
 * with its arguments the wrong way round. It now does not.
 *
 * No `random()` factory: teams are provisioned outside this application (see the tenant migration
 * runner), so the domain only ever reads an identity it was given.
 */
@JvmInline
value class TeamId(val value: UUID) {
    override fun toString(): String = value.toString()
}
