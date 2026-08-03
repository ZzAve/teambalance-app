package com.github.zzave.teambalance.api.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

/**
 * The platform-admin allowlist, bound from `teambalance.platform-admins` (comma-separated emails, via
 * PLATFORM_ADMIN_EMAILS). Fail-closed by design: the empty default means nobody is a platform admin.
 * Matching is case-insensitive and whitespace-trimmed. Consumed by the platform-admin guard
 * (creation-codes surface, #154 Slice 4) and as the audit recipients for team-created notifications.
 */
@Component
class PlatformAdmins(
    @Value("\${teambalance.platform-admins:}") rawEmails: List<String>,
) {
    private val emails: Set<String> = rawEmails.map { it.trim().lowercase() }.filter { it.isNotBlank() }.toSet()

    fun contains(email: String): Boolean = emails.contains(email.trim().lowercase())

    /** The configured admin emails, e.g. as audit-notification recipients. Empty when unset. */
    fun all(): Set<String> = emails
}
