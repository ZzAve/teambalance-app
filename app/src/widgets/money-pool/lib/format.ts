const euro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
const count = new Intl.NumberFormat('nl-NL')
const day = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' })

/** Amounts arrive as euro cents. */
export function formatEuro(cents: number): string {
  return euro.format(cents / 100)
}

export function formatBeers(beers: number): string {
  return `${count.format(beers)} ${beers === 1 ? 'beer' : 'beers'}`
}

/** `date` is an ISO calendar date such as "2026-10-06". */
export function formatPaymentDate(date: string): string {
  return day.format(new Date(`${date}T00:00:00`))
}
