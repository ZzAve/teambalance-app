package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.TopUpUnavailableException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TopUpAmount
import com.github.zzave.teambalance.api.domain.model.TopUpDescription
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

/** Builds the bunq.me payment link a member follows to top up the pool. Needs no Bunq Connection. */
class TopUpService(
    private val settingsRepository: MoneyPoolSettingsRepository,
    private val teamRepository: TeamRepository,
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun topUpLink(userId: UserId, teamId: TeamId, amount: TopUpAmount): String {
        val settings = settingsRepository.get()
        val link = settings.bunqMeLink?.takeIf { settings.enabled } ?: throw TopUpUnavailableException()
        val team = checkNotNull(teamRepository.findById(teamId)) { "Team $teamId has no row" }
        val member = checkNotNull(teamMemberRepository.findDisplayName(userId)) { "Member $userId has no display name" }
        val description = TopUpDescription.of(team.name.value, member.value, userId.toString())
        return "${link.value}/${amount.euros}/${percentEncode(description)}"
    }

    private fun percentEncode(text: String) =
        URLEncoder.encode(text, StandardCharsets.UTF_8).replace("+", "%20")
}
