package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.application.CurrentUserProvider
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class UserContextCurrentUserProvider : CurrentUserProvider {
    override fun getCurrentUserId(): UUID? = UserContext.get()
    override fun requireCurrentUserId(): UUID = UserContext.require()
}
