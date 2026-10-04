// PROTOTYPE — throwaway (ADR-0038). Fakes Shirt Numbers and photos client-side from the real members.
import type { Member } from '@shared/api/members'

export interface Player {
  member: Member
  shirtNumber: number | null
  photoUrl: string | null
}

const FAKE_NUMBERS = [7, 1, 12, 4, 112, null, 9, 15, 3, 21]
const PHOTO_HUES = [210, 25, 140, 280, 0, 50, 180, 320]

export function fakePhoto(seed: number): string {
  const hue = PHOTO_HUES[seed % PHOTO_HUES.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},45%,72%)"/><stop offset="1" stop-color="hsl(${hue + 30},40%,45%)"/>
    </linearGradient></defs>
    <rect width="100" height="100" fill="url(#g)"/>
    <circle cx="50" cy="40" r="17" fill="hsl(${hue},25%,92%)"/>
    <path d="M18 100c2-22 16-34 32-34s30 12 32 34z" fill="hsl(${hue},25%,92%)"/>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** The signed-in member's (faked) Personal Photo — what "use my personal photo" copies. */
export const FAKE_PERSONAL_PHOTO = fakePhoto(5)

export function toPlayers(members: Member[]): Player[] {
  return members.map((member, i) => ({
    member,
    shirtNumber: FAKE_NUMBERS[i % FAKE_NUMBERS.length],
    // Every third member has no Team Photo, to show the initials fallback.
    photoUrl: i % 3 === 2 ? null : fakePhoto(i),
  }))
}

export const byNumber = (a: Player, b: Player) => (a.shirtNumber ?? 10_000) - (b.shirtNumber ?? 10_000)
