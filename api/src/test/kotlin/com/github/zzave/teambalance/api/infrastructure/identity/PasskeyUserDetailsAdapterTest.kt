package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.TeamDirectory
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import org.springframework.security.core.userdetails.UsernameNotFoundException

class PasskeyUserDetailsAdapterTest : FunSpec({
    val user = User(UserId.random(), Email("passkey@test.com"), DisplayName("Passkey Person"))
    val service = PasskeyUserDetailsAdapter(TeamDirectory().userRepository(user))

    test("a known email loads a user without authorities") {
        val details = service.loadUserByUsername("passkey@test.com")

        details.username shouldBe "passkey@test.com"
        details.authorities.shouldBeEmpty()
    }

    test("an unknown email is refused") {
        shouldThrow<UsernameNotFoundException> { service.loadUserByUsername("nobody@test.com") }
    }
})
