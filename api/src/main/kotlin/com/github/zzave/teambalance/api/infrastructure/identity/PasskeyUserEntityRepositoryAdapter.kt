package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.security.web.webauthn.api.Bytes
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCredentialUserEntity
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * Read-only view of `users` as WebAuthn user entities (ADR-0045). The name Spring passes to
 * [findByUsername] is the authenticated principal's, which [SessionUserContextFilter] sets to the user id.
 */
@Component
class PasskeyUserEntityRepositoryAdapter(
    private val userRepository: UserRepository,
) : PublicKeyCredentialUserEntityRepository {

    override fun findByUsername(username: String): PublicKeyCredentialUserEntity? =
        runCatching { UserId(UUID.fromString(username)) }.getOrNull()?.let(::entityOf)

    override fun findById(id: Bytes): PublicKeyCredentialUserEntity? =
        // A handle of the wrong length is not one of ours.
        id.bytes.takeIf { it.size == USER_HANDLE_BYTES }?.let { entityOf(id.toUserId()) }

    // Every session user exists, so Spring never has a new entity to store; failing loudly beats writing a stray id.
    override fun save(userEntity: PublicKeyCredentialUserEntity): Nothing =
        throw UnsupportedOperationException("passkey user entities are the users table")

    override fun delete(id: Bytes): Nothing =
        throw UnsupportedOperationException("passkey user entities are the users table")

    private fun entityOf(userId: UserId): PublicKeyCredentialUserEntity? =
        userRepository.findById(userId)?.let {
            ImmutablePublicKeyCredentialUserEntity.builder()
                .id(userId.toBytes())
                .name(it.email.value)
                .displayName(it.displayName.value)
                .build()
        }

    private companion object {
        const val USER_HANDLE_BYTES = 16
    }
}
