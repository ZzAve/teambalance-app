package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.externalize
import com.github.zzave.teambalance.api.infrastructure.persistence.mapper.internalize
import org.springframework.stereotype.Repository

@Repository
class JpaMagicLinkTokenRepositoryAdapter(
    private val jpaRepository: SpringDataMagicLinkTokenRepository,
) : MagicLinkTokenRepository {

    override fun save(token: MagicLinkToken): MagicLinkToken =
        jpaRepository.save(token.externalize()).internalize()

    override fun findByTokenHash(tokenHash: String): MagicLinkToken? =
        jpaRepository.findByTokenHash(tokenHash)?.internalize()
}
