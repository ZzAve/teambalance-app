export type IbanCheck =
  | { state: 'empty' }
  | { state: 'typing'; remaining?: number }
  | { state: 'valid' }
  | { state: 'error'; reason: 'format' | 'tooLong' | 'checksum' }

const NL_LENGTH = 18

export const normaliseIban = (raw: string): string => raw.replace(/\s+/g, '').toUpperCase()

export const groupIban = (raw: string): string => normaliseIban(raw).replace(/(.{4})(?=.)/g, '$1 ')

// ISO 13616 mod-97 over the rearranged digits. Feedback only: the server has the final say.
function mod97(iban: string): number {
  const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))
  return [...digits].reduce((rest, ch) => (rest * 10 + Number(ch)) % 97, 0)
}

/** Live feedback while an IBAN is typed. Pure; the server re-checks on save (400 INVALID_IBAN). */
export function checkIban(raw: string): IbanCheck {
  const s = normaliseIban(raw)
  if (s === '') return { state: 'empty' }
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]*$/.test(s)) return { state: 'error', reason: 'format' }
  if (s.startsWith('NL') && s.length < NL_LENGTH) return { state: 'typing', remaining: NL_LENGTH - s.length }
  if (s.startsWith('NL') && s.length > NL_LENGTH) return { state: 'error', reason: 'tooLong' }
  if (s.length < 15) return { state: 'typing' }
  return mod97(s) === 1 ? { state: 'valid' } : { state: 'error', reason: 'checksum' }
}
