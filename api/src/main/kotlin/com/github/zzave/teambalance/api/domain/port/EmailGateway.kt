package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language

interface EmailGateway {
    fun sendMagicLink(email: Email, token: String, language: Language)

    /** Tells one Platform Admin ([adminEmail], from the allowlist config) that a team was requested (Dutch only). */
    fun sendTeamRequested(adminEmail: String, requesterEmail: Email, teamName: String, purpose: String)

    fun sendTeamRequestReceived(to: Email, teamName: String, purpose: String, language: Language)

    /** The approved mail carries a link to create-team with [code] and [teamName] prefilled. */
    fun sendTeamRequestApproved(to: Email, teamName: String, code: CreationCode, language: Language)

    fun sendTeamRequestRejected(to: Email, teamName: String, reason: String?, language: Language)
}
