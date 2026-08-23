package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId

interface UserRepository {
    fun findById(id: UserId): User?
    fun findByEmail(email: Email): User?
    fun save(user: User): User

    /** A hint, not an authorization: the membership behind it may since have been revoked. */
    fun findLastActiveTeamId(userId: UserId): TeamId?

    /** Written on every switch, link-induced ones included, so a later sign-in lands back here. */
    fun rememberActiveTeam(userId: UserId, teamId: TeamId)
}
