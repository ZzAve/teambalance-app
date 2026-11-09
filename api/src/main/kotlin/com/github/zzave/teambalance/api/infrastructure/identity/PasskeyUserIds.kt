package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.model.UserId
import org.springframework.security.web.webauthn.api.Bytes
import java.nio.ByteBuffer
import java.util.UUID

/** The WebAuthn user handle of a user is the 16 bytes of their id. */
internal fun UserId.toBytes(): Bytes =
    Bytes(ByteBuffer.allocate(Long.SIZE_BYTES * 2).putLong(value.mostSignificantBits).putLong(value.leastSignificantBits).array())

internal fun Bytes.toUserId(): UserId =
    ByteBuffer.wrap(bytes).let { UserId(UUID(it.long, it.long)) }
