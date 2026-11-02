/**
 * A link that opens an address in the phone's own maps app where the platform offers one: Android
 * resolves `geo:` to the default maps app (or asks), iOS hands maps.apple.com to Apple Maps. Other
 * platforms have no such handler, so they get Google Maps in the browser.
 */
export function mapsUrl(location: string, userAgent: string = navigator.userAgent): string {
  const q = encodeURIComponent(location)
  if (/Android/i.test(userAgent)) return `geo:0,0?q=${q}`
  if (/iPhone|iPad|iPod/i.test(userAgent)) return `https://maps.apple.com/?q=${q}`
  return `https://maps.google.com/?q=${q}`
}
