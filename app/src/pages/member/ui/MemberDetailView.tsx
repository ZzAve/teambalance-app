import { useTranslation } from 'react-i18next'
import { useState, type ReactNode } from 'react'
import { Hash, Shield, Shirt, Trash2 } from 'lucide-react'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { MemberFace } from '@entities/member/ui/MemberFace'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'
import { PhotoPicker } from '@features/pick-photo/ui/PhotoPicker'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { CARD, ICON, ROW, ROW_INTERACTIVE } from '@shared/ui/settings-list'

interface MemberDetailViewProps {
  /** Undefined while loading, on error, or when the id names nobody on the Roster. */
  member?: Member
  positions: Position[]
  isLoading?: boolean
  isError?: boolean
  /** The member themselves, or an Admin (ADR-0038). */
  canEdit: boolean
  isEditing: boolean
  isSaving: boolean
  /** Backend error discriminator from the update (e.g. NAME_TAKEN, NUMBER_TAKEN), shown inline. */
  errorCode?: string
  /** A failed save the form has no field for (e.g. forbidden, member gone), shown above the form. */
  errorMessage?: string
  onEdit: () => void
  onCancelEdit: () => void
  onSubmit: (name: string, positionId: string | null, shirtNumber: number | null) => void
  /** Only the member themselves sets their Team Photo (ADR-0038). */
  canChangePhoto: boolean
  /** The member themselves, or an Admin — the one thing an Admin may do to someone's photo. */
  canRemovePhoto: boolean
  /** The viewer's Personal Photo, shown before it replaces the Team Photo; undefined when they have none. */
  personalPhotoUrl?: string
  isPhotoSaving: boolean
  photoErrorMessage?: string
  onUploadPhoto: (photo: Blob) => void
  onUsePersonalPhoto: () => void
  onRemovePhoto: () => void
  /** The payment-aliases editor, container-supplied (ADR-0045). Shown only when `canEdit`. */
  paymentAliases?: ReactNode
  /**
   * An Admin on another member's page (ADR-0013): shows the Admin group — Position, Make admin /
   * Make member, Remove from team. Never on your own page, so an Admin cannot demote themselves here.
   */
  canAdminister?: boolean
  /** A role, Position or remove write from the Admin group is in flight. */
  isAdminSaving?: boolean
  /** A refusal of an Admin-group write (e.g. LAST_ADMIN), shown in the group. */
  adminErrorMessage?: string
  onChangePosition?: (positionId: string | null) => void
  onToggleRole?: () => void
  /** Called once the remove is confirmed in the dialog. */
  onRemove?: () => void
}


/**
 * One Member's page, opened from the /team roster (ADR-0038): their face with the Shirt Number, then
 * number, Position and Role as a settings list. The member and Admins get an Edit button that swaps
 * the list for the profile form. Below the face the member sets their Team Photo; an Admin may only
 * remove it. Prop-only; the route container owns the queries, the mutation and
 * the editing flag, so every state is a story.
 */
