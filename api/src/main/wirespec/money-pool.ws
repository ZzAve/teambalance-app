// Amounts are euro cents; date is an ISO-8601 calendar date; balance and payments are set only when state is Connected.
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
    payments: Payment[]?
}

endpoint GetMoneyPool GET /api/team/money-pool -> {
    200 -> MoneyPool
}
