package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.MagicLinkToken

interface MagicLinkTokenRepository {
    fun save(token: MagicLinkToken): MagicLinkToken
}
