// The language a person reads TeamBalance in (ADR-0043). Stored on the user, so it follows them to every device and the API can pick the language of the emails it sends them.
enum Language {
    NL,
    EN
}

type SetLanguageRequest {
    language: Language
}

endpoint SetLanguage PUT SetLanguageRequest /api/account/language -> {
    204 -> Unit
    401 -> Unit
}
