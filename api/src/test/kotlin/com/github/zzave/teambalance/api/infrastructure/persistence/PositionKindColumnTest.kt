package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.PositionKind
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class PositionKindColumnTest : FunSpec({

    test("every constant survives a round trip through its stored value") {
        PositionKind.entries.forEach { it.toDbValue().toPositionKind() shouldBe it }
    }

    test("stores the values the CHECK constraint allows") {
        PositionKind.PLAYING.toDbValue() shouldBe "PLAYING"
        PositionKind.STAFF.toDbValue() shouldBe "STAFF"
    }

    test("an unknown stored value is corrupt data, not a client error") {
        shouldThrow<IllegalStateException> { "BOGUS".toPositionKind() }
            .message shouldBe "Unknown position kind in the database: 'BOGUS'"
    }
})
