package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPhotoException
import com.github.zzave.teambalance.api.domain.exception.PhotoTooLargeException
import java.security.MessageDigest

/**
 * A square picture of a person as the browser encoded it (ADR-0038): WebP, or JPEG where the browser
 * cannot encode WebP (Safari). The format is read from the bytes, never from a request header.
 *
 * [version] is derived from the content, so it changes exactly when the image does; clients put it in
 * the image URL to cache it for good.
 */
class Photo(val bytes: ByteArray) {
    init {
        if (bytes.isEmpty()) throw InvalidPhotoException("Photo is empty")
        if (bytes.size > MAX_BYTES) throw PhotoTooLargeException(MAX_BYTES)
    }

    val contentType: String = when {
        bytes.startsWithAt(0, RIFF) && bytes.startsWithAt(WEBP_OFFSET, WEBP) -> WEBP_TYPE
        bytes.startsWithAt(0, JPEG_SOI) -> JPEG_TYPE
        else -> throw InvalidPhotoException("Photo must be WebP or JPEG")
    }

    val version: String by lazy {
        MessageDigest.getInstance("SHA-256").digest(bytes).take(VERSION_BYTES)
            .joinToString("") { "%02x".format(it) }
    }

    private fun ByteArray.startsWithAt(offset: Int, prefix: ByteArray): Boolean =
        size >= offset + prefix.size && prefix.indices.all { this[offset + it] == prefix[it] }

    companion object {
        const val MAX_BYTES = 200 * 1024
        const val WEBP_TYPE = "image/webp"
        const val JPEG_TYPE = "image/jpeg"
        private const val WEBP_OFFSET = 8
        private const val VERSION_BYTES = 8
        private val RIFF = "RIFF".toByteArray()
        private val WEBP = "WEBP".toByteArray()
        private val JPEG_SOI = byteArrayOf(0xFF.toByte(), 0xD8.toByte(), 0xFF.toByte())
    }
}
