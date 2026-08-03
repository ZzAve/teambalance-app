package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Season
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@Service
@Transactional
class SeasonService(
    private val seasonRepository: SeasonRepository,
    private val authorizationService: AuthorizationService,
) {
    /** The current tenant's season. Readable by any member; returns an unset season when none is configured. */
    fun getSeason(): Season = seasonRepository.get()

    /**
     * Admin-only. Replaces the season window; passing both bounds null clears it. A configured
     * range with end before start is rejected (400). Changing the window never touches events —
     * a warning about now-out-of-window events is the frontend's job (ADR-0014).
     */
    fun setSeason(callerId: UserId, teamId: TeamId, start: LocalDate?, end: LocalDate?): Season {
        authorizationService.requireAdmin(callerId, teamId)
        require(start == null || end == null || !end.isBefore(start)) {
            "Season end must not be before season start"
        }
        return seasonRepository.save(Season(start = start, end = end))
    }
}
