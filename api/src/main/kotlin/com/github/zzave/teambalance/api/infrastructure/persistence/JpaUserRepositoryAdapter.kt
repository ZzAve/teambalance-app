package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.UserRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository

@Repository
class JpaUserRepositoryAdapter(
    private val jpaRepository: SpringDataUserRepository,
) : UserRepository {

    override fun findById(id: UserId): User? =
        jpaRepository.findById(id.value).orElse(null)?.internalize()

    override fun findByEmail(email: Email): User? =
        jpaRepository.findByEmail(email.value)?.internalize()

    override fun save(user: User): User =
        jpaRepository.save(user.externalize()).internalize()
}
