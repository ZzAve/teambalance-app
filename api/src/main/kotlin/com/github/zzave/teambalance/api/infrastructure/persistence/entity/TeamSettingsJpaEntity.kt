package com.github.zzave.teambalance.api.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate

/**
 * The tenant's singleton settings row (see V004__team_settings.sql). The primary key is pinned to 1
 * by a DB CHECK, so there is always exactly one row per tenant schema.
 */
@Entity
@Table(name = "team_settings")
class TeamSettingsJpaEntity(
    @Id
    val id: Short = SINGLETON_ID,
    @Column(name = "season_start")
    val seasonStart: LocalDate?,
    @Column(name = "season_end")
    val seasonEnd: LocalDate?,
) {
    companion object {
        const val SINGLETON_ID: Short = 1
    }
}
