// A drawn till receipt for stories, so they show an image without a network.
export const RECEIPT_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="360" viewBox="0 0 240 360">' +
      '<rect width="240" height="360" fill="#fbfaf6"/>' +
      '<text x="120" y="40" font-family="monospace" font-size="16" text-anchor="middle">SPORTHAL DE KUIL</text>' +
      '<text x="20" y="100" font-family="monospace" font-size="13">Zaalhuur 2 uur</text>' +
      '<text x="220" y="100" font-family="monospace" font-size="13" text-anchor="end">45,00</text>' +
      '<line x1="20" y1="300" x2="220" y2="300" stroke="#333" stroke-dasharray="4 3"/>' +
      '<text x="20" y="330" font-family="monospace" font-size="15" font-weight="bold">TOTAAL</text>' +
      '<text x="220" y="330" font-family="monospace" font-size="15" font-weight="bold" text-anchor="end">€ 45,00</text>' +
      '</svg>',
  )
