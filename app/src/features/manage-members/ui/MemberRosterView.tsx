import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { teamPhotoUrl } from '@shared/api/photos'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { MemberFace } from '@entities/member/ui/MemberFace'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { Avatar } from '@shared/ui/avatar'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { isLastAdmin, sortByShirtNumber } from '../lib/roster'

interface MemberRosterViewProps {
  members?: Member[]
  /**
   * Admin capability. `true` renders the full per-row controls (rename, role toggle, position
   * picker, remove, via the row's overflow menu); `false` renders the read-only grid of faces, each
   * opening that member's detail page — every authenticated member sees the roster, only admins can
   * edit it here.
   */
  canManage: boolean
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
 * One quiet row per member (issue #341, variant B): avatar, name as text (Rename in the menu swaps
 * it for an inline field), the position picker inline since it's the common edit, an Admin badge only
 * on admins, and a single overflow (⋯) menu carrying the rarer actions — promote/demote and the
 * destructive remove.
 *
 * The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
 * container, so every state — loading / error / roster / confirm dialog open / last-admin refusal —
 * renders purely from props as a story, with no network. See ADR-0017.
 */
export function MemberRosterView({
  members = [],
  canManage,
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
      <h2 className="font-display text-title font-bold">Members</h2>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-4 text-small text-red">Couldn't load members. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-3">
          {errorMessage && (
            <p role="alert" className="rounded-md bg-red/10 px-3 py-2 text-small text-red">
              {errorMessage}
            </p>
          )}

          {members.length === 0 ? (
            // A team with no members at all — the state a memberless team sits in until its first
            // Admin accepts the handover link (ADR-0024 §5). Transient, but real across the roster.
            // An admin (which, in the handover window, is the acting-in Platform Admin) is pointed at
            // the invite link; a plain viewer just sees that the roster is empty.
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-small text-muted-foreground">
              {canManage
                ? 'No members yet. Share an invite link to bring people in.'
                : 'No members yet.'}
            </p>
          ) : !canManage ? (
            <MemberFaceGrid members={members} />
          ) : (
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
          )}

          <ConfirmDialog
            open={confirmTarget !== null}
            title="Remove member"
            description={<>Remove {confirmTarget?.displayName} from the team? They will lose access until re-invited.</>}
            confirmLabel="Remove"
            onConfirm={() => {
              if (confirmTarget) onRemove(confirmTarget)
              setConfirmTarget(null)
            }}
            onCancel={() => setConfirmTarget(null)}
          />
        </div>
      )}
    </div>
  )
}

// The read-only roster (ADR-0038): round faces with the Shirt Number, ordered by number.
function MemberFaceGrid({ members }: { members: Member[] }) {
  const routes = useTeamRoutes()
  return (
    <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
      {sortByShirtNumber(members).map((member) => (
        <li key={member.userId}>
          <Link
            to={routes.member(member.userId)}
            aria-label={member.displayName}
            className="flex flex-col items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <MemberFace
              userId={member.userId}
              name={member.displayName}
              shirtNumber={member.shirtNumber}
              photoVersion={member.photoVersion}
              size="md"
            />
            <span className="w-full truncate text-center text-caption font-medium">
              {member.displayName.split(' ')[0]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
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
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(member.displayName)
  const isAdmin = member.role === 'ADMIN'
  // The last admin can't be demoted or removed — we hint via tooltip but keep the action enabled
  // so the backend stays the source of truth.
  const lastAdminHint = lastAdmin ? 'This is the last admin — the team must keep at least one.' : undefined

  const startEdit = () => {
    setDraftName(member.displayName)
    setEditingName(true)
  }

  const cancelEdit = () => {
    setDraftName(member.displayName)
    setEditingName(false)
  }

  const saveEdit = () => {
    const next = draftName.trim()
    if (next.length === 0) return
    onRename(member.userId, next)
    setEditingName(false)
  }

  if (editingName) {
    return (
      <li className="flex items-center gap-2 p-3">
        <Avatar userId={member.userId} name={member.displayName} photoUrl={memberPhotoUrl(member)} />
        <Input
          aria-label={`Display name for ${member.displayName}`}
          value={draftName}
          autoFocus
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              saveEdit()
            } else if (e.key === 'Escape') {
              e.preventDefault()
              cancelEdit()
            }
          }}
          className="min-w-0 flex-1"
        />
        <Button size="sm" disabled={isSaving} onClick={saveEdit}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={cancelEdit}>
          Cancel
        </Button>
      </li>
    )
  }

  return (
    // One line at 390px: the name and the picker share what is left after the avatar, the ⋯ and (on
    // an admin row) the badge. Rename lives in the menu, not as a pencil on the row — it is rare,
    // and a third 44px target here squeezed the picker to "Middl…", which is the common edit (#341).
    <li className="flex items-center gap-2 p-3">
      <Avatar userId={member.userId} name={member.displayName} photoUrl={memberPhotoUrl(member)} />
      <span className="min-w-0 flex-1 truncate font-medium" title={member.displayName}>
        {member.displayName}
      </span>
      {positions.length > 0 ? (
        <div className="w-32 shrink-0">
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
        <span className="shrink-0 text-small text-muted-foreground">{member.position?.label ?? 'Unassigned'}</span>
      )}

      {isAdmin && (
        <span className="shrink-0 rounded-full bg-blue/10 px-1.5 py-0.5 text-caption font-semibold text-blue">
          Admin
        </span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Actions for ${member.displayName}`}
            disabled={isSaving}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            ⋯
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={isSaving} onSelect={startEdit}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem title={lastAdminHint} onSelect={() => onToggleRole(member)}>
            {isAdmin ? 'Make member' : 'Make admin'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            tone="destructive"
            title={lastAdminHint}
            onSelect={() => onRequestRemove(member)}
          >
            Remove…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

const memberPhotoUrl = (member: Member) =>
  member.photoVersion ? teamPhotoUrl(member.userId, member.photoVersion) : undefined
