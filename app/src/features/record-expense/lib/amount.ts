/** The server's limit: € 10,000. */
export const MAX_EXPENSE_CENTS = 1_000_000

const EUROS = /^\d+([.,]\d{1,2})?$/

/** The euro amount typed into the form as cents, or null when it is empty, not an amount, zero or over the limit. */
export function parseExpenseAmount(text: string): number | null {
  const trimmed = text.trim()
  if (!EUROS.test(trimmed)) return null
  const cents = Math.round(Number(trimmed.replace(',', '.')) * 100)
  return cents >= 1 && cents <= MAX_EXPENSE_CENTS ? cents : null
}

/** Cents as the form shows them in the amount field: "12,50". Read back by `parseExpenseAmount`. */
export function formatExpenseAmount(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',')
}
