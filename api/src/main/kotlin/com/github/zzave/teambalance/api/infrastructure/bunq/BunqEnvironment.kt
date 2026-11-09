package com.github.zzave.teambalance.api.infrastructure.bunq

/**
 * Which Bunq the platform's OAuth client talks to. [NONE] means no Bunq at all: the fake outside prod,
 * the unconfigured gateway in prod. [FAKE] is the fake Bunq everywhere, in prod only while the demo switch is on.
 */
enum class BunqEnvironment { NONE, FAKE, SANDBOX, PRODUCTION }
