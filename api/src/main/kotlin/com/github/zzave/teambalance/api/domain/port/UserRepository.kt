package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId

interface UserRepository {
    fun findById(id: UserId): User?
    fun findByEmail(email: String): User?
    fun save(user: User): User
}
