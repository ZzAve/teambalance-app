package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class NevoboFeedUrlTest : FunSpec({

    test("accepts a poule programme feed and reads the poule from it") {
        NevoboFeedUrl("https://api.nevobo.nl/export/poule/regio-west/regio-west-h2j-12/programma.rss")
            .poule shouldBe "regio-west-h2j-12"
    }

    test("accepts the feed's own link, which has the competition in its path") {
        NevoboFeedUrl("https://api.nevobo.nl/export/poule/regio-west/competitie-seniorencompetitie-1/regio-west-h2j-12/programma.rss")
            .poule shouldBe "regio-west-h2j-12"
    }

    listOf(
        "http://api.nevobo.nl/export/poule/regio-west/regio-west-h2j-12/programma.rss",
        "https://api.nevobo.nl.evil.example/export/poule/regio-west/regio-west-h2j-12/programma.rss",
        "https://api.nevobo.nl@evil.example/export/poule/regio-west/regio-west-h2j-12/programma.rss",
        "https://api.nevobo.nl/export/poule/regio-west/regio-west-h2j-12/stand.rss",
        "https://api.nevobo.nl/export/poule/../../programma.rss",
        "https://api.nevobo.nl/export/poule/regio-west/regio-west-h2j-12/programma.rss?x=1",
    ).forEach { url ->
        test("refuses $url") {
            shouldThrow<IllegalArgumentException> { NevoboFeedUrl(url) }
        }
    }
})
