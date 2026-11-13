package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.DemoTopUpLinkLockedException
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolOverview
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.PaymentAttribution
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.BeerCount
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.ReceiptRepository
import com.github.zzave.teambalance.api.domain.port.PaymentAliasRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository

class MoneyPoolService(
    private val settingsRepository: MoneyPoolSettingsRepository,
    private val connectionRepository: BunqConnectionRepository,
    private val authorizationService: AuthorizationService,
    private val cache: MoneyPoolCacheGateway,
    private val receiptRepository: ReceiptRepository,
    private val paymentAliasRepository: PaymentAliasRepository,
    private val teamMemberRepository: TeamMemberRepository,
    /** The demo team on the demo container (ADR-0043), else null: its top-up link is fixed,
     * so a visitor cannot point the Top up button elsewhere. */
    private val demoTeam: TeamId? = null,
) {
    /**
     * Readable by any member. What Bunq answered ([MoneyPoolReader]) is remembered per team by [cache];
     * the beer figures come from the current settings. Payments are attributed for [viewerId] (see [withMembers]).
     */
    fun getMoneyPool(teamId: TeamId, viewerId: UserId): MoneyPoolOverview {
        val settings = settingsRepository.get()
        val cached = if (settings.enabled) {
            connectionRepository.find()?.accountId?.let { cache.read(teamId, it) }
                ?: CachedMoneyPool(MoneyPool.NotConnected, refreshing = false)
        } else {
            CachedMoneyPool(MoneyPool.Off, refreshing = false)
        }
        val pool = cached.pool.withBeerFigures(settings).withReceiptVersions().withMembers(teamId, viewerId)
        return MoneyPoolOverview(pool, canTopUp = settings.topUpLink != null, refreshing = cached.refreshing)
    }

    /** Whether the current team switched the money pool on; read by every member's navigation. */
    fun isEnabled(): Boolean = settingsRepository.get().enabled

    fun getSettings(callerId: UserId, teamId: TeamId): MoneyPoolSettings {
        authorizationService.requireAdmin(callerId, teamId)
        return settingsRepository.get()
    }

    /** Admin-only. Replaces all settings; a null price or link clears it. In demo mode the link may not change. */
    fun updateSettings(callerId: UserId, teamId: TeamId, settings: MoneyPoolSettings): MoneyPoolSettings {
        authorizationService.requireAdmin(callerId, teamId)
        if (teamId == demoTeam && settings.bunqMeLink != settingsRepository.get().bunqMeLink) throw DemoTopUpLinkLockedException()
        return settingsRepository.save(settings)
    }

    // Read after the cache: the cache holds only what Bunq answered, receipts change in between.
    private fun MoneyPool.withReceiptVersions(): MoneyPool =
        if (this is MoneyPool.Connected) copy(receiptVersions = receiptRepository.findVersions(payments.map { it.id })) else this

    private fun MoneyPool.withBeerFigures(settings: MoneyPoolSettings): MoneyPool =
        if (this is MoneyPool.Connected) {
            copy(beerPrice = settings.beerPrice, beerCount = settings.beerPrice?.let { BeerCount.buying(balance, it) })
        } else {
            this
        }

    // Done after the cache read, not inside it, so a new alias counts at once instead of when the cached pool expires.
    // A matched payment shows the member's display name; the counterparty name (what the alias matched) is
    // kept for the viewer who is an Admin or is that member, and left out for everyone else (ADR-0046).
    private fun MoneyPool.withMembers(teamId: TeamId, viewerId: UserId): MoneyPool {
        if (this !is MoneyPool.Connected || payments.isEmpty()) return this
        val aliases = paymentAliasRepository.findAll()
        val members = teamMemberRepository.findByTeamId(teamId).associateBy { it.userId }
        val viewerIsAdmin = authorizationService.isAdmin(viewerId, teamId)
        return copy(
            payments = payments.map {
                val member = PaymentAttribution.memberOf(it, aliases, members.keys) ?: return@map it
                it.copy(
                    memberId = member,
                    name = members[member]?.let { m -> PaymentName(m.displayName.value) } ?: it.name,
                    counterpartyName = it.name.takeIf { viewerIsAdmin || viewerId == member },
                )
            },
        )
    }
}
