package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * A value as [TokenCipher] stored it before AAD existed, built with plain `javax.crypto` and no `updateAAD`:
 * base64(iv || ciphertext || tag). The invite and calendar links already in the database look like this, so a
 * test that opens one through the service proves those callers still use no AAD.
 */
internal fun legacyEncrypt(key: ByteArray, plaintext: String): EncryptedToken {
    val iv = ByteArray(12).also { SecureRandom().nextBytes(it) }
    val sealed = Cipher.getInstance("AES/GCM/NoPadding").apply {
        init(Cipher.ENCRYPT_MODE, SecretKeySpec(key, "AES"), GCMParameterSpec(128, iv))
    }.doFinal(plaintext.toByteArray())
    return EncryptedToken(Base64.getEncoder().encodeToString(iv + sealed))
}
