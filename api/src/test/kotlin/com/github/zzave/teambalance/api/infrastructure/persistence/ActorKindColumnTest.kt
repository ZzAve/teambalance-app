package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.ActorKind
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class ActorKindColumnTest : FunSpec({

    test("every constant survives a round trip through its stored value") {
        ActorKind.entries.forEach { it.toDbValue().toActorKind() shouldBe it }
    }

    test("stores each constant under its own name, as before the mapping was explicit") {
        ActorKind.entries.forEach { it.toDbValue() shouldBe it.name }
    }

    test("an unknown stored value is corrupt data, not a client error") {
        shouldThrow<IllegalStateException> { "BOGUS".toActorKind() }
            .message shouldBe "Unknown actor kind in the database: 'BOGUS'"
    }
})
