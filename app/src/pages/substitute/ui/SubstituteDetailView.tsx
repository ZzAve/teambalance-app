import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Hash, Pencil, Shirt, Trash2 } from 'lucide-react'
import type { Position } from '@shared/api/positions'
import type { Substitute } from '@shared/api/substitutes'
import { SubstituteFace } from '@entities/event/ui/SubstituteFace'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { parseShirtNumber } from '@features/edit-profile/lib/parse-shirt-number'
import { eventCountLine } from '@features/manage-substitutes/lib/event-count-line'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { Input } from '@shared/ui/input'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { CARD, ICON, ROW, ROW_INTERACTIVE } from '@shared/ui/settings-list'

interface SubstituteDetailViewProps {
  /** Undefined while loading, on error, or when the id names nobody on the list (e.g. just removed). */
  substitute?: Substitute
  positions: Position[]
  isLoading?: boolean
  isError?: boolean
  /** Admins edit and remove a Substitute; everyone else reads the page. */
  canManage: boolean
  /** A write is in flight — the Admin group's controls are disabled. */
  isSaving?: boolean
  /** A refusal surfaced by the container (e.g. the name or number is taken), shown in the Admin group. */
  errorMessage?: string
  /** How many Events the Substitute is on, once fetched for the open remove dialog. */
  eventCount?: number
  eventCountFailed?: boolean
  /** Told when the remove dialog opens or closes, so the container fetches the count only then. */
  onRemoveDialogChange?: (open: boolean) => void
  onChangePosition: (positionId: string | null) => void
  onRename: (name: string) => void
  /** Null clears the number. Unique among Substitutes only (ADR-0038). */
  onChangeShirtNumber: (shirtNumber: number | null) => void
  onRemove: () => void
}

/**
 * One Substitute's page, opened from their face on /team (ADR-0033): face with the Shirt Number,
 * name and Position. An Admin also gets the Admin group: Position, Rename, Shirt number and Remove.
 * Removing is final and reaches past Events (ADR-0009), so the confirm dialog says so, and how many
 * Events it touches. Prop-only; the route container owns the queries and mutations (ADR-0017).
 */
