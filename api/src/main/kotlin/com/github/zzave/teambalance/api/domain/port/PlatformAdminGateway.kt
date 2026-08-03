package com.github.zzave.teambalance.api.domain.port

import java.util.UUID

/**
 * Platform-level (cross-team) authorization: is the caller on the platform-admin allowlist?
 *
 * A port so the application layer can gate the codes-admin surface (#154 Slice 4) without depending
 * on the infrastructure guard that reads the allowlist config. Fail-closed by contract: an unknown
 * user or an empty allowlist authorizes nobody.
 *
 * SECURITY CONTRACT: [userId] MUST be the authenticated principal (from the session), never a
 * user-supplied id — otherwise the check is trivially bypassed.
 */
interface PlatformAdminGateway {
    fun isPlatformAdmin(userId: UUID): Boolean

    /** Throws [com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException] (→ 403)
     *  unless [userId] is a platform admin. */
    fun requirePlatformAdmin(userId: UUID)
}
