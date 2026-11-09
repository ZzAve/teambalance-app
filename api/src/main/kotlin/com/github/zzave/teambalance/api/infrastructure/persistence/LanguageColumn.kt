package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Language

// `users.language` is stored lowercase (V016), unlike the other enum columns.
internal fun Language.toDbValue(): String = when (this) {
    Language.NL -> "nl"
    Language.EN -> "en"
}

internal fun String.toLanguage(): Language = when (this) {
    "nl" -> Language.NL
    "en" -> Language.EN
    else -> error("Unknown language in the database: '$this'")
}