export function SubstituteDetailView({
  substitute,
  positions,
  isLoading,
  isError,
  canManage,
  isSaving = false,
  errorMessage,
  eventCount,
  eventCountFailed = false,
  onRemoveDialogChange,
  onChangePosition,
  onRename,
  onChangeShirtNumber,
  onRemove,
}: SubstituteDetailViewProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()
  const [editing, setEditing] = useState<'name' | 'number' | null>(null)
  const [draft, setDraft] = useState('')
  const [confirmingRemove, setConfirmingRemoveState] = useState(false)
  const setConfirmingRemove = (open: boolean) => {
    setConfirmingRemoveState(open)
    onRemoveDialogChange?.(open)
  }

  // The API sends null for "no number" although the generated type says undefined.
  const shirtNumber = typeof substitute?.shirtNumber === 'number' ? substitute.shirtNumber : null
  const parsedNumber = parseShirtNumber(draft)
  const draftError = editing === 'number' ? parsedNumber.error : null

  const startEdit = (field: 'name' | 'number') => {
    setDraft(field === 'name' ? (substitute?.name ?? '') : (shirtNumber?.toString() ?? ''))
    setEditing(field)
  }
  const save = () => {
    if (editing === 'name') {
      const name = draft.trim()
      if (name.length === 0) return
      onRename(name)
    } else if (editing === 'number') {
      if (parsedNumber.error) return
      onChangeShirtNumber(parsedNumber.value)
    }
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={substitute?.name ?? t('substituteDetail.fallbackTitle')}
        backTo={routes.team}
        backLabel={t('memberDetail.back')}
      />

      {isLoading && <p className="text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="text-small text-red-ink">{t('manageSubstitutes.loadFailed')}</p>}
      {!isLoading && !isError && !substitute && (
        <p className="text-small text-muted-foreground">{t('substituteDetail.notOnList')}</p>
      )}

      {substitute && (
        <>
          <div className="flex flex-col items-center gap-2">
            <SubstituteFace name={substitute.name} shirtNumber={shirtNumber} size="lg" />
            <h1 className="font-display text-title font-bold">{substitute.name}</h1>
            <span className="text-small text-muted-foreground">
              {t('substituteDetail.subline', { position: substitute.position?.label ?? t('position.unassigned') })}
            </span>
          </div>

          {!canManage ? (
            <div className={`${CARD} divide-y divide-border`}>
              <div className={ROW}>
                <Hash size={18} className={ICON} aria-hidden="true" />
                <span className="font-medium">{t('profileForm.shirtNumber')}</span>
                <span className="ml-auto text-muted-foreground">{shirtNumber ?? t('profileForm.shirtNone')}</span>
              </div>
              <div className={ROW}>
                <Shirt size={18} className={ICON} aria-hidden="true" />
                <span className="font-medium">{t('profileForm.position')}</span>
                <span className="ml-auto text-muted-foreground">{substitute.position?.label ?? t('position.unassigned')}</span>
              </div>
            </div>
          ) : (
            <section>
              <SectionLabel as="h3" className="mb-2 px-1 text-small">{t('memberDetail.adminGroup')}</SectionLabel>
              {errorMessage && (
                <p role="alert" className="mb-2 rounded-md bg-red/10 px-3 py-2 text-small text-red-ink">
                  {errorMessage}
                </p>
              )}
              <div className={`${CARD} divide-y divide-border`}>
                <div className={ROW}>
                  <Shirt size={18} className={ICON} aria-hidden="true" />
                  <span className="flex-1 font-medium">{t('profileForm.position')}</span>
                  <div className="w-40 shrink-0">
                    <PositionPicker
                      aria-label={t('members.positionFor', { name: substitute.name })}
                      positions={positions}
                      value={substitute.position?.id ?? null}
                      includeUnassigned
                      disabled={isSaving}
                      onChange={onChangePosition}
                    />
                  </div>
                </div>

                {editing ? (
                  <div className="flex flex-col gap-2 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Input
                        aria-label={
                          editing === 'name'
                            ? t('manageSubstitutes.nameFor', { name: substitute.name })
                            : t('manageSubstitutes.shirtNumberFor', { name: substitute.name })
                        }
                        inputMode={editing === 'number' ? 'numeric' : undefined}
                        placeholder={editing === 'number' ? t('profileForm.shirtNone') : undefined}
                        maxLength={editing === 'name' ? 100 : undefined}
                        value={draft}
                        autoFocus
                        aria-invalid={draftError ? true : undefined}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            save()
                          } else if (e.key === 'Escape') {
                            e.preventDefault()
                            setEditing(null)
                          }
                        }}
                        className="min-w-0 flex-1"
                      />
                      <Button size="sm" disabled={isSaving || !!draftError} onClick={save}>
                        {t('profileForm.save')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                        {t('common.cancel')}
                      </Button>
                    </div>
                    {draftError && <p className="text-small text-red-ink">{draftError}</p>}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`${ROW_INTERACTIVE} disabled:opacity-50`}
                      disabled={isSaving}
                      onClick={() => startEdit('name')}
                    >
                      <Pencil size={18} className={ICON} aria-hidden="true" />
                      <span className="flex-1 font-medium">{t('members.rename')}</span>
                    </button>
                    <button
                      type="button"
                      className={`${ROW_INTERACTIVE} disabled:opacity-50`}
                      disabled={isSaving}
                      onClick={() => startEdit('number')}
                    >
                      <Hash size={18} className={ICON} aria-hidden="true" />
                      <span className="flex-1 font-medium">{t('profileForm.shirtNumber')}</span>
                      <span className="text-muted-foreground">{shirtNumber ?? t('profileForm.shirtNone')}</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className={`${ROW_INTERACTIVE} font-semibold text-red-ink hover:bg-red/5 disabled:opacity-50`}
                  disabled={isSaving}
                  onClick={() => setConfirmingRemove(true)}
                >
                  <Trash2 size={18} className="shrink-0" aria-hidden="true" />
                  {t('manageSubstitutes.removeTitle')}
                </button>
              </div>

              <ConfirmDialog
                open={confirmingRemove}
                title={t('manageSubstitutes.removeTitle')}
                description={t('manageSubstitutes.removeDescription', { name: substitute.name })}
                confirmLabel={t('account.remove')}
                onConfirm={() => {
                  setConfirmingRemove(false)
                  onRemove()
                }}
                onCancel={() => setConfirmingRemove(false)}
              >
                <p className="text-small text-muted-foreground">
                  {eventCountLine(substitute.name, eventCount, eventCountFailed)}
                </p>
              </ConfirmDialog>
            </section>
          )}
        </>
      )}
    </div>
  )
}
