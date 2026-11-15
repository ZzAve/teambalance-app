// Finds the total in the text that text recognition read from a receipt photo. The text is unreliable:
// columns end up on separate lines, a 0 is read as an O, and every price on the receipt is in it.

/** An amount with two decimals, comma or point. Not part of a longer number or of a date such as 25.12.2018, and not a percentage. */
const AMOUNT = /(?<![\d.,/-])(\d{1,5})\s?[.,]\s?(\d{2})(?![.,/-]?\d)(?!\s?%)/g

/** The line names what is paid in the end. */
const FINAL_TOTAL = /te betalen|totaal te|eindtotaal|grand total|amount due|total due|balance due|total payable|total amount|tota+l.{0,12}(incl|round|afgerond)|net+ tota+l/
/** The line names a total. */
const TOTAL = /tota+l|totaa+l/
/** The line names the payment by card, which is the total. */
const CARD_PAYMENT = /\bpin\b|pinnen|pinbetaling|betaald|maestro|v ?pay|mastercard|\bvisa\b|debit|credit card|bankpas|\bkaart\b/
/** A total of something else (part of the goods, the tax, a count), or money handed over and given back. */
const NOT_THE_TOTAL = /sub ?tota|excl|btw|b\.t\.w|\bvat\b|\bgst\b|\btax\b|korting|discount|saving|bespaar|voordeel|\bqty\b|quantity|items?\b|artikelen|aantal|wisselgeld|\bchange\b|contant|\bcash\b|retour|punten|points/

/** Letters as text recognition confuses them, undone for matching words: T0TAAL and TOTAA1 are TOTAAL. */
function wordsOf(line: string): string {
  return line.toLowerCase().replace(/0/g, 'o').replace(/[1|!]/g, 'l')
}

function amountsIn(line: string): number[] {
  return [...line.matchAll(AMOUNT)].map((m) => Number(m[1]) * 100 + Number(m[2]))
}

function rankOf(line: string): number {
  const words = wordsOf(line)
  if (FINAL_TOTAL.test(words) && !/excl/.test(words)) return 3
  if (NOT_THE_TOTAL.test(words)) return 0
  if (TOTAL.test(words)) return 2
  return CARD_PAYMENT.test(words) ? 1 : 0
}

/**
 * The total on a receipt in euro cents, or null when the text names none.
 *
 * A line that names the total wins over one that names a card payment. Among equal lines the amount that the
 * text holds more than once wins (a total is usually printed again as the payment), then the largest. The
 * amount is the last one on the line, or the first one on the next line when the line has none. When no line
 * names a total, it is the largest amount the text holds more than once.
 */
export function receiptTotal(text: string): number | null {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const timesSeen = new Map<number, number>()
  for (const cents of lines.flatMap(amountsIn)) timesSeen.set(cents, (timesSeen.get(cents) ?? 0) + 1)
  const repeated = (cents: number) => (timesSeen.get(cents) ?? 0) > 1

  let best: { rank: number; cents: number } | undefined
  lines.forEach((line, i) => {
    const rank = rankOf(line)
    if (rank === 0) return
    const cents = amountsIn(line).at(-1) ?? amountsIn(lines[i + 1] ?? '').at(0)
    if (!cents) return
    const better =
      !best || rank > best.rank || (rank === best.rank && (repeated(cents) !== repeated(best.cents) ? repeated(cents) : cents > best.cents))
    if (better) best = { rank, cents }
  })
  if (best) return best.cents

  const repeatedAmounts = [...timesSeen.keys()].filter((cents) => cents > 0 && repeated(cents))
  return repeatedAmounts.length > 0 ? Math.max(...repeatedAmounts) : null
}
