package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AccountService
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListPasskeys
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetLanguage
import org.springframework.web.bind.annotation.RestController
import com.github.zzave.teambalance.api.domain.model.Language as DomainLanguage
import com.github.zzave.teambalance.api.interfaces.generated.model.Language
import com.github.zzave.teambalance.api.interfaces.generated.model.Passkey
import com.github.zzave.teambalance.api.domain.model.Passkey as DomainPasskey

/** The caller's own settings that are not tied to a Team (ADR-0043). */
@RestController
class AccountController(
    private val accountService: AccountService,
) : SetLanguage.Handler, ListPasskeys.Handler {

    override suspend fun setLanguage(request: SetLanguage.Request): SetLanguage.Response<*> =
        if (accountService.chooseLanguage(request.body.language.consume())) SetLanguage.Response204 else SetLanguage.Response401

    override suspend fun listPasskeys(request: ListPasskeys.Request): ListPasskeys.Response<*> =
        accountService.listPasskeys()?.let { ListPasskeys.Response200(it.map(DomainPasskey::produce)) } ?: ListPasskeys.Response401
}

// The Wirespec edge for a language: the contract and the domain name the same two values.
internal fun Language.consume(): DomainLanguage = DomainLanguage.valueOf(name)

internal fun DomainLanguage.produce(): Language = Language.valueOf(name)

internal fun DomainPasskey.produce() = Passkey(
    id = id.value,
    label = label.value,
    createdAt = createdAt.toString(),
    lastUsedAt = lastUsedAt?.toString(),
)
