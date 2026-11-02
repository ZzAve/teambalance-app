import { describe, expect, it } from 'vitest'
import { mapsUrl } from './maps-url'

const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36'
const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const IPAD =
  'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const DESKTOP = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'

describe('mapsUrl', () => {
  it('hands Android a geo: URI, which opens the default maps app or asks which one', () => {
    expect(mapsUrl('Sporthal De Toekomst', ANDROID)).toBe('geo:0,0?q=Sporthal%20De%20Toekomst')
  })

  it('sends iPhone and iPad to Apple Maps, the system handler for a place search', () => {
    expect(mapsUrl('Sporthal De Toekomst', IPHONE)).toBe('https://maps.apple.com/?q=Sporthal%20De%20Toekomst')
    expect(mapsUrl('Sporthal De Toekomst', IPAD)).toBe('https://maps.apple.com/?q=Sporthal%20De%20Toekomst')
  })

  it('opens Google Maps in the browser everywhere else', () => {
    expect(mapsUrl('Sporthal De Toekomst', DESKTOP)).toBe('https://maps.google.com/?q=Sporthal%20De%20Toekomst')
  })

  it('encodes characters that would break the query', () => {
    expect(mapsUrl('Café & Bar #2', DESKTOP)).toBe('https://maps.google.com/?q=Caf%C3%A9%20%26%20Bar%20%232')
  })
})
