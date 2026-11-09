package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.AttendanceState
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class AttendanceStateColumnTest : FunSpec({

    test("every constant survives a round trip through its stored value") {
        AttendanceState.entries.forEach { it.toDbValue().toAttendanceState() shouldBe it }
    }

    test("stores each constant under its own name, as before the mapping was explicit") {
        AttendanceState.entries.forEach { it.toDbValue() shouldBe it.name }
    }

    test("an unknown stored value is corrupt data, not a client error") {
        shouldThrow<IllegalStateException> { "BOGUS".toAttendanceState() }
            .message shouldBe "Unknown attendance state in the database: 'BOGUS'"
    }
})
