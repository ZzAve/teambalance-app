package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Language
import com.github.zzave.teambalance.api.domain.model.Passkey
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AuthSessionGateway
import com.github.zzave.teambalance.api.domain.port.PasskeyRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository

/** A person's own settings that are not tied to a Team. */
class AccountService(
    private val userRepository: UserRepository,
    private val authSessionGateway: AuthSessionGateway,
    private val passkeyRepository: PasskeyRepository,
) {
    /** Null until the user chooses one (ADR-0043). */
    fun languageOf(userId: UserId): Language? = userRepository.findLanguage(userId)

    /** Stores the caller's language; false when there is no session to store it for. */
    fun chooseLanguage(language: Language): Boolean {
        val userId = authSessionGateway.currentUserId() ?: return false
        userRepository.saveLanguage(userId, language)
        return true
    }

    /** The caller's passkeys (ADR-0045); null when there is no session. */
    fun listPasskeys(): List<Passkey>? = authSessionGateway.currentUserId()?.let(passkeyRepository::findAllFor)

    fun passkeyCountOf(userId: UserId): Int = passkeyRepository.countFor(userId)
}
