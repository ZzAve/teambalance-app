package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.generated.model.Amount
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAccountName
import com.github.zzave.teambalance.api.domain.model.Money
import community.flock.wirespec.kotlin.Wirespec
import tools.jackson.databind.json.JsonMapper
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeFormatterBuilder
import java.time.format.DateTimeParseException

private val json = JsonMapper.builder().build()

private const val EURO = "EUR"
private const val ACTIVE = "ACTIVE"
private const val HTTP_OK = 200
private const val ERROR_TEXT_LENGTH = 300

/** Bunq writes a time as "2026-11-03 18:54:39.947281": UTC, with no zone and a varying number of decimals. */
private val BUNQ_TIME: DateTimeFormatter = DateTimeFormatterBuilder()
    .append(DateTimeFormatter.ISO_LOCAL_DATE)
    .appendLiteral(' ')
    .append(DateTimeFormatter.ISO_LOCAL_TIME)
    .toFormatter()

/** An amount Bunq reports as a decimal string such as "187.50" or "-12.50", in euro cents. Anything else is not an answer we can use. */
internal fun moneyOf(amount: Amount?): Money {
    val value = amount?.value
    if (value == null || amount.currency != EURO) unusable("an amount that is not in euros")
    return try {
        Money(BigDecimal(value).movePointRight(2).longValueExact())
    } catch (e: NumberFormatException) {
        unusable("an amount that is not a number", e)
    } catch (e: ArithmeticException) {
        unusable("an amount in fractions of a cent", e)
    }
}

private fun unusable(what: String, cause: Throwable? = null): Nothing = throw BunqUnavailableException("Bunq reported $what", cause)

/** The day [created] falls on in [zone]. */
internal fun dateOf(created: String?, zone: ZoneId): LocalDate =
    try {
        LocalDateTime.parse(created, BUNQ_TIME).atOffset(ZoneOffset.UTC).atZoneSameInstant(zone).toLocalDate()
    } catch (e: DateTimeParseException) {
        unusable("a time that is not a time", e)
    }

/** What the three kinds of monetary account listing have in common, as far as the money pool lists them. */
internal class AccountRow(val id: Long?, val description: String?, val status: String?, val currency: String?) {
    /** Only an active euro account can be read as euros; any other is left out of the Admin's choice. */
    fun toAccount(): BunqAccount? =
        if (id != null && status == ACTIVE && currency == EURO) {
            BunqAccount(BunqAccountId(id.toString()), BunqAccountName(description.orEmpty()))
        } else {
            null
        }
}

/**
 * Whether [body] is an error as Bunq words it: a JSON object with an `Error` array. A 403 from a proxy or firewall in front of
 * Bunq is not, and says nothing about the grant.
 */
internal fun isBunqError(body: String): Boolean = runCatching { json.readTree(body).get("Error")?.isArray == true }.getOrDefault(false)

/** The body of a read that Bunq answered with 200; any other answer is Bunq not giving us what we asked for. */
@Suppress("UNCHECKED_CAST")
internal fun <B> Wirespec.Response<*>.ok(): B {
    if (status != HTTP_OK) throw BunqUnavailableException("Bunq answered $status to a read: ${body.toString().take(ERROR_TEXT_LENGTH)}")
    return body as B
}
