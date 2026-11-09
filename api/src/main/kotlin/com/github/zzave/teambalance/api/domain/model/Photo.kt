package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPhotoException
import com.github.zzave.teambalance.api.domain.exception.PhotoTooLargeException

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

    val contentType: String = ImageFormat.contentTypeOf(bytes) ?: throw InvalidPhotoException("Photo must be WebP or JPEG")

    val version: String by lazy { ImageFormat.versionOf(bytes) }

    companion object {
        const val MAX_BYTES = 200 * 1024
        const val WEBP_TYPE = ImageFormat.WEBP_TYPE
        const val JPEG_TYPE = ImageFormat.JPEG_TYPE
    }
}
