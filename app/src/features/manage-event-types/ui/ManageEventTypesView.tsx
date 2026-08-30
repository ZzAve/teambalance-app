import { useState } from 'react'
import { Archive, ArchiveRestore, Pencil } from 'lucide-react'
import type { EventTypeItem, RosterRequirement } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'
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
import { RosterRequirementEditor } from './RosterRequirementEditor'
import { rosterDefaultSummary } from '../lib/roster-default-summary'
import { isEditorOpen } from '../lib/editor-open'

export interface EventTypeDraft {
  name: string
  color?: string
  rosterDefault: RosterRequirement
}

interface ManageEventTypesViewProps {
  eventTypes?: EventTypeItem[]
  positions?: Position[]
  isLoading?: boolean
  isError?: boolean
  isSaving?: boolean
  /** Backend error discriminator from the container (e.g. EVENT_TYPE_NAME_TAKEN), shown inline. */
  errorCode?: string | null
  onCreate: (draft: EventTypeDraft) => void
  onUpdate: (id: string, draft: EventTypeDraft) => void
  onArchive: (id: string, migrateEventsTo?: string) => void
  onUnarchive: (id: string) => void
}

const OFF: RosterRequirement = { trackRoster: false, totalTarget: undefined, positionTargets: [] }

const PALETTE = ['#225C9C', '#249E6C', '#F4B400', '#7B5EA7', '#E87C3E', '#D93025']

const FALLBACK_ERROR = 'Something went wrong. Please try again.'

const ERROR_MESSAGES: Record<string, string> = {
  EVENT_TYPE_NAME_TAKEN: 'That event type already exists.',
  LAST_EVENT_TYPE: 'A team must keep at least one active event type.',
  INVALID_REQUEST: "That didn't work — check the name and roster, then try again.",
  FORBIDDEN: 'You are not allowed to make this change.',
  NOT_FOUND: 'That event type no longer exists. Reload and try again.',
}

/**
 * Presentational event-type management — the whole section, heading and all.
 *
 * Owns only local view state (which type is being edited, the draft in the form, the archive
 * dialog's target and migration choice); the queries and mutations live in the ManageEventTypes
 * container. The load/error shells are props-driven so every state is a story with no network
 * (ADR-0017).
 */
