package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.domain.model.PlatformAdminAllowlist
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * Binds the [PlatformAdminAllowlist] from `teambalance.platform-admins` (comma-separated emails, via
 * PLATFORM_ADMIN_EMAILS). Pure wiring: the empty default and the fail-closed, case-insensitive
 * matching are the allowlist's own rules, not this class's.
 */
@Configuration
class PlatformAdminConfig {

    @Bean
    fun platformAdminAllowlist(
        @Value("\${teambalance.platform-admins:}") rawEmails: List<String>,
    ) = PlatformAdminAllowlist(rawEmails)
}
