package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.port.UserRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository

@Repository
class JpaUserRepositoryAdapter(
    private val jpaRepository: SpringDataUserRepository,
) : UserRepository {

    override fun findByEmail(email: String): User? =
        jpaRepository.findByEmail(email)?.internalize()

    override fun save(user: User): User =
        jpaRepository.save(user.externalize()).internalize()
}
