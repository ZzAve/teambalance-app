package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException
import com.github.zzave.teambalance.api.domain.model.PlatformAdminAllowlist
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * The [PlatformAdminGateway] adapter: authorizes a caller as a platform admin by resolving their email
 * (via [UserRepository]) and checking it against the [PlatformAdminAllowlist] — so the application
 * layer (codes-admin CRUD, #154 Slice 4) can gate on the port without reaching into infrastructure.
 *
 * Fail-closed: an unknown user or an empty allowlist (the default) forbids everyone. The no-arg
 * [requirePlatformAdmin] convenience reads the caller from [UserContext], mirroring how
 * `SessionTenantContextFilter` reads the authenticated user.
 */
@Component
class PlatformAdminGatewayAdapter(
    private val userRepository: UserRepository,
    private val platformAdmins: PlatformAdminAllowlist,
) : PlatformAdminGateway {

    /** Throws [NotPlatformAdminException] (→ 403) unless the current caller is on the allowlist. */
    fun requirePlatformAdmin() = requirePlatformAdmin(UserContext.require())

    override fun requirePlatformAdmin(userId: UUID) {
        if (!isPlatformAdmin(userId)) {
            throw NotPlatformAdminException(userId)
        }
    }

    override fun isPlatformAdmin(userId: UUID): Boolean {
        val email = userRepository.findById(UserId(userId))?.email ?: return false
        return platformAdmins.contains(email.value)
    }
}
