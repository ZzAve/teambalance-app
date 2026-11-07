package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AccountService
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetLanguage
import org.springframework.web.bind.annotation.RestController
import com.github.zzave.teambalance.api.domain.model.Language as DomainLanguage
import com.github.zzave.teambalance.api.interfaces.generated.model.Language

/** The caller's own settings that are not tied to a Team (ADR-0043). */
@RestController
class AccountController(
    private val accountService: AccountService,
) : SetLanguage.Handler {

    override suspend fun setLanguage(request: SetLanguage.Request): SetLanguage.Response<*> =
        if (accountService.chooseLanguage(request.body.language.consume())) SetLanguage.Response204 else SetLanguage.Response401
}

// The Wirespec edge for a language: the contract and the domain name the same two values.
internal fun Language.consume(): DomainLanguage = when (this) {
    Language.NL -> DomainLanguage.NL
    Language.EN -> DomainLanguage.EN
}

internal fun DomainLanguage.produce(): Language = when (this) {
    DomainLanguage.NL -> Language.NL
    DomainLanguage.EN -> Language.EN
}
