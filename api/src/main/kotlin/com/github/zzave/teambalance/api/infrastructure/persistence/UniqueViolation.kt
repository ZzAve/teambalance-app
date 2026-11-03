package com.github.zzave.teambalance.api.infrastructure.persistence

import org.springframework.dao.DataIntegrityViolationException

/**
 * Runs [block]; a unique violation on [constraint] is rethrown as the domain exception from [toError],
 * any other integrity violation is left as it is.
 */
internal inline fun <T> refusingDuplicate(constraint: String, toError: () -> Exception, block: () -> T): T =
    try {
        block()
    } catch (e: DataIntegrityViolationException) {
        if (e.mostSpecificCause.message?.contains(constraint) == true) throw toError()
        throw e
    }
