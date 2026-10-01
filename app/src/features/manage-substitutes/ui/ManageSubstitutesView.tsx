import { useState } from 'react'
import type { Position } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { eventCountLine } from '../lib/event-count-line'

interface ManageSubstitutesViewProps {
  substitutes?: Substitute[]
  /**
   * Admin capability. `true` renders the per-row controls (position picker, rename and remove in the
   * row's menu); `false` renders read-only rows. The route decides: /team/settings manages, /team views.
   */
  canManage: boolean
  /** The team's position vocabulary, offered per row so an admin can (re)assign a Substitute. */
  positions: Position[]
  /** The substitutes query is in flight — render the loading shell instead of the list. */
  isLoading?: boolean
  /** The substitutes query failed — render the error shell instead of the list. */
  isError?: boolean
  /** id of the Substitute mid-mutation — its row's controls are disabled. */
  savingId?: string | null
  /** A refusal surfaced by the container (e.g. a name already on the list), shown as a banner. */
  errorMessage?: string | null
  /**
   * How many Events the remove dialog's Substitute is on, once the container has fetched it.
   * Undefined while loading: the dialog says so rather than implying "none".
   */
  eventCount?: number
  /** The count could not be read; the dialog says so instead of "Checking…". */
  eventCountFailed?: boolean
  /** Told which Substitute the remove dialog is asking about, so the container can fetch the count. */
  onConfirmTargetChange?: (substitute: Substitute | null) => void
  onRename: (substitute: Substitute, name: string) => void
  onChangePosition: (substitute: Substitute, positionId: string | null) => void
  onRemove: (substitute: Substitute) => void
}

/**
 * The Team's list of Substitutes (ADR-0033), heading and all. Rows match the Member roster's
 * (MemberRosterView): avatar, name, the Position picker inline, and a ⋯ menu for Rename and Remove.
 * Owns only local view state (the inline rename and the remove-confirm target); the query and
 * mutations live in the ManageSubstitutes container, so every state renders from props (ADR-0017).
 *
 * Removing is final and reaches past Events (ADR-0009), so the confirm dialog says both, and how
 * many Events it touches.
 */
export function ManageSubstitutesView({
  substitutes = [],
  canManage,
  positions,
  isLoading,
  isError,
  savingId,
  errorMessage,
  eventCount,
  eventCountFailed = false,
  onConfirmTargetChange,
  onRename,
  onChangePosition,
  onRemove,
}: ManageSubstitutesViewProps) {
  const [confirmTarget, setConfirmTargetState] = useState<Substitute | null>(null)
  const setConfirmTarget = (substitute: Substitute | null) => {
    setConfirmTargetState(substitute)
    onConfirmTargetChange?.(substitute)
  }

  return (
    <div>
      <h2 className="font-display text-title font-bold">Substitutes</h2>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">Loading…</p>}
      {isError && <p className="mt-4 text-small text-red">Couldn't load substitutes. Please try again.</p>}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-3">
          {errorMessage && (
            <p role="alert" className="rounded-md bg-red/10 px-3 py-2 text-small text-red">
              {errorMessage}
            </p>
          )}

          {substitutes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-small text-muted-foreground">
              {canManage
                ? 'No substitutes yet. Members add them when calling someone in for an event.'
                : 'No substitutes yet.'}
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {substitutes.map((substitute) => (
                <SubstituteRow
                  key={substitute.id}
                  substitute={substitute}
                  canManage={canManage}
                  positions={positions}
                  isSaving={savingId === substitute.id}
                  onRename={onRename}
                  onChangePosition={onChangePosition}
                  onRequestRemove={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <Dialog open={confirmTarget !== null} onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove substitute</DialogTitle>
                <DialogDescription>
                  {confirmTarget?.name} will disappear from every event they were added to, including past ones. This
                  can't be undone.
                </DialogDescription>
              </DialogHeader>
              <p className="text-small text-muted-foreground">
                {confirmTarget && eventCountLine(confirmTarget.name, eventCount, eventCountFailed)}
              </p>
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

interface SubstituteRowProps {
  substitute: Substitute
  canManage: boolean
  positions: Position[]
  isSaving: boolean
  onRename: (substitute: Substitute, name: string) => void
  onChangePosition: (substitute: Substitute, positionId: string | null) => void
  onRequestRemove: (substitute: Substitute) => void
}

function SubstituteRow({
  substitute,
  canManage,
  positions,
  isSaving,
  onRename,
  onChangePosition,
  onRequestRemove,
}: SubstituteRowProps) {
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(substitute.name)

  const startEdit = () => {
    setDraftName(substitute.name)
    setEditingName(true)
  }

  const cancelEdit = () => {
    setDraftName(substitute.name)
    setEditingName(false)
  }

  const saveEdit = () => {
    const next = draftName.trim()
    if (next.length === 0) return
    onRename(substitute, next)
    setEditingName(false)
  }

  const positionLabel = (
    <span className="shrink-0 text-small text-muted-foreground">{substitute.position?.label ?? 'Unassigned'}</span>
  )

  if (!canManage) {
    return (
      <li className="flex items-center gap-2 p-3">
        <SubstituteAvatar name={substitute.name} />
        <span className="min-w-0 flex-1 truncate font-medium" title={substitute.name}>
          {substitute.name}
        </span>
        {positionLabel}
      </li>
    )
  }

  if (editingName) {
    return (
      <li className="flex items-center gap-2 p-3">
        <SubstituteAvatar name={substitute.name} />
        <Input
          aria-label={`Name for ${substitute.name}`}
          value={draftName}
          maxLength={100}
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
    <li className="flex items-center gap-2 p-3">
      <SubstituteAvatar name={substitute.name} />
      <span className="min-w-0 flex-1 truncate font-medium" title={substitute.name}>
        {substitute.name}
      </span>
      {positions.length > 0 ? (
        <div className="w-32 shrink-0">
          <PositionPicker
            aria-label={`Position for ${substitute.name}`}
            positions={positions}
            value={substitute.position?.id ?? null}
            includeUnassigned
            disabled={isSaving}
            onChange={(positionId) => onChangePosition(substitute, positionId)}
          />
        </div>
      ) : (
        positionLabel
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Actions for ${substitute.name}`}
            disabled={isSaving}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            ⋯
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={startEdit}>Rename</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="destructive" onSelect={() => onRequestRemove(substitute)}>
            Remove…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
