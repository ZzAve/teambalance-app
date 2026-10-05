// PROTOTYPE — throwaway (ADR-0038). Three ways to show Team Photo + Shirt Number on the /team roster,
// switchable via `?variant=A|B|C`. Numbers and photos are faked client-side from the real members.
import { useState } from 'react'
import { useMembers } from '@shared/api/members'
import type { Member } from '@shared/api/members'
import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { PrototypeSwitcher } from '@shared/ui/PrototypeSwitcher'

interface Player {
  member: Member
  shirtNumber: number | null
  photoUrl: string | null
}

const FAKE_NUMBERS = [7, 1, 12, 4, 112, null, 9, 15, 3, 21]
const PHOTO_HUES = [210, 25, 140, 280, 0, 50, 180, 320]

function fakePhoto(seed: number): string {
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

function toPlayers(members: Member[]): Player[] {
  return members.map((member, i) => ({
    member,
    shirtNumber: FAKE_NUMBERS[i % FAKE_NUMBERS.length],
    // Every third member has no Team Photo, to show the initials fallback.
    photoUrl: i % 3 === 2 ? null : fakePhoto(i),
  }))
}

function PlayerAvatar({ player, size }: { player: Player; size: number }) {
  const { member, photoUrl } = player
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: avatarColor(member.userId), fontSize: size * 0.36 }}
    >
      {avatarInitials(member.displayName)}
    </div>
  )
}

const byNumber = (a: Player, b: Player) => (a.shirtNumber ?? 10_000) - (b.shirtNumber ?? 10_000)

/** A: the current list, with the number as a badge on the avatar. */
function VariantA({ players }: { players: Player[] }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {players.map((p) => (
        <li key={p.member.userId} className="flex items-center gap-3 p-3">
          <div className="relative">
            <PlayerAvatar player={p} size={40} />
            {p.shirtNumber !== null && (
              <span className="absolute -right-1.5 -bottom-1 min-w-5 rounded-full border-2 border-background bg-foreground px-1 text-center text-caption leading-4 font-bold text-background">
                {p.shirtNumber}
              </span>
            )}
          </div>
          <span className="min-w-0 flex-1 truncate font-medium">{p.member.displayName}</span>
          <span className="text-small text-muted-foreground">{p.member.position?.label ?? 'Unassigned'}</span>
        </li>
      ))}
    </ul>
  )
}

/** B: a team sheet — number first in its own column, sorted by number. */
function VariantB({ players }: { players: Player[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {[...players].sort(byNumber).map((p) => (
        <li key={p.member.userId} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
          <span className="w-12 shrink-0 text-right font-display text-title font-bold tabular-nums">
            {p.shirtNumber ?? '–'}
          </span>
          <PlayerAvatar player={p} size={32} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{p.member.displayName}</div>
            <div className="text-caption text-muted-foreground">{p.member.position?.label ?? 'Unassigned'}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** C: player cards, grouped by Position — the photo is the main element. */
function VariantC({ players }: { players: Player[] }) {
  const groups = new Map<string, Player[]>()
  for (const p of [...players].sort(byNumber)) {
    const label = p.member.position?.label ?? 'Unassigned'
    groups.set(label, [...(groups.get(label) ?? []), p])
  }
  return (
    <div className="flex flex-col gap-5">
      {[...groups].map(([label, group]) => (
        <section key={label}>
          <h3 className="mb-2 text-small font-semibold text-muted-foreground uppercase">{label}</h3>
          <div className="grid grid-cols-3 gap-2">
            {group.map((p) => (
              <div key={p.member.userId} className="overflow-hidden rounded-lg border border-border">
                <div className="relative aspect-square">
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white"
                      style={{ backgroundColor: avatarColor(p.member.userId) }}
                    >
                      {avatarInitials(p.member.displayName)}
                    </div>
                  )}
                  {p.shirtNumber !== null && (
                    <span className="absolute top-1 left-1.5 font-display text-title font-bold text-white drop-shadow">
                      {p.shirtNumber}
                    </span>
                  )}
                </div>
                <div className="truncate px-1.5 py-1 text-caption font-medium">{p.member.displayName}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const VARIANTS = [
  { key: 'A', name: 'Badge on avatar' },
  { key: 'B', name: 'Team sheet' },
  { key: 'C', name: 'Player cards' },
]

export function RosterPrototype({ variant: initial }: { variant: string }) {
  const [variant, setVariant] = useState(initial)
  const { data: members = [] } = useMembers()
  const players = toPlayers(members)

  const change = (key: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('variant', key)
    window.history.replaceState(window.history.state, '', url)
    setVariant(key)
  }

  return (
    <div>
      <h2 className="font-display text-title font-bold">Members</h2>
      <div className="mt-4">
        {variant === 'A' && <VariantA players={players} />}
        {variant === 'B' && <VariantB players={players} />}
        {variant === 'C' && <VariantC players={players} />}
      </div>
      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={change} />
    </div>
  )
}
