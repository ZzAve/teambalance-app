package com.github.zzave.teambalance.api.infrastructure.email

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

/**
 * Registers [EmailProperties] only in prod, where the Scaleway TEM senders — and their secrets — are
 * active. Binding it in dev/test would fail: `teambalance.email.api-key` / `project-id` have no default.
 */
@Configuration
@Profile("prod")
@EnableConfigurationProperties(EmailProperties::class)
class EmailConfiguration
