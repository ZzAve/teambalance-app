package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.TokenCipher
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * The key a team's Bunq OAuth grant is stored under (ADR-0042), read at startup in every profile like
 * the invitation and calendar-link keys: no default, so a missing or malformed
 * `TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY` stops the app from starting whether or not connecting is on.
 */
@Configuration
class BunqGrantCipherConfiguration {

    @Bean(BEAN_NAME)
    fun bunqGrantCipher(@Value("\${teambalance.bunq.token-encryption-key}") encodedKey: String) =
        TokenCipher.fromBase64Key(encodedKey, "teambalance.bunq.token-encryption-key")

    companion object {
        /** Two TokenCipher beans would make injection by type ambiguous; the name picks this one. */
        const val BEAN_NAME = "bunqGrantCipher"
    }
}
