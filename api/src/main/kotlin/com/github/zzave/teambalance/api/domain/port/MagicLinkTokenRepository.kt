package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.TokenHash

interface MagicLinkTokenRepository {
    fun save(token: MagicLinkToken): MagicLinkToken
    fun findByTokenHash(tokenHash: TokenHash): MagicLinkToken?
}
