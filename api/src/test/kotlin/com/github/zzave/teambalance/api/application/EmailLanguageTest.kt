package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Language
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class EmailLanguageTest : FunSpec({
    test("the stored language wins over the page's") {
        emailLanguage(stored = Language.NL, requested = Language.EN) shouldBe Language.NL
        emailLanguage(stored = Language.EN, requested = Language.NL) shouldBe Language.EN
    }

    test("with nothing stored, the page's language is used") {
        emailLanguage(stored = null, requested = Language.EN) shouldBe Language.EN
    }

    test("with neither, Dutch") {
        emailLanguage(stored = null, requested = null) shouldBe Language.NL
    }
})
