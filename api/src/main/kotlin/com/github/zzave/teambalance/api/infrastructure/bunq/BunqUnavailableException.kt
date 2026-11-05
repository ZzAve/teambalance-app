package com.github.zzave.teambalance.api.infrastructure.bunq

/** Bunq did not give an answer: it timed out, is being left alone after a 429, or answered with something unusable. Carries no secrets. */
class BunqUnavailableException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
