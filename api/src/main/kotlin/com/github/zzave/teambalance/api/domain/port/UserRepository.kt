package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId

interface UserRepository {
    fun findById(id: UserId): User?
    fun findByEmail(email: Email): User?
    fun save(user: User): User
}
