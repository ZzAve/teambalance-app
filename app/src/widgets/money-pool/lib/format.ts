const euro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/** Amounts arrive as euro cents. */
export function formatEuro(cents: number): string {
  return euro.format(cents / 100)
}

/** `date` is an ISO calendar date such as "2026-10-06". */
export function formatPaymentDate(date: string): string {
  return day.format(new Date(`${date}T00:00:00`))
}
