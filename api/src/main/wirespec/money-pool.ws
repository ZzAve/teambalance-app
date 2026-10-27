// Amounts and the beer price are euro cents; date is an ISO-8601 calendar date; balance, payments, beerPrice and beerCount are set only when state is Connected, and beerPrice and beerCount only when the team configured a price.
type PaymentDate = String

enum MoneyPoolState {
    Off, NotConnected, Unavailable, Connected
}

enum PaymentDirection {
    In, Out
}

type Payment {
    date: PaymentDate,
    name: String,
    amount: Integer,
    direction: PaymentDirection
}

type MoneyPool {
    state: MoneyPoolState,
    balance: Integer?,
    payments: Payment[]?,
    beerPrice: Integer?,
    beerCount: Integer?
}

endpoint GetMoneyPool GET /api/team/money-pool -> {
    200 -> MoneyPool
}

// Admin-only. A PUT replaces every setting; a null beerPrice or bunqMeLink clears it. beerPrice is euro cents between 1 and 10000; bunqMeLink is normalised to https://bunq.me/{name}, anything else is a 400.
type MoneyPoolSettings {
    enabled: Boolean,
    beerPrice: Integer?,
    bunqMeLink: String?
}

endpoint GetMoneyPoolSettings GET /api/team/money-pool/settings -> {
    200 -> MoneyPoolSettings
    403 -> Unit
}

endpoint PutMoneyPoolSettings PUT MoneyPoolSettings /api/team/money-pool/settings -> {
    200 -> MoneyPoolSettings
    403 -> Unit
}
