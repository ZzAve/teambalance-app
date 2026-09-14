// PROTOTYPE — throwaway (issue #341). Do not fold into main as-is.
// Variant C for the members list: the whole 56px row is one tap target that opens a bottom Sheet
// holding every edit for that member. No per-row buttons at all — "one edit surface per thing"
// instead of "actions on the row". Reuses the real useMembers/usePositions queries; every mutation
// is a stub (console.log + toast). See MemberRosterVariantB.tsx for the sibling row shape.
import { useState } from 'react'
import { toast } from 'sonner'
import type { Member } from '@shared/api/members'
import { useMembers } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { usePositions } from '@shared/api/positions'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { Avatar } from '@shared/ui/avatar'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { isLastAdmin, toggleRole } from '../../lib/roster'

export function MemberRosterVariantC() {
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
            <MemberRowC
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

interface MemberRowCProps {
  member: Member
  positions: Position[]
  lastAdmin: boolean
}

function MemberRowC({ member, positions, lastAdmin }: MemberRowCProps) {
  // Local-only overrides for visible feedback from the stubbed mutations — nothing here reaches
  // the network.
  const [displayName, setDisplayName] = useState(member.displayName)
  const [role, setRole] = useState(member.role)
  const [positionId, setPositionId] = useState<string | null>(member.position?.id ?? null)
  const [open, setOpen] = useState(false)
  const [draftName, setDraftName] = useState(displayName)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isAdmin = role === 'ADMIN'
  const dirty = draftName.trim().length > 0 && draftName.trim() !== displayName

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setDraftName(displayName)
          setOpen(true)
        }}
        className="flex h-14 w-full items-center gap-3 p-3 text-left hover:bg-accent/50"
        aria-label={`Edit ${displayName}`}
      >
        <Avatar userId={member.userId} name={displayName} />
        <span className="min-w-0 flex-1 truncate font-medium">{displayName}</span>
        <span className="shrink-0 truncate text-sm text-muted-foreground">
          {positions.find((p) => p.id === positionId)?.label ?? 'Unassigned'}
        </span>
        {isAdmin && (
          <span className="shrink-0 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue">
            ADMIN
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{displayName}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Name
              <Input
                aria-label={`Display name for ${displayName}`}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </label>
            {dirty && (
              <Button
                size="sm"
                className="self-start"
                onClick={() => {
                  const next = draftName.trim()
                  setDisplayName(next)
                  console.log('[proto] would rename', member.userId, 'to', next)
                  toast(`Would rename "${member.displayName}" to "${next}"`)
                }}
              >
                Save name
              </Button>
            )}

            <label className="flex flex-col gap-1 text-sm font-medium">
              Position
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
            </label>

            <label className="flex items-center justify-between gap-2 text-sm font-medium">
              Admin
              <input
                type="checkbox"
                aria-label={`${displayName} is admin`}
                className="size-5 accent-blue"
                checked={isAdmin}
                title={lastAdmin ? 'This is the last admin — the team must keep at least one.' : undefined}
                onChange={() => {
                  const next = toggleRole(role)
                  setRole(next)
                  console.log('[proto] would set role of', member.userId, 'to', next)
                  toast(`Would make ${displayName} ${next === 'ADMIN' ? 'an admin' : 'a member'}`)
                }}
              />
            </label>

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setConfirmOpen(true)}
            >
              Remove from team…
            </Button>
          </div>
        </SheetContent>
      </Sheet>

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
                setOpen(false)
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
