package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class PasskeyUserIdsTest : FunSpec({
    test("a user id survives the trip to WebAuthn user handle bytes and back") {
        val userId = UserId.random()

        userId.toBytes().bytes.size shouldBe 16
        userId.toBytes().toUserId() shouldBe userId
    }
})
