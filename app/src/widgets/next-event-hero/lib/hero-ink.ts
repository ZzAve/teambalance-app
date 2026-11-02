/**
 * The lowest white-on-ground contrast the hero accepts. 3:1 is the WCAG floor for large text; the
 * hero's title and countdown are large, and the brand green it has always carried white on is 3.4:1,
 * so a stricter floor would flip the default hero to dark text. Gold (1.9:1) and orange (2.9:1) fall
 * below it.
 */
const MIN_WHITE_CONTRAST = 3

/** WCAG relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Which ink the Next Up hero draws on an event type's colour: white, unless the colour is too light
 * for white to be read. A type without a colour sits on the brand green, which takes white.
 */
export function heroInk(color: string | undefined): 'light' | 'dark' {
  if (!color) return 'light'
  const whiteContrast = 1.05 / (luminance(color) + 0.05)
  return whiteContrast >= MIN_WHITE_CONTRAST ? 'light' : 'dark'
}
