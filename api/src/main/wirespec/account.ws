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

// A passkey the caller registered (ADR-0045). `id` is the WebAuthn credential id, base64url - the same string Spring Security's DELETE /webauthn/register/{id} takes. Timestamps are ISO-8601 instants.
type Passkey {
    id: String,
    label: String,
    createdAt: String,
    lastUsedAt: String?
}

endpoint ListPasskeys GET /api/account/passkeys -> {
    200 -> Passkey[]
    401 -> Unit
}
