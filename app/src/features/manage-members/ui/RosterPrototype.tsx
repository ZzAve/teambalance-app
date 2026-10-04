// PROTOTYPE — throwaway (ADR-0038). Compact player-card rosters on /team, switchable via
// `?variant=A|B|C`. Every card drills down to the member detail prototype.
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useMembers } from '@shared/api/members'
import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { PrototypeSwitcher } from '@shared/ui/PrototypeSwitcher'
import { byNumber, toPlayers } from '../lib/prototype-players'
import type { Player } from '../lib/prototype-players'

function Photo({ player, className }: { player: Player; className: string }) {
  if (player.photoUrl) return <img src={player.photoUrl} alt="" className={`object-cover ${className}`} />
  return (
    <div
      className={`flex items-center justify-center font-semibold text-white ${className}`}
      style={{ backgroundColor: avatarColor(player.member.userId) }}
    >
      {avatarInitials(player.member.displayName)}
    </div>
  )
}

function ToDetail({ player, className, children }: { player: Player; className: string; children: ReactNode }) {
  const { slug } = useParams({ strict: false })
  return (
    <Link
      to="/t/$slug/team/$userId"
      params={{ slug: slug ?? '', userId: player.member.userId }}
      aria-label={player.member.displayName}
      className={className}
    >
      {children}
    </Link>
  )
}

const firstName = (p: Player) => p.member.displayName.split(' ')[0]

/** A: small square tiles, four per row, number on the photo. */
function VariantA({ players }: { players: Player[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {players.map((p) => (
        <ToDetail key={p.member.userId} player={p} className="overflow-hidden rounded-md border border-border bg-card">
          <div className="relative aspect-square">
            <Photo player={p} className="h-full w-full text-body" />
            {p.shirtNumber !== null && (
              <span className="absolute top-0.5 left-1 font-display text-small font-bold text-white drop-shadow">
                {p.shirtNumber}
              </span>
            )}
          </div>
          <div className="truncate px-1 py-0.5 text-caption font-medium">{firstName(p)}</div>
        </ToDetail>
      ))}
    </div>
  )
}

/** B: round faces, four per row, number as a badge under the face. */
function VariantB({ players }: { players: Player[] }) {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-4">
      {players.map((p) => (
        <ToDetail key={p.member.userId} player={p} className="flex flex-col items-center gap-1">
          <div className="relative">
            <Photo player={p} className="h-16 w-16 rounded-full text-body" />
            {p.shirtNumber !== null && (
              <span className="absolute -bottom-1 left-1/2 min-w-6 -translate-x-1/2 rounded-full border-2 border-background bg-foreground px-1 text-center text-caption leading-4 font-bold text-background">
                {p.shirtNumber}
              </span>
            )}
          </div>
          <span className="w-full truncate text-center text-caption font-medium">{firstName(p)}</span>
        </ToDetail>
      ))}
    </div>
  )
}

/** C: two per row, small photo beside a large number and the name. */
function VariantC({ players }: { players: Player[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {players.map((p) => (
        <ToDetail
          key={p.member.userId}
          player={p}
          className="flex items-center gap-2 overflow-hidden rounded-md border border-border bg-card pr-2"
        >
          <Photo player={p} className="h-14 w-14 shrink-0 text-small" />
          <span className="w-8 shrink-0 text-center font-display text-lead font-bold tabular-nums">
            {p.shirtNumber ?? '–'}
          </span>
          <span className="min-w-0 truncate text-small font-medium">{p.member.displayName}</span>
        </ToDetail>
      ))}
    </div>
  )
}

const VARIANTS = [
  { key: 'A', name: 'Square tiles' },
  { key: 'B', name: 'Round faces' },
  { key: 'C', name: 'Mini cards' },
]

export function RosterPrototype({ variant: initial }: { variant: string }) {
  const [variant, setVariant] = useState(initial)
  const { data: members = [] } = useMembers()
  const players = toPlayers(members).sort(byNumber)

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
