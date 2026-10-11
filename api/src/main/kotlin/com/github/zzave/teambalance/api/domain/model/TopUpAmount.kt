package com.github.zzave.teambalance.api.domain.model

/** A top-up in whole euros. */
@JvmInline
value class TopUpAmount(val euros: Int) {
    init {
        require(euros in MIN_EUROS..MAX_EUROS) { "Top-up amount must be between $MIN_EUROS and $MAX_EUROS euros" }
    }

    companion object {
        const val MIN_EUROS = 1
        const val MAX_EUROS = 500
    }
}
