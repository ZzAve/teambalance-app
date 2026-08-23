package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.UserRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

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

    // Read and written as a bare column rather than through UserJpaEntity: the Active Team memory is
    // routing state, not part of the User aggregate the rest of the app maps, and keeping it off the
    // entity stops a stale in-memory User from overwriting a switch made on another device.
    override fun findLastActiveTeamId(userId: UserId): TeamId? =
        jpaRepository.findLastActiveTeamId(userId.value)?.let(::TeamId)

    @Transactional
    override fun rememberActiveTeam(userId: UserId, teamId: TeamId) {
        jpaRepository.updateLastActiveTeamId(userId.value, teamId.value)
    }
}
