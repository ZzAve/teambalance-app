package com.github.zzave.teambalance.api.infrastructure.nevobo

import com.github.zzave.teambalance.api.domain.model.FeedMatch
import com.github.zzave.teambalance.api.domain.model.MatchAddress
import com.github.zzave.teambalance.api.domain.model.MatchCode
import com.github.zzave.teambalance.api.domain.model.MatchLink
import com.github.zzave.teambalance.api.domain.model.MatchVenue
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import com.github.zzave.teambalance.api.domain.exception.MatchFeedUnavailableException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import java.time.Instant

class NevoboFeedParserTest : FunSpec({

    val feed = NevoboFeedParserTest::class.java.getResource("/nevobo/programma.rss")!!.readText()

    test("reads every item of a real programme feed") {
        val matches = NevoboFeedParser.parse(feed)

        matches shouldHaveSize 3
        matches.first() shouldBe FeedMatch(
            code = MatchCode("EA"),
            link = MatchLink("https://api.nevobo.nl/permalink/wedstrijd/2017987"),
            startTime = Instant.parse("2026-11-13T18:30:00Z"),
            homeTeam = NevoboTeamName("Servylo HS 1"),
            awayTeam = NevoboTeamName("Tovo HS 4"),
            venue = MatchVenue("De Mammoet"),
            address = MatchAddress("De Mammoet, Calslaan 101, 2804RT Gouda"),
        )
    }

    test("a feed with no items has no matches") {
        NevoboFeedParser.parse("<rss><channel></channel></rss>") shouldBe emptyList()
    }

    test("an item it cannot read is skipped") {
        val broken = feed.replaceFirst("13 nov 19:30: Servylo HS 1 - Tovo HS 4", "no teams here")
        NevoboFeedParser.parse(broken) shouldHaveSize 2
    }

    test("a document type declaration is refused, so no external entity is read") {
        val withDoctype = """<?xml version="1.0"?><!DOCTYPE rss [<!ENTITY x SYSTEM "file:///etc/passwd">]>""" +
            "<rss><channel><title>&x;</title></channel></rss>"
        shouldThrow<MatchFeedUnavailableException> { NevoboFeedParser.parse(withDoctype) }
    }

    test("text that is not XML is refused") {
        shouldThrow<MatchFeedUnavailableException> { NevoboFeedParser.parse("<html>down for maintenance") }
    }
})
