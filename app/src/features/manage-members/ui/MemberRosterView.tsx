import { useState } from 'react'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
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
import { isLastAdmin } from '../lib/roster'

interface MemberRosterViewProps {
  members?: Member[]
  /** The team's position vocabulary, offered per row so an admin can (re)assign a member. */
  positions: Position[]
  /** The members query is in flight — render the loading shell instead of the roster. */
  isLoading?: boolean
  /** The members query failed — render the error shell instead of the roster. */
  isError?: boolean
  /** userId currently mid-mutation — its row's actions show a pending/disabled state. */
  savingUserId?: string | null
  /** A refusal surfaced by the container (e.g. LAST_ADMIN); shown as an inline banner. */
  errorMessage?: string | null
  onRename: (userId: string, displayName: string) => void
  onToggleRole: (member: Member) => void
  onChangePosition: (member: Member, positionId: string | null) => void
  onRemove: (member: Member) => void
}

/**
 * Presentational admin roster — the complete section, heading and all. Owns only local view state
 * (per-row name edits + the remove-confirm dialog target); the queries and mutations live in the
 * MemberRoster container.
 *
 * The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
 * container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
 * renders purely from props as a story, with no network. See ADR-0017.
 */
export function MemberRosterView({
  members = [],
  positions,
  isLoading,
  isError,
  savingUserId,
  errorMessage,
  onRename,
  onToggleRole,
  onChangePosition,
  onRemove,
}: MemberRosterViewProps) {
  const [confirmTarget, setConfirmTarget] = useState<Member | null>(null)

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Members</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-4 text-sm text-red-500">Couldn't load members. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-3">
          {errorMessage && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <ul className="divide-y divide-border rounded-lg border border-border">
            {members.map((member) => (
              <MemberRow
                key={member.userId}
                member={member}
                positions={positions}
                lastAdmin={isLastAdmin(members, member.userId)}
                isSaving={savingUserId === member.userId}
                onRename={onRename}
                onToggleRole={onToggleRole}
                onChangePosition={onChangePosition}
                onRequestRemove={setConfirmTarget}
              />
            ))}
          </ul>

          <Dialog open={confirmTarget !== null} onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove member</DialogTitle>
                <DialogDescription>
                  Remove {confirmTarget?.displayName} from the team? They will lose access until re-invited.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmTarget(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirmTarget) onRemove(confirmTarget)
                    setConfirmTarget(null)
                  }}
                >
                  Remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

interface MemberRowProps {
  member: Member
  positions: Position[]
  lastAdmin: boolean
  isSaving: boolean
  onRename: (userId: string, displayName: string) => void
  onToggleRole: (member: Member) => void
  onChangePosition: (member: Member, positionId: string | null) => void
  onRequestRemove: (member: Member) => void
}

function MemberRow({
  member,
  positions,
  lastAdmin,
  isSaving,
  onRename,
  onToggleRole,
  onChangePosition,
  onRequestRemove,
}: MemberRowProps) {
  const [name, setName] = useState(member.displayName)
  const isAdmin = member.role === 'ADMIN'
  const dirty = name.trim().length > 0 && name.trim() !== member.displayName
  // The last admin can't be demoted or removed — we hint via tooltip but keep the buttons enabled
  // so the backend stays the source of truth.
  const lastAdminHint = lastAdmin ? 'This is the last admin — the team must keep at least one.' : undefined

  return (
    <li className="flex flex-wrap items-center gap-2 p-3">
      <Input
        aria-label={`Display name for ${member.displayName}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-40"
      />
      {dirty && (
        <Button size="sm" disabled={isSaving} onClick={() => onRename(member.userId, name.trim())}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      )}

      {positions.length > 0 ? (
        <div className="w-44">
          <PositionPicker
            aria-label={`Position for ${member.displayName}`}
            positions={positions}
            value={member.position?.id ?? null}
            includeUnassigned
            disabled={isSaving}
            onChange={(positionId) => onChangePosition(member, positionId)}
          />
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">{member.position?.label ?? 'Unassigned'}</span>
      )}

      <span
        className={[
          'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold',
          isAdmin ? 'bg-blue/10 text-blue' : 'bg-muted text-muted-foreground',
        ].join(' ')}
      >
        {member.role}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={isSaving}
        title={isAdmin ? lastAdminHint : undefined}
        onClick={() => onToggleRole(member)}
      >
        {isAdmin ? 'Make member' : 'Make admin'}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={isSaving}
        title={lastAdminHint}
        onClick={() => onRequestRemove(member)}
      >
        Remove
      </Button>
    </li>
  )
}
