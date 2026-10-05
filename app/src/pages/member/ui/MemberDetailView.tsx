import { Link } from '@tanstack/react-router'
import { ArrowLeft, Hash, Shield, Shirt } from 'lucide-react'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { MemberFace } from '@entities/member/ui/MemberFace'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'
import { useTeamRoutes } from '@shared/lib/team-routes'
import { Button } from '@shared/ui/button'

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
  onEdit: () => void
  onCancelEdit: () => void
  onSubmit: (name: string, positionId: string | null, shirtNumber: number | null) => void
}

const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'
const ROW = 'flex items-center gap-3 px-4 py-3 text-small'
const ICON = 'shrink-0 text-muted-foreground'

/**
 * One Member's page, opened from the /team roster (ADR-0038): their face with the Shirt Number, then
 * number, Position and Role as a settings list. The member and Admins get an Edit button that swaps
 * the list for the profile form. Prop-only; the route container owns the queries, the mutation and
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
  onEdit,
  onCancelEdit,
  onSubmit,
}: MemberDetailViewProps) {
  const routes = useTeamRoutes()

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
            <MemberFace userId={member.userId} name={member.displayName} shirtNumber={member.shirtNumber} size="lg" />
            <h2 className="font-display text-title font-bold">{member.displayName}</h2>
            <span className="text-small text-muted-foreground">{member.position?.label ?? 'Unassigned'}</span>
          </div>

          {isEditing ? (
            <div className={`${CARD} p-4`}>
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
