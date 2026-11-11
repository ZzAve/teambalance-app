package com.github.zzave.teambalance.api.infrastructure.nevobo

import com.github.zzave.teambalance.api.domain.exception.MatchFeedUnavailableException
import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.MatchAddress
import com.github.zzave.teambalance.api.domain.model.MatchCode
import com.github.zzave.teambalance.api.domain.model.MatchLink
import com.github.zzave.teambalance.api.domain.model.MatchVenue
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import org.slf4j.LoggerFactory
import org.w3c.dom.Element
import org.xml.sax.InputSource
import org.xml.sax.SAXException
import java.io.StringReader
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import javax.xml.XMLConstants
import javax.xml.parsers.DocumentBuilderFactory

/**
 * Reads the items of a Nevobo programme feed (`programma.rss`). An item looks like:
 *
 * ```
 * <title>13 nov 19:30: Servylo HS 1 - Tovo HS 4</title>
 * <link>https://api.nevobo.nl/permalink/wedstrijd/2017987</link>
 * <description>Wedstrijd: 3000H2J   EA, Datum: vrijdag 13 november, 19:30,
 *     Speellocatie: De Mammoet, Calslaan 101, 2804RT  Gouda</description>
 * <pubDate>Fri, 13 Nov 2026 19:30:00 +0100</pubDate>
 * ```
 *
 * An item it cannot read is logged and skipped. A document that is not XML, or that has a document type
 * declaration, is refused: the feed comes from outside, and refusing the declaration is what keeps the parser
 * from reading external entities.
 */
object NevoboFeedParser {
    private val log = LoggerFactory.getLogger(NevoboFeedParser::class.java)
    private val TEAMS = Regex("""^[^:]+:\d{2}:\s*(.+?)\s+-\s+(.+)$""")
    private val CODE = Regex("""Wedstrijd:\s*\S+\s+([A-Z0-9]+)""")
    private val VENUE = Regex("""Speellocatie:\s*([^,]+)""")
    private val ADDRESS = Regex("""Speellocatie:\s*(.+)$""")

    fun parse(xml: String): List<FeedMatch> {
        val document = try {
            builderFactory().newDocumentBuilder().parse(InputSource(StringReader(xml)))
        } catch (e: SAXException) {
            throw MatchFeedUnavailableException("The Nevobo feed is not readable XML: ${e.message}", e)
        }
        val items = document.getElementsByTagName("item")
        return (0 until items.length).mapNotNull { readItem(items.item(it) as Element) }
    }

    private fun readItem(item: Element): FeedMatch? {
        val title = item.text("title")
        val description = item.text("description")
        val teams = TEAMS.find(title)
        val code = CODE.find(description)
        val start = runCatching { ZonedDateTime.parse(item.text("pubDate"), DateTimeFormatter.RFC_1123_DATE_TIME) }.getOrNull()
        val match = if (teams == null || code == null || start == null) {
            null
        } else {
            runCatching {
                FeedMatch(
                    code = MatchCode(code.groupValues[1]),
                    link = MatchLink(item.text("link")),
                    startTime = start.toInstant(),
                    homeTeam = NevoboTeamName(teams.groupValues[1]),
                    awayTeam = NevoboTeamName(teams.groupValues[2]),
                    venue = VENUE.find(description)?.groupValues?.get(1)?.trim()?.let(::MatchVenue),
                    address = ADDRESS.find(description)?.groupValues?.get(1)?.replace(Regex("\\s+"), " ")?.trim()
                        ?.let(::MatchAddress),
                )
            }.getOrNull()
        }
        if (match == null) log.warn("Skipping a Nevobo feed item that cannot be read: {}", title)
        return match
    }

    private fun Element.text(tag: String): String = getElementsByTagName(tag).item(0)?.textContent?.trim().orEmpty()

    private fun builderFactory() = DocumentBuilderFactory.newInstance().apply {
        setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
        setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true)
        isXIncludeAware = false
        isExpandEntityReferences = false
    }
}
