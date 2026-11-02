package com.github.zzave.teambalance.api.domain.model

/**
 * The payment description of a top-up: `TeamBalance · {team} · {member} · {user id}`, at most
 * [MAX_LENGTH] characters. The prefix and the user id are always whole; the team and member names
 * share what remains, each shortened from its end. A name shorter than its half leaves the rest to
 * the other name.
 */
object TopUpDescription {
    private const val SEPARATOR = " · "
    const val MAX_LENGTH = 140
    private const val PREFIX = "TeamBalance"

    fun of(teamName: String, memberName: String, userId: String): String {
        val team = teamName.trim()
        val member = memberName.trim()
        val budget = MAX_LENGTH - listOf(PREFIX, userId).sumOf { it.length } - 3 * SEPARATOR.length
        val teamLength = if (team.length + member.length <= budget) {
            team.length
        } else {
            minOf(team.length, maxOf(budget / 2, budget - member.length))
        }
        val memberLength = minOf(member.length, budget - teamLength)
        return listOf(PREFIX, team.cutTo(teamLength), member.cutTo(memberLength), userId).joinToString(SEPARATOR)
    }

    private fun String.cutTo(length: Int): String {
        val cut = take(length)
        return (if (cut.lastOrNull()?.isHighSurrogate() == true) cut.dropLast(1) else cut).trimEnd()
    }
}
