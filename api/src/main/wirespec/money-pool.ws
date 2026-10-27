// Amounts and the beer price are euro cents; date is an ISO-8601 calendar date; balance, payments, beerPrice and beerCount are set only when state is Connected, and beerPrice and beerCount only when the team configured a price. canTopUp is true when the pool is on and a bunq.me link is set, in any state.
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
    beerCount: Integer?,
    canTopUp: Boolean
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

// A bunq.me link for paying the pool, amount in whole euros between 1 and 500 (400 outside). 404 when the pool is Off or the team has no bunq.me link. 403 when a Platform Admin is acting as the team (ADR-0024): top-up is a member's action. Independent of the Bunq Connection.
type TopUpLink {
    url: String
}

endpoint GetTopUpLink GET /api/team/money-pool/top-up-link ? {amount: Integer} -> {
    200 -> TopUpLink
    403 -> Unit
    404 -> Unit
}
