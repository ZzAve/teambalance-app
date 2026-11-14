import { describe, expect, it } from 'vitest'
import { receiptTotal } from './receipt-total'

const text = (...lines: string[]) => lines.join('\n')

describe('receiptTotal', () => {
  it('reads the total of a Dutch supermarket receipt, not a price, the VAT or the subtotal', () => {
    const receipt = text(
      'Albert Heijn',
      'AANTAL OMSCHRIJVING PRIJS BEDRAG',
      '1 AH HALFV MELK 1,19',
      '2 SPORTDRANK 1,49 2,98',
      'SUBTOTAAL 4,17',
      'BONUS VOORDEEL -0,50',
      'TOTAAL 3,67',
      'BETAALD MET:',
      'PINNEN 3,67',
      'BTW OVER EUR',
      '9% 3,37 0,30',
      'TOTAAL 3,37 0,30',
      '14-11-2026 16:02',
    )
    expect(receiptTotal(receipt)).toBe(367)
  })

  it('prefers the line that says what is paid over other totals', () => {
    expect(receiptTotal(text('Totaal 45,00', 'Statiegeld retour -1,50', 'Te betalen 43,50', 'Totaal artikelen 12'))).toBe(4350)
    expect(receiptTotal(text('TOTAL EXCL. GST 25.47', 'TOTAL INCL. GST 27.00'))).toBe(2700)
  })

  it('takes the amount from the next line when the columns were read apart', () => {
    expect(receiptTotal(text('Sportdrank 2,98', 'TOTAAL', '€ 12,50', 'Bedankt en tot ziens'))).toBe(1250)
  })

  it('takes the last amount on the total line', () => {
    expect(receiptTotal('Totaal incl. btw 2,17 12,50')).toBe(1250)
  })

  it('reads through the mistakes text recognition makes in words and amounts', () => {
    expect(receiptTotal(text('T0TAAL EUR 12, 50', 'CONTANT 20,00', 'WISSELGELD 7,50'))).toBe(1250)
    expect(receiptTotal(text('TOTAA1 9.95'))).toBe(995)
  })

  it('falls back to the card payment when no line names a total', () => {
    expect(receiptTotal(text('Wedstrijdbal 34,95', 'Pin 34,95', 'Kaart: xxxx1234'))).toBe(3495)
  })

  it('prefers a total the receipt prints again over a larger one it prints once', () => {
    expect(receiptTotal(text('Total 71.80', 'Total 18.00', 'Visa 18.00'))).toBe(1800)
  })

  it('takes the largest amount printed more than once when no line names a total or a payment', () => {
    expect(receiptTotal(text('Bal 30,00', 'Pomp 12,50', 'T@ZE 42,50', 'C4$H 42,50', 'Net 30,00'))).toBe(4250)
  })

  it('does not take a date, a time, a percentage or a count for an amount', () => {
    expect(receiptTotal(text('Totaal 14.11.2026', 'Totaal 21,00% btw', 'Total 16:02'))).toBeNull()
    expect(receiptTotal(text('Totaal 14-11-2026 12,50'))).toBe(1250)
  })

  it('is null for text without a total: an empty text, prose, or prices that all differ', () => {
    expect(receiptTotal('')).toBeNull()
    expect(receiptTotal('Bedankt voor uw bezoek')).toBeNull()
    expect(receiptTotal(text('Bal 30,00', 'Pomp 12,50'))).toBeNull()
    expect(receiptTotal('Totaal 0,00')).toBeNull()
  })
})
