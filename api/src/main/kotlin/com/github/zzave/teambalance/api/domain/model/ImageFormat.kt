package com.github.zzave.teambalance.api.domain.model

import java.security.MessageDigest

/** The two formats browsers encode uploads in (ADR-0038), read from the bytes, never from a request header. */
internal object ImageFormat {
    const val WEBP_TYPE = "image/webp"
    const val JPEG_TYPE = "image/jpeg"
    private const val WEBP_OFFSET = 8
    private const val VERSION_BYTES = 8
    private val RIFF = "RIFF".toByteArray()
    private val WEBP = "WEBP".toByteArray()
    private val JPEG_SOI = byteArrayOf(0xFF.toByte(), 0xD8.toByte(), 0xFF.toByte())

    /** WebP or JPEG, or null for anything else. */
    fun contentTypeOf(bytes: ByteArray): String? = when {
        bytes.startsWithAt(0, RIFF) && bytes.startsWithAt(WEBP_OFFSET, WEBP) -> WEBP_TYPE
        bytes.startsWithAt(0, JPEG_SOI) -> JPEG_TYPE
        else -> null
    }

    /** Derived from the content, so it changes exactly when the image does; clients put it in the image URL. */
    fun versionOf(bytes: ByteArray): String =
        MessageDigest.getInstance("SHA-256").digest(bytes).take(VERSION_BYTES).joinToString("") { "%02x".format(it) }

    private fun ByteArray.startsWithAt(offset: Int, prefix: ByteArray): Boolean =
        size >= offset + prefix.size && prefix.indices.all { this[offset + it] == prefix[it] }
}
