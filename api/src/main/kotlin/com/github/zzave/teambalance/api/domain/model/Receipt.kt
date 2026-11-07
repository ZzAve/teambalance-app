package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidReceiptException
import com.github.zzave.teambalance.api.domain.exception.ReceiptTooLargeException

/**
 * A picture of the receipt for an expense, as the browser shrank and encoded it: WebP, or JPEG where the
 * browser cannot encode WebP. Like [Photo], the format is read from the bytes and [version] from the content.
 */
class Receipt(val bytes: ByteArray) {
    init {
        if (bytes.size > MAX_BYTES) throw ReceiptTooLargeException(MAX_BYTES)
    }

    val contentType: String = ImageFormat.contentTypeOf(bytes) ?: throw InvalidReceiptException("Receipt must be WebP or JPEG")

    val version: String by lazy { ImageFormat.versionOf(bytes) }

    companion object {
        const val MAX_BYTES = 500 * 1024
    }
}
