package com.github.zzave.teambalance.api.domain.model

/**
 * The platform-admin allowlist: who may act on the platform itself (mint creation codes) and who
 * receives the platform audit mails. A policy value, not an adapter — infrastructure only binds it
 * from `teambalance.platform-admins` (see `PlatformAdminConfig`); the rule it encodes lives here so
 * both the authorization gateway and the notifier can read it without depending on each other.
 *
 * Fail-closed by design: the empty allowlist (the default) admits nobody. Matching is
 * whitespace-trimmed and case-insensitive, and blank entries are dropped so a trailing comma in the
 * configured value cannot widen the list.
 *
 * Deliberately keyed on raw [String] rather than [Email]: entries come from deployment config, and a
 * malformed one must be ignored (fail-closed), never fail construction of the allowlist.
 */
class PlatformAdminAllowlist(rawEmails: List<String>) {
    private val emails: Set<String> = rawEmails.map { it.trim().lowercase() }.filter { it.isNotBlank() }.toSet()

    fun contains(email: String): Boolean = emails.contains(email.trim().lowercase())

    /** The configured admin emails, e.g. as audit-notification recipients. Empty when unset. */
    fun all(): Set<String> = emails
}
