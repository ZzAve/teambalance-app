package com.github.zzave.teambalance.api.infrastructure.bunq

/**
 * Which Bunq the platform's OAuth client talks to. [NONE] means no Bunq at all: the fake outside prod,
 * the unconfigured gateway in prod.
 */
enum class BunqEnvironment { NONE, SANDBOX, PRODUCTION }
