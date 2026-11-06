package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.DependsOn
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * Re-encrypts the stored invite and calendar links that were made without AAD, so they are bound to their team
 * (and a calendar link to its own id) like every link made since (issue #465). Runs at startup after every tenant
 * schema is at head, before the app serves requests.
 *
 * Running it again changes nothing: a row that already opens with its AAD is skipped. Each write only replaces the
 * value it read, so a link rotated in the meantime is not overwritten. A row that opens neither way is logged and left
 * as it is: its hash still accepts the link, and an Admin can rotate it.
 */
@Component
@DependsOn("startupTenantMigrationRunner")
class LinkTokenAadMigration(
    private val jdbcTemplate: JdbcTemplate,
    @Qualifier(INVITATION_TOKEN_CIPHER) private val invitationCipher: TokenCipher,
    private val calendarLinkTokens: CalendarLinkTokens,
) : InitializingBean {
    private val log = LoggerFactory.getLogger(LinkTokenAadMigration::class.java)

    override fun afterPropertiesSet() = migrate()

    fun migrate() {
        jdbcTemplate.query("SELECT id, team_id, token_encrypted FROM public.invitations WHERE token_encrypted IS NOT NULL") { rs, _ ->
            Row(rs.getObject("id", UUID::class.java), TeamId(rs.getObject("team_id", UUID::class.java)), rs.getString("token_encrypted"))
        }.forEach { row ->
            rebind(row, "public.invitations") { invitationCipher.rebindLegacy(it, TokenCipher.aadOf(row.teamId, Purpose.INVITE_LINK)) }
        }

        jdbcTemplate.query("SELECT id, schema_name FROM public.teams") { rs, _ ->
            TeamId(rs.getObject("id", UUID::class.java)) to rs.getString("schema_name")
        }.forEach { (teamId, schema) ->
            val table = "\"$schema\".calendar_links"
            jdbcTemplate.query("SELECT id, token_encrypted FROM $table") { rs, _ ->
                Row(rs.getObject("id", UUID::class.java), teamId, rs.getString("token_encrypted"))
            }.forEach { row ->
                rebind(row, table) { calendarLinkTokens.rebindLegacy(it, teamId, CalendarLinkId(row.id)) }
            }
        }
    }

    private fun rebind(row: Row, table: String, rebindLegacy: (EncryptedToken) -> EncryptedToken?) {
        val rebound = runCatching { rebindLegacy(EncryptedToken(row.encrypted)) }
            .onFailure { log.warn("Link {} in {} (team {}) opens neither bound nor unbound; left as is", row.id, table, row.teamId) }
            .getOrNull() ?: return
        jdbcTemplate.update(
            "UPDATE $table SET token_encrypted = ? WHERE id = ? AND token_encrypted = ?",
            rebound.value,
            row.id,
            row.encrypted,
        )
    }

    private data class Row(val id: UUID, val teamId: TeamId, val encrypted: String)

    companion object {
        // The name InvitationCompositionRoot gives the bean; repeated here because an adapter may not import from config.
        const val INVITATION_TOKEN_CIPHER = "invitationTokenCipher"
    }
}
