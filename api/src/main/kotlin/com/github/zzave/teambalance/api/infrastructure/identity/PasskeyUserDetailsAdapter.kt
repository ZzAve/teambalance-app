package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component

/**
 * Spring's WebAuthn configurer demands a [UserDetailsService] and reads only the authorities from it;
 * this app's roles are per Team, so there are none here (ADR-0045).
 */
@Component
class PasskeyUserDetailsAdapter(
    private val userRepository: UserRepository,
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByEmail(Email(username)) ?: throw UsernameNotFoundException(username)
        return User.withUsername(user.email.value).password("").authorities(emptyList<GrantedAuthority>()).build()
    }
}
