package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import org.springframework.stereotype.Component

@Component
class UserContextCurrentUserAdapter : CurrentUserGateway {
    override fun getCurrentUserId(): UserId? = UserContext.get()?.let(::UserId)
    override fun requireCurrentUserId(): UserId = UserId(UserContext.require())
}