export function MemberDetailView({
  member,
  positions,
  isLoading,
  isError,
  canEdit,
  isEditing,
  isSaving,
  errorCode,
  errorMessage,
  onEdit,
  onCancelEdit,
  onSubmit,
  canChangePhoto,
  canRemovePhoto,
  personalPhotoUrl,
  isPhotoSaving,
  photoErrorMessage,
  onUploadPhoto,
  onUsePersonalPhoto,
  onRemovePhoto,
  paymentAliases,
  canAdminister = false,
  isAdminSaving = false,
  adminErrorMessage,
  onChangePosition,
  onToggleRole,
  onRemove,
}: MemberDetailViewProps) {
  const { t } = useTranslation()
  const routes = useTeamRoutes()
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [confirmingRemoveMember, setConfirmingRemoveMember] = useState(false)
  const [previewingPersonal, setPreviewingPersonal] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={member?.displayName ?? t('memberDetail.fallbackTitle')}
        backTo={routes.team}
        backLabel={t('memberDetail.back')}
      />

      {isLoading && <p className="text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="text-small text-red-ink">{t('memberDetail.loadFailed')}</p>}
      {!isLoading && !isError && !member && (
        <p className="text-small text-muted-foreground">{t('memberDetail.notOnTeam')}</p>
      )}

      {member && (
        <>
          <div className="flex flex-col items-center gap-2">
            <MemberFace
              userId={member.userId}
              name={member.displayName}
              shirtNumber={member.shirtNumber}
              photoVersion={member.photoVersion}
              size="lg"
            />
            <h1 className="font-display text-title font-bold">{member.displayName}</h1>
            <span className="text-small text-muted-foreground">{member.position?.label ?? t('position.unassigned')}</span>
          </div>

          {(canChangePhoto || (canRemovePhoto && member.photoVersion)) && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {canChangePhoto && personalPhotoUrl && (
                  <Button variant="outline" size="sm" disabled={isPhotoSaving} onClick={() => setPreviewingPersonal(true)}>
                    {t('memberDetail.usePersonal')}
                  </Button>
                )}
                {canChangePhoto && (
                  <PhotoPicker
                    label={member.photoVersion ? t('memberDetail.uploadDifferent') : t('account.uploadPhoto')}
                    disabled={isPhotoSaving}
                    onPicked={onUploadPhoto}
                  />
                )}
                {canRemovePhoto && member.photoVersion && (
                  <Button variant="outline" size="sm" disabled={isPhotoSaving} onClick={() => setConfirmingRemove(true)}>
                    {t('account.removePhoto')}
                  </Button>
                )}
              </div>
              {photoErrorMessage && <p className="text-small text-red-ink">{photoErrorMessage}</p>}
              <ConfirmDialog
                open={previewingPersonal}
                title={t('memberDetail.usePersonalTitle')}
                description={
                  member.photoVersion ? t('memberDetail.replaces') : t('memberDetail.teamWillSee')
                }
                confirmLabel={t('memberDetail.useThis')}
                onConfirm={() => {
                  setPreviewingPersonal(false)
                  onUsePersonalPhoto()
                }}
                onCancel={() => setPreviewingPersonal(false)}
              >
                <img
                  src={personalPhotoUrl}
                  alt={t('memberDetail.personalAlt')}
                  className="mx-auto h-28 w-28 rounded-full object-cover"
                />
              </ConfirmDialog>
              <ConfirmDialog
                open={confirmingRemove}
                title={t('account.removePhoto')}
                description={
                  canChangePhoto
                    ? t('memberDetail.removeSelf')
                    : t('memberDetail.removeOther', { name: member.displayName })
                }
                confirmLabel={t('account.remove')}
                onConfirm={() => {
                  setConfirmingRemove(false)
                  onRemovePhoto()
                }}
                onCancel={() => setConfirmingRemove(false)}
              />
            </div>
          )}

          {isEditing ? (
            <div className={`${CARD} p-4`}>
              {errorMessage && (
                <p role="alert" className="mb-4 rounded-md bg-red/10 px-3 py-2 text-small text-red-ink">
                  {errorMessage}
                </p>
              )}
              <EditProfileForm
                currentName={member.displayName}
                positions={positions}
                currentPositionId={member.position?.id ?? null}
                withShirtNumber
                currentShirtNumber={member.shirtNumber ?? null}
                isSaving={isSaving}
                errorCode={errorCode}
                onSubmit={onSubmit}
                onCancel={onCancelEdit}
              />
            </div>
          ) : (
            <>
              <div className={`${CARD} divide-y divide-border`}>
                <div className={ROW}>
                  <Hash size={18} className={ICON} aria-hidden="true" />
                  <span className="font-medium">{t('profileForm.shirtNumber')}</span>
                  <span className="ml-auto text-muted-foreground">{member.shirtNumber ?? t('profileForm.shirtNone')}</span>
                </div>
                <div className={ROW}>
                  <Shirt size={18} className={ICON} aria-hidden="true" />
                  <span className="font-medium">{t('profileForm.position')}</span>
                  <span className="ml-auto text-muted-foreground">{member.position?.label ?? t('position.unassigned')}</span>
                </div>
                <div className={ROW}>
                  <Shield size={18} className={ICON} aria-hidden="true" />
                  <span className="font-medium">{t('memberDetail.role')}</span>
                  <span className="ml-auto text-muted-foreground">{member.role === 'ADMIN' ? t('members.admin') : t('memberDetail.roleMember')}</span>
                </div>
              </div>
              {canEdit && (
                <Button variant="outline" onClick={onEdit}>
                  {t('memberDetail.editProfile')}
                </Button>
              )}
              {canAdminister && (
                <section>
                  <SectionLabel as="h3" className="mb-2 px-1 text-small">{t('memberDetail.adminGroup')}</SectionLabel>
                  {adminErrorMessage && (
                    <p role="alert" className="mb-2 rounded-md bg-red/10 px-3 py-2 text-small text-red-ink">
                      {adminErrorMessage}
                    </p>
                  )}
                  <div className={`${CARD} divide-y divide-border`}>
                    <div className={ROW}>
                      <Shirt size={18} className={ICON} aria-hidden="true" />
                      <span className="flex-1 font-medium">{t('profileForm.position')}</span>
                      <div className="w-40 shrink-0">
                        <PositionPicker
                          aria-label={t('members.positionFor', { name: member.displayName })}
                          positions={positions}
                          value={member.position?.id ?? null}
                          includeUnassigned
                          disabled={isAdminSaving}
                          onChange={(positionId) => onChangePosition?.(positionId)}
                        />
                      </div>
                    </div>
                    <button type="button" className={`${ROW_INTERACTIVE} disabled:opacity-50`} disabled={isAdminSaving} onClick={onToggleRole}>
                      <Shield size={18} className={ICON} aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {member.role === 'ADMIN' ? t('members.makeMember') : t('members.makeAdmin')}
                        </span>
                        <span className="block text-caption text-muted-foreground">
                          {member.role === 'ADMIN' ? t('memberDetail.makeMemberHint') : t('memberDetail.makeAdminHint')}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`${ROW_INTERACTIVE} font-semibold text-red-ink hover:bg-red/5 disabled:opacity-50`}
                      disabled={isAdminSaving}
                      onClick={() => setConfirmingRemoveMember(true)}
                    >
                      <Trash2 size={18} className="shrink-0" aria-hidden="true" />
                      {t('memberDetail.removeFromTeam')}
                    </button>
                  </div>
                  <ConfirmDialog
                    open={confirmingRemoveMember}
                    title={t('members.removeTitle')}
                    description={t('members.removeDescription', { name: member.displayName })}
                    confirmLabel={t('account.remove')}
                    onConfirm={() => {
                      setConfirmingRemoveMember(false)
                      onRemove?.()
                    }}
                    onCancel={() => setConfirmingRemoveMember(false)}
                  />
                </section>
              )}
              {canEdit && paymentAliases}
            </>
          )}
        </>
      )}
    </div>
  )
}
