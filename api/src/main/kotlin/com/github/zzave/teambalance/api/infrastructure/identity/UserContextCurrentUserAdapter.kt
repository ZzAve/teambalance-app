package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class UserContextCurrentUserAdapter : CurrentUserGateway {
    override fun getCurrentUserId(): UUID? = UserContext.get()
    override fun requireCurrentUserId(): UUID = UserContext.require()
}
