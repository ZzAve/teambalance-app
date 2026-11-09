package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Language
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class LanguageColumnTest : FunSpec({

    test("every constant survives a round trip through its stored value") {
        Language.entries.forEach { it.toDbValue().toLanguage() shouldBe it }
    }

    test("is stored lowercase") {
        Language.NL.toDbValue() shouldBe "nl"
        Language.EN.toDbValue() shouldBe "en"
    }

    test("refuses the uppercase spelling, which is not what the column holds") {
        shouldThrow<IllegalStateException> { "NL".toLanguage() }
    }

    test("an unknown stored value is corrupt data, not a client error") {
        shouldThrow<IllegalStateException> { "BOGUS".toLanguage() }
            .message shouldBe "Unknown language in the database: 'BOGUS'"
    }
})