export function ManageEventTypesView({
  eventTypes = [],
  positions = [],
  isLoading,
  isError,
  isSaving,
  errorCode,
  onCreate,
  onUpdate,
  onArchive,
  onUnarchive,
}: ManageEventTypesViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EventTypeDraft | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<EventTypeItem | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const active = eventTypes.filter((t) => !t.archived)
  const archived = eventTypes.filter((t) => t.archived)

  const startCreate = () => {
    setEditingId('new')
    setDraft({ name: '', color: PALETTE[0], rosterDefault: OFF })
    setSubmitted(false)
  }

  const startEdit = (type: EventTypeItem) => {
    setEditingId(type.id)
    setDraft({ name: type.name, color: type.color, rosterDefault: type.rosterDefault })
    setSubmitted(false)
  }

  const close = () => {
    setEditingId(null)
    setDraft(null)
    setSubmitted(false)
  }

  const editorOpen = isEditorOpen({ hasDraft: draft !== null, submitted, errorCode })

  const submit = () => {
    if (!draft || draft.name.trim().length === 0) return
    const payload = { ...draft, name: draft.name.trim() }
    if (editingId === 'new') onCreate(payload)
    else if (editingId) onUpdate(editingId, payload)
    setSubmitted(true)
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Event types</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Each type carries the roster an event of that kind needs. Events follow their type unless you
        give one its own.
      </p>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-4 text-sm text-red">Couldn't load event types. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Every code the container can hand down renders something. A save that failed and said
              nothing is indistinguishable from one that worked. */}
          {errorCode && <p className="text-sm text-red">{ERROR_MESSAGES[errorCode] ?? FALLBACK_ERROR}</p>}

          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground">No event types yet. Add one below.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {active.map((type) => (
                <li key={type.id} className="flex flex-wrap items-center gap-2 p-3">
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: type.color ?? '#94A3B8' }}
                  />
                  <span className="text-sm font-semibold">{type.name}</span>
                  <span className="text-[11.5px] text-muted-foreground">
                    {rosterDefaultSummary(type.rosterDefault, positions)}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                      onClick={() => startEdit(type)}
                      aria-label={`Edit ${type.name}`}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isSaving}
                      onClick={() => setArchiveTarget(type)}
                      aria-label={`Archive ${type.name}`}
                    >
                      <Archive size={14} />
                      Archive
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!editorOpen && (
            <Button className="self-start" disabled={isSaving} onClick={startCreate}>
              Add event type
            </Button>
          )}

          {editorOpen && draft && (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
              <h3 className="text-sm font-semibold">
                {editingId === 'new' ? 'New event type' : 'Edit event type'}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  aria-label="Event type name"
                  className="w-48"
                  value={draft.name}
                  placeholder="e.g. Match"
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
                <div className="flex gap-1.5" role="radiogroup" aria-label="Colour">
                  {PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      role="radio"
                      aria-checked={draft.color === color}
                      aria-label={`Colour ${color}`}
                      onClick={() => setDraft({ ...draft, color })}
                      style={{ background: color }}
                      className={`size-6 rounded-full ring-offset-background transition-transform ${
                        draft.color === color ? 'ring-2 ring-foreground ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <RosterRequirementEditor
                idPrefix="type-default"
                value={draft.rosterDefault}
                positions={positions}
                disabled={isSaving}
                onChange={(rosterDefault) => setDraft({ ...draft, rosterDefault })}
              />

              <div className="flex gap-2">
                <Button disabled={isSaving || draft.name.trim().length === 0} onClick={submit}>
                  Save
                </Button>
                <Button variant="outline" disabled={isSaving} onClick={close}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {archived.length > 0 && (
            <div className="mt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">
                Archived
              </h3>
              <ul className="mt-2 divide-y divide-border rounded-lg border border-dashed border-border">
                {archived.map((type) => (
                  <li key={type.id} className="flex items-center gap-2 p-3">
                    <span className="text-sm text-muted-foreground">{type.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      disabled={isSaving}
                      onClick={() => onUnarchive(type.id)}
                      aria-label={`Restore ${type.name}`}
                    >
                      <ArchiveRestore size={14} />
                      Restore
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ArchiveDialog
        target={archiveTarget}
        alternatives={active.filter((t) => t.id !== archiveTarget?.id)}
        isSaving={isSaving}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={(id, migrateEventsTo) => {
          onArchive(id, migrateEventsTo)
          setArchiveTarget(null)
        }}
      />
    </div>
  )
}

interface ArchiveDialogProps {
  target: EventTypeItem | null
  alternatives: EventTypeItem[]
  isSaving?: boolean
  onCancel: () => void
  onConfirm: (id: string, migrateEventsTo?: string) => void
}

/**
 * The destructive confirmation. It leads with the migration offer rather than burying it, because
 * moving the events somewhere still visible is almost always what an admin wants — keeping them on
 * a type that no longer appears in any picker is the fallback, not the default.
 *
 * It cannot delete anything: an event's type is non-null, so archiving only ever hides the type.
 */
function ArchiveDialog({ target, alternatives, isSaving, onCancel, onConfirm }: ArchiveDialogProps) {
  const [migrateTo, setMigrateTo] = useState<string>('')

  return (
    <Dialog
      open={target !== null}
      onOpenChange={(open) => {
        if (!open) {
          setMigrateTo('')
          onCancel()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive "{target?.name}"?</DialogTitle>
          <DialogDescription>
            It disappears from the event pickers. Existing events keep this type and still show — no
            event is deleted.
          </DialogDescription>
        </DialogHeader>

        {alternatives.length > 0 && (
          <div className="flex flex-col gap-2">
            <label htmlFor="migrate-to" className="text-[13px] font-semibold">
              Move its events to another type first?
            </label>
            <select
              id="migrate-to"
              className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={migrateTo}
              onChange={(e) => setMigrateTo(e.target.value)}
            >
              <option value="">Leave them on "{target?.name}"</option>
              {alternatives.map((t) => (
                <option key={t.id} value={t.id}>
                  Move to {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setMigrateTo('')
              onCancel()
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isSaving}
            onClick={() => {
              if (target) onConfirm(target.id, migrateTo || undefined)
              setMigrateTo('')
            }}
          >
            Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
