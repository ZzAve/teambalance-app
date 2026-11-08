package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.TeamDirectory
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import org.springframework.security.web.webauthn.api.Bytes

class PasskeyUserEntityRepositoryAdapterTest : FunSpec({
    val user = User(UserId.random(), Email("passkey@test.com"), DisplayName("Passkey Person"))
    val repository = PasskeyUserEntityRepositoryAdapter(TeamDirectory().userRepository(user))

    test("the user id string finds the user as a WebAuthn user entity") {
        val entity = repository.findByUsername(user.id.value.toString())!!

        entity.id shouldBe user.id.toBytes()
        entity.name shouldBe "passkey@test.com"
        entity.displayName shouldBe "Passkey Person"
    }

    test("the user handle bytes find the same entity") {
        repository.findById(user.id.toBytes())!!.name shouldBe "passkey@test.com"
    }

    test("an unknown user, a non-UUID name and a handle of the wrong length find nothing") {
        repository.findByUsername(UserId.random().value.toString()) shouldBe null
        repository.findByUsername("passkey@test.com") shouldBe null
        repository.findById(UserId.random().toBytes()) shouldBe null
        repository.findById(Bytes(ByteArray(3))) shouldBe null
    }

    test("saving or deleting an entity is refused") {
        val entity = repository.findByUsername(user.id.value.toString())!!

        shouldThrow<UnsupportedOperationException> { repository.save(entity) }
        shouldThrow<UnsupportedOperationException> { repository.delete(entity.id) }
    }
})
