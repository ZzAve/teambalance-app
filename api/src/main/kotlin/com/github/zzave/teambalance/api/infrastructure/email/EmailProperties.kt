package com.github.zzave.teambalance.api.infrastructure.email

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Scaleway Transactional Email (TEM) config, bound from `teambalance.email.*`. Co-located with the
 * email adapters that consume it ([ScalewayTemEmailAdapter], [ScalewayTeamNotificationAdapter]). The secrets
 * (`api-key` / `project-id`) have no default, so it is registered under `@Profile("prod")` only (see
 * [EmailConfiguration]) — dev/test/e2e use the console/logging senders and never read it.
 */
@ConfigurationProperties(prefix = "teambalance.email")
data class EmailProperties(
    val fromName: String,
    val fromAddress: String,
    val apiKey: String,
    val projectId: String,
    val region: String,
)
