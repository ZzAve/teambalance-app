import { useState } from 'react'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'

interface GetStartedViewProps {
  member?: Member
  positions: Position[]
  isLoading: boolean
  isError: boolean
  isSaving: boolean
  /** Backend error discriminator from onboarding (NAME_TAKEN, NUMBER_TAKEN), shown inline. */
  errorCode?: string
  /** The member has a Personal Photo, so the copy can be offered (ADR-0038). */
  hasPersonalPhoto: boolean
  onSubmit: (name: string, positionId: string | null, shirtNumber: number | null, usePersonalPhoto: boolean) => void
}

/**
 * The one-time onboarding screen: name, position and Shirt Number, plus — when the member already
 * has a Personal Photo — a pre-ticked offer to use it in this Team, the moment that copy most often
 * happens (ADR-0038). Prop-only; the route container owns the queries and the mutations.
 */
export function GetStartedView({
  member,
  positions,
  isLoading,
  isError,
  isSaving,
  errorCode,
  hasPersonalPhoto,
  onSubmit,
}: GetStartedViewProps) {
  const [usePersonalPhoto, setUsePersonalPhoto] = useState(true)

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="font-display text-title font-bold">Welcome to TeamBalance</h1>
      <p className="mt-2 text-small text-muted-foreground">
        Let's set up your profile — tell us your name and where you play.
      </p>

      {isLoading && <p className="mt-6 text-small text-muted-foreground">Loading…</p>}
      {isError && <p className="mt-6 text-small text-red">Couldn't load your profile. Please try again.</p>}

      {member && (
        <div className="mt-6 flex flex-col gap-4">
          {hasPersonalPhoto && (
            <label className="flex items-center gap-2 text-small">
              <input
                type="checkbox"
                className="size-4 accent-green"
                checked={usePersonalPhoto}
                onChange={(e) => setUsePersonalPhoto(e.target.checked)}
              />
              Use my personal photo in this team
            </label>
          )}
          <EditProfileForm
            currentName={member.displayName}
            positions={positions}
            currentPositionId={member.position?.id ?? null}
            withShirtNumber
            currentShirtNumber={member.shirtNumber ?? null}
            isSaving={isSaving}
            errorCode={errorCode}
            onSubmit={(name, positionId, shirtNumber) =>
              onSubmit(name, positionId, shirtNumber, hasPersonalPhoto && usePersonalPhoto)
            }
          />
        </div>
      )}
    </div>
  )
}
