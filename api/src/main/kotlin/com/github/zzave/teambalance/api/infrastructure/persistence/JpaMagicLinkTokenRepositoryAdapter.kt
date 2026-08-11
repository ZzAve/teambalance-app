package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.UserJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class JpaMagicLinkTokenRepositoryAdapter(
    private val jpaRepository: SpringDataMagicLinkTokenRepository,
    private val userJpaRepository: SpringDataUserRepository,
) : MagicLinkTokenRepository {

    override fun save(token: MagicLinkToken): MagicLinkToken =
        jpaRepository.save(token.externalize()).internalize()

    override fun findByTokenHash(tokenHash: TokenHash): MagicLinkToken? =
        jpaRepository.findByTokenHash(tokenHash.value)?.internalize()

    @Transactional
    override fun consumeAndResolveUser(consumedToken: MagicLinkToken, displayName: DisplayName): User {
        jpaRepository.save(consumedToken.externalize())
        return (
            userJpaRepository.findByEmail(consumedToken.email.value)
                ?: userJpaRepository.save(
                    UserJpaEntity(
                        id = UUID.randomUUID(),
                        email = consumedToken.email.value,
                        displayName = displayName.value,
                    ),
                )
            ).internalize()
    }
}
