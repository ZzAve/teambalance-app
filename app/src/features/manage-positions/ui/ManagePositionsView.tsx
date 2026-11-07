import { i18n } from '@shared/i18n/i18n'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import type { Position, PositionKind, PositionUsage } from '@shared/api/positions'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { validatePositionLabel } from '../lib/validate-position-label'

interface ManagePositionsViewProps {
  positions?: Position[]
  /**
   * What deleting `confirmTarget` would touch, once the container has fetched it. Undefined while
   * it is still loading — the dialog says so rather than implying "nothing".
   */
  usage?: PositionUsage
  /** Told which position the delete dialog is asking about, so the container can fetch its usage. */
  onConfirmTargetChange?: (position: Position | null) => void
  /** The positions query is in flight — render the loading shell instead of the form. */
  isLoading?: boolean
  /** The positions query failed — render the error shell instead of the form. */
  isError?: boolean
  isSaving?: boolean
  /** Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline. */
  errorCode?: string | null
  onCreate: (label: string) => void
  onRename: (id: string, label: string) => void
  /** Reclassifies a position as played or staffed (#281). Applies at once — no Save to press. */
  onSetKind: (id: string, kind: PositionKind) => void
  onDelete: (position: Position) => void
}

/**
 * Presentational positions-management UI — the complete section, heading and all. Owns only local
 * view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
 * the create/rename/set-kind/delete mutations live in the ManagePositions container.
 *
 * Same quiet-row shape as the member roster (issue #341, variant B): label as text with a pencil to
 * rename it, the Staff checkbox inline since it's the common edit, and a single overflow (⋯) menu
 * carrying the destructive delete.
 *
 * The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
 * container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
 * renders purely from props as a story, with no network. See ADR-0017.
 */
export function ManagePositionsView({
  positions = [],
  usage,
  onConfirmTargetChange,
  isLoading,
  isError,
  isSaving,
  errorCode,
  onCreate,
  onRename,
  onSetKind,
  onDelete,
}: ManagePositionsViewProps) {
  const { t } = useTranslation()
  const [newLabel, setNewLabel] = useState('')
  const [confirmTarget, setConfirmTargetState] = useState<Position | null>(null)
  const setConfirmTarget = (position: Position | null) => {
    setConfirmTargetState(position)
    onConfirmTargetChange?.(position)
  }

  const newLabelError = validatePositionLabel(newLabel)

  const handleCreate = () => {
    if (newLabelError) return
    onCreate(newLabel.trim())
    setNewLabel('')
  }

  return (
    <div>
      <h2 className="font-display text-title font-bold">{t('positions.heading')}</h2>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && (
        <p className="mt-4 text-small text-red-ink">{t('positions.loadFailed')}</p>
      )}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              aria-label={t('positions.newLabel')}
              value={newLabel}
              placeholder={t('positions.placeholder')}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCreate()
                }
              }}
            />
            <Button disabled={isSaving || !!newLabelError} onClick={handleCreate}>
              {t('positions.add')}
            </Button>
          </div>
          {errorCode === 'POSITION_LABEL_TAKEN' && (
            <p className="mt-1 text-small text-red-ink">{t('positions.labelTaken')}</p>
          )}

          {positions.length === 0 ? (
            <p className="text-small text-muted-foreground">{t('positions.empty')}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {positions.map((position) => (
                <PositionRow
                  key={position.id}
                  position={position}
                  isSaving={isSaving}
                  onRename={onRename}
                  onSetKind={onSetKind}
                  onRequestDelete={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <ConfirmDialog
            open={confirmTarget !== null}
            title={t('positions.deleteTitle')}
            description={t('positions.deleteDescription', { label: confirmTarget?.label })}
            confirmLabel={t('positions.delete')}
            onConfirm={() => {
              if (confirmTarget) onDelete(confirmTarget)
              setConfirmTarget(null)
            }}
            onCancel={() => setConfirmTarget(null)}
          >
            {/* Names what the delete will actually touch. A warning, not a veto — the delete
                proceeds either way, but an admin should not have to guess the blast radius. */}
            <p className="text-small text-muted-foreground">
              {usage ? deleteImpact(usage) : t('positions.checkingUsage')}
            </p>
          </ConfirmDialog>
        </div>
      )}
    </div>
  )
}

interface PositionRowProps {
  position: Position
  isSaving?: boolean
  onRename: (id: string, label: string) => void
  onSetKind: (id: string, kind: PositionKind) => void
  onRequestDelete: (position: Position) => void
}

function PositionRow({ position, isSaving, onRename, onSetKind, onRequestDelete }: PositionRowProps) {
  const { t } = useTranslation()
  const [editingLabel, setEditingLabel] = useState(false)
  const [draftLabel, setDraftLabel] = useState(position.label)

  const startEdit = () => {
    setDraftLabel(position.label)
    setEditingLabel(true)
  }

  const cancelEdit = () => {
    setDraftLabel(position.label)
    setEditingLabel(false)
  }

  const saveEdit = () => {
    const next = draftLabel.trim()
    if (next.length === 0) return
    onRename(position.id, next)
    setEditingLabel(false)
  }

  if (editingLabel) {
    return (
      <li className="flex items-center gap-2 p-3">
        <Input
          aria-label={t('positions.labelFor', { label: position.label })}
          value={draftLabel}
          autoFocus
          onChange={(e) => setDraftLabel(e.target.value)}
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
          {isSaving ? t('profileForm.saving') : t('profileForm.save')}
        </Button>
        <Button size="sm" variant="outline" onClick={cancelEdit}>
          {t('common.cancel')}
        </Button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2 p-3">
      <span className="min-w-0 flex-1 truncate font-medium" title={position.label}>
        {position.label}
      </span>
      {/* No local state and no Save: the checkbox reflects the server's kind and the flip is the
          whole gesture. Unchecked is PLAYING, which is what every position was before this existed. */}
      <label className="flex shrink-0 items-center gap-1.5 text-small text-muted-foreground">
        <input
          type="checkbox"
          // Named per row, because "Staff" alone repeats down the list and says nothing about which
          // position it belongs to — the same reason the label field is "Label for Setter".
          aria-label={t('positions.isStaff', { label: position.label })}
          className="size-4 accent-green"
          checked={position.kind === 'STAFF'}
          disabled={isSaving}
          onChange={(e) => onSetKind(position.id, e.target.checked ? 'STAFF' : 'PLAYING')}
        />
        {t('positions.staff')}
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t('members.actionsFor', { name: position.label })}
            disabled={isSaving}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            ⋯
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={isSaving} onSelect={startEdit}>
            {t('members.rename')}
          </DropdownMenuItem>
          <DropdownMenuItem tone="destructive" onSelect={() => onRequestDelete(position)}>
            {t('positions.deleteMenu')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

/**
 * Plain-language blast radius for a position delete. Only the non-zero parts are named, so a
 * position nothing uses reads as a clean removal rather than a list of three zeroes.
 */
function deleteImpact(usage: PositionUsage): string {
  const parts: string[] = []
  if (usage.memberCount > 0) parts.push(i18n.t('positions.impact.members', { count: usage.memberCount }))
  if (usage.eventTypeCount > 0) parts.push(i18n.t('positions.impact.eventTypes', { count: usage.eventTypeCount }))
  if (usage.eventCount > 0) parts.push(i18n.t('positions.impact.events', { count: usage.eventCount }))
  return parts.length === 0
    ? i18n.t('positions.impact.none')
    : i18n.t('positions.impact.list', { parts: parts.join(', ') })
}
