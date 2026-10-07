package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * Storage for the two photos (ADR-0038). It sits behind this port so object storage can replace
 * Postgres without touching the callers.
 *
 * The personal photo belongs to the person (platform schema). The team photo is scoped by the routed
 * tenant schema, like member profiles, so it takes no team id.
 */
interface PhotoRepository {
    fun findPersonal(userId: UserId): Photo?

    /** Just the version, for callers that only need to say whether and which photo exists. */
    fun findPersonalVersion(userId: UserId): String?
    fun savePersonal(userId: UserId, photo: Photo)
    fun deletePersonal(userId: UserId)

    fun findTeam(userId: UserId): Photo?
    fun saveTeam(userId: UserId, photo: Photo)
    fun deleteTeam(userId: UserId)
}
