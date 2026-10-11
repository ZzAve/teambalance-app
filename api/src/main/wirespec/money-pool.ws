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

// A bunq.me link for paying the pool, amount in whole euros between 1 and 500 (400 outside). 404 when the pool is Off or the team has no bunq.me link. Independent of the Bunq Connection.
type TopUpLink {
    url: String
}

endpoint GetTopUpLink GET /api/team/money-pool/top-up-link ? {amount: Integer} -> {
    200 -> TopUpLink
    404 -> Unit
}

// Admin-only. connectAvailable is false while Bunq connecting is switched off for this deployment; starting a connection answers 404 then. connected: a Bunq Connection exists. accountPicked: it also names the one account the pool reads; a connection without one reads as NotConnected on the pool.
type BunqConnectionStatus {
    connectAvailable: Boolean,
    connected: Boolean,
    accountPicked: Boolean
}

endpoint GetBunqConnection GET /api/team/money-pool/connection -> {
    200 -> BunqConnectionStatus
    403 -> Unit
}

// Admin-only. Returns the Bunq page the browser goes to for approving access; Bunq sends it back to the API's callback, which redirects to the team settings with ?bunq=connected, declined or error. Allowed while already connected: the new grant replaces the old one. 404 when connecting is switched off.
type BunqAuthorization {
    url: String
}

endpoint StartBunqConnection POST /api/team/money-pool/connection -> {
    201 -> BunqAuthorization
    403 -> Unit
    404 -> Unit
}

// Admin-only. Deleting removes the stored Bunq secrets; deleting while not connected is a no-op.
endpoint DisconnectBunq DELETE /api/team/money-pool/connection -> {
    204 -> Unit
    403 -> Unit
}

// Admin-only. The accounts the current grant covers, and the one the pool reads (null until picked). 404: not connected. 422 BUNQ_REJECTED: Bunq no longer accepts the grant, reconnect.
type BunqAccount {
    id: String,
    name: String
}

type BunqAccounts {
    accounts: BunqAccount[],
    selectedAccountId: String?
}

endpoint GetBunqAccounts GET /api/team/money-pool/connection/account -> {
    200 -> BunqAccounts
    403 -> Unit
    404 -> Unit
    422 -> Unit
}

// Admin-only. Picks the account the pool reads. 400: the id is not one of the grant's accounts. 404: not connected. 422 BUNQ_REJECTED: Bunq no longer accepts the grant.
type PickBunqAccount {
    accountId: String
}

endpoint PutBunqAccount PUT PickBunqAccount /api/team/money-pool/connection/account -> {
    204 -> Unit
    400 -> Unit
    403 -> Unit
    404 -> Unit
    422 -> Unit
}
