// PROTOTYPE — throwaway (issue #341). Do not fold into main as-is.
// Plan: three structurally different row shapes for the settings roster/positions/event-types
// lists, switchable via ?variant= on the existing /team/settings route. This file is Variant B for
// the members list: quiet row + one overflow (⋯) menu per row.
//
// Reuses the real useMembers/usePositions queries (read-only) so the row renders against live data;
// every mutation is a stub — console.log + a sonner toast describing what would happen — never a
// real write. Deliberately drops the `canManage` prop from the real MemberRoster: this only ever
// mounts on the admin-gated /team/settings screen.
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Member } from '@shared/api/members'
import { useMembers } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { usePositions } from '@shared/api/positions'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { Avatar } from '@shared/ui/avatar'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { isLastAdmin, toggleRole } from '../../lib/roster'

export function MemberRosterVariantB() {
  const { data: members, isLoading, error } = useMembers()
  const { data: positions } = usePositions()

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Members</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red">Couldn't load members. Please try again.</p>}

      {!isLoading && !error && (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {(members ?? []).map((member) => (
            <MemberRowB
              key={member.userId}
              member={member}
              positions={positions ?? []}
              lastAdmin={isLastAdmin(members ?? [], member.userId)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

interface MemberRowBProps {
  member: Member
  positions: Position[]
  lastAdmin: boolean
}

function MemberRowB({ member, positions, lastAdmin }: MemberRowBProps) {
  // Local-only overrides so the stubbed mutations still give visible feedback — none of this
  // reaches the network.
  const [displayName, setDisplayName] = useState(member.displayName)
  const [role, setRole] = useState(member.role)
  const [positionId, setPositionId] = useState<string | null>(member.position?.id ?? null)
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(displayName)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const isAdmin = role === 'ADMIN'
  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  if (editing) {
    return (
      <li className="flex items-center gap-2 p-3">
        <Avatar userId={member.userId} name={displayName} />
        <Input
          aria-label={`Display name for ${displayName}`}
          value={draftName}
          autoFocus
          onChange={(e) => setDraftName(e.target.value)}
          className="min-w-0 flex-1"
        />
        <Button
          size="sm"
          onClick={() => {
            const next = draftName.trim()
            if (next.length === 0) return
            setDisplayName(next)
            console.log('[proto] would rename', member.userId, 'to', next)
            toast(`Would rename "${member.displayName}" to "${next}"`)
            setEditing(false)
          }}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDraftName(displayName)
            setEditing(false)
          }}
        >
          Cancel
        </Button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2 p-3">
      <Avatar userId={member.userId} name={displayName} />
      <button
        type="button"
        onClick={() => {
          setDraftName(displayName)
          setEditing(true)
        }}
        className="min-w-0 flex-1 truncate text-left font-medium underline-offset-2 hover:underline"
        aria-label={`Edit name for ${displayName}`}
        title="Tap to rename"
      >
        {displayName}
      </button>

      <div className="w-28 shrink-0">
        <PositionPicker
          aria-label={`Position for ${displayName}`}
          positions={positions}
          value={positionId}
          includeUnassigned
          onChange={(next) => {
            setPositionId(next)
            const label = positions.find((p) => p.id === next)?.label ?? 'Unassigned'
            console.log('[proto] would move', member.userId, 'to position', next)
            toast(`Would move ${displayName} to ${label}`)
          }}
        />
      </div>

      {isAdmin && (
        <span className="shrink-0 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue">
          ADMIN
        </span>
      )}

      <details ref={detailsRef} className="relative shrink-0">
        <summary
          className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md text-lg hover:bg-accent [&::-webkit-details-marker]:hidden"
          aria-label={`Actions for ${displayName}`}
        >
          ⋯
        </summary>
        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-border bg-background p-1 shadow-lg">
          <button
            type="button"
            className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
            title={isAdmin ? (lastAdmin ? 'This is the last admin — the team must keep at least one.' : undefined) : undefined}
            onClick={() => {
              closeMenu()
              const next = toggleRole(role)
              setRole(next)
              console.log('[proto] would set role of', member.userId, 'to', next)
              toast(`Would make ${displayName} ${next === 'ADMIN' ? 'an admin' : 'a member'}`)
            }}
          >
            {isAdmin ? 'Make member' : 'Make admin'}
          </button>
          <button
            type="button"
            className="block w-full rounded px-3 py-2 text-left text-sm text-red hover:bg-red/10"
            onClick={() => {
              closeMenu()
              setConfirmOpen(true)
            }}
          >
            Remove…
          </button>
        </div>
      </details>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>
              Remove {displayName} from the team? They will lose access until re-invited.
              {lastAdmin && ' This is the last admin — the team must keep at least one.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log('[proto] would remove', member.userId)
                toast(`Would remove ${displayName} from the team`)
                setConfirmOpen(false)
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  )
}
