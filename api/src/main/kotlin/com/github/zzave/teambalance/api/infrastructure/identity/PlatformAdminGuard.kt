package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.UserRepository
import com.github.zzave.teambalance.api.infrastructure.config.PlatformAdmins
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * Authorizes the current caller as a platform admin by resolving their email (via [UserRepository])
 * and checking it against the [PlatformAdmins] allowlist. Reads the caller from [UserContext], mirroring
 * how `SessionTenantContextFilter` reads the authenticated user.
 *
 * Fail-closed: an unknown user or an empty allowlist (the default) forbids everyone. Built here for
 * #154 Slice 2; wired to the creation-codes admin surface in Slice 4.
 */
@Component
class PlatformAdminGuard(
    private val userRepository: UserRepository,
    private val platformAdmins: PlatformAdmins,
) {
    /** Throws [NotPlatformAdminException] (→ 403) unless the current caller is on the allowlist. */
    fun requirePlatformAdmin() {
        val userId = UserContext.require()
        if (!isPlatformAdmin(userId)) {
            throw NotPlatformAdminException(userId)
        }
    }

    fun isPlatformAdmin(userId: UUID): Boolean {
        val email = userRepository.findById(UserId(userId))?.email ?: return false
        return platformAdmins.contains(email.value)
    }
}
