package com.github.zzave.teambalance.api.infrastructure.ratelimit

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

/**
 * Binds [RateLimitProperties]. Active in every profile (unlike the prod-only email config): the limiter
 * has safe defaults and no secrets, so dev, test and prod all get throttling — only the numbers differ.
 */
@Configuration
@EnableConfigurationProperties(RateLimitProperties::class)
class RateLimitConfiguration
