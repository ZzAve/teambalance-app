package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.User

interface UserRepository {
    fun findByEmail(email: String): User?
    fun save(user: User): User
}
