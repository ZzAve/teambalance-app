import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Hash, Shield, Shirt } from 'lucide-react'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { MemberFace } from '@entities/member/ui/MemberFace'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'
import { PhotoPicker } from '@features/pick-photo/ui/PhotoPicker'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'

interface MemberDetailViewProps {
  /** Undefined while loading, on error, or when the id names nobody on the Roster. */
  member?: Member
  positions: Position[]
  isLoading?: boolean
  isError?: boolean
  /** The member themselves, or an Admin (ADR-0038). Role changes stay in team settings. */
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
  /** The viewer has a Personal Photo to copy into this Team. */
  hasPersonalPhoto: boolean
  isPhotoSaving: boolean
  photoErrorMessage?: string
  onUploadPhoto: (photo: Blob) => void
  onUsePersonalPhoto: () => void
  onRemovePhoto: () => void
}

const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'
const ROW = 'flex items-center gap-3 px-4 py-3 text-small'
const ICON = 'shrink-0 text-muted-foreground'

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
  hasPersonalPhoto,
  isPhotoSaving,
  photoErrorMessage,
  onUploadPhoto,
  onUsePersonalPhoto,
  onRemovePhoto,
}: MemberDetailViewProps) {
  const routes = useTeamRoutes()
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <Link to={routes.team} className="flex items-center gap-1 self-start text-small font-medium text-muted-foreground">
        <ArrowLeft size={16} aria-hidden="true" /> Team
      </Link>

      {isLoading && <p className="text-small text-muted-foreground">Loading…</p>}
      {isError && <p className="text-small text-red">Couldn't load this member. Please try again.</p>}
      {!isLoading && !isError && !member && (
        <p className="text-small text-muted-foreground">This person is not on the team.</p>
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
            <h2 className="font-display text-title font-bold">{member.displayName}</h2>
            <span className="text-small text-muted-foreground">{member.position?.label ?? 'Unassigned'}</span>
          </div>

          {(canChangePhoto || (canRemovePhoto && member.photoVersion)) && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {canChangePhoto && hasPersonalPhoto && (
                  <Button variant="outline" size="sm" disabled={isPhotoSaving} onClick={onUsePersonalPhoto}>
                    Use my personal photo
                  </Button>
                )}
                {canChangePhoto && (
                  <PhotoPicker
                    label={member.photoVersion ? 'Upload a different photo' : 'Upload photo'}
                    disabled={isPhotoSaving}
                    onPicked={onUploadPhoto}
                  />
                )}
                {canRemovePhoto && member.photoVersion && (
                  <Button variant="outline" size="sm" disabled={isPhotoSaving} onClick={() => setConfirmingRemove(true)}>
                    Remove photo
                  </Button>
                )}
              </div>
              {photoErrorMessage && <p className="text-small text-red">{photoErrorMessage}</p>}
              <ConfirmDialog
                open={confirmingRemove}
                title="Remove photo"
                description={
                  canChangePhoto
                    ? 'The team will see your initials until you add a new photo.'
                    : `Remove ${member.displayName}'s photo? Only they can add a new one.`
                }
                confirmLabel="Remove"
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
                <p role="alert" className="mb-4 rounded-md bg-red/10 px-3 py-2 text-small text-red">
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
                  <span className="font-medium">Shirt number</span>
                  <span className="ml-auto text-muted-foreground">{member.shirtNumber ?? 'None'}</span>
                </div>
                <div className={ROW}>
                  <Shirt size={18} className={ICON} aria-hidden="true" />
                  <span className="font-medium">Position</span>
                  <span className="ml-auto text-muted-foreground">{member.position?.label ?? 'Unassigned'}</span>
                </div>
                <div className={ROW}>
                  <Shield size={18} className={ICON} aria-hidden="true" />
                  <span className="font-medium">Role</span>
                  <span className="ml-auto text-muted-foreground">{member.role === 'ADMIN' ? 'Admin' : 'Member'}</span>
                </div>
              </div>
              {canEdit && (
                <Button variant="outline" onClick={onEdit}>
                  Edit profile
                </Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
