package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Role
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class RoleColumnTest : FunSpec({

    test("every constant survives a round trip through its stored value") {
        Role.entries.forEach { it.toDbValue().toRole() shouldBe it }
    }

    test("stores each constant under its own name, as before the mapping was explicit") {
        Role.entries.forEach { it.toDbValue() shouldBe it.name }
    }

    test("an unknown stored value is corrupt data, not a client error") {
        shouldThrow<IllegalStateException> { "BOGUS".toRole() }
            .message shouldBe "Unknown role in the database: 'BOGUS'"
    }
})
