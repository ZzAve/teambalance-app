import { useState, type FormEvent } from 'react'
import type { Position } from '@shared/api/positions'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { validateDisplayName } from '../lib/validate-display-name'
import { validatePosition } from '../lib/validate-position'

interface EditProfileFormProps {
  currentName: string
  /** The team's position vocabulary. Empty → the picker is hidden and position is left untouched. */
  positions: Position[]
  currentPositionId: string | null
  isSaving: boolean
  onSubmit: (name: string, positionId: string | null) => void
  /** Backend error discriminator surfaced by the container (e.g. "NAME_TAKEN"). */
  errorCode?: string
}

/**
 * Presentational edit-profile form. Owns only the local field + touched state; the current member
 * query and the update mutation live in the /profile route container. Because it takes props and
 * never touches the network, every state (default, editing, saving, name-taken, position) is a story.
 * The position picker is required-when-available: shown (and mandatory) only if the team has positions.
 */
export function EditProfileForm({
  currentName,
  positions,
  currentPositionId,
  isSaving,
  onSubmit,
  errorCode,
}: EditProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [positionId, setPositionId] = useState<string | null>(currentPositionId)
  const [touched, setTouched] = useState(false)

  const nameError = validateDisplayName(name)
  const positionError = validatePosition(positions, positionId)
  const validationError = nameError ?? positionError

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validationError) {
      setTouched(true)
      return
    }
    onSubmit(name.trim(), positionId)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setTouched(true)
          }}
          aria-invalid={touched && nameError ? true : undefined}
          placeholder="Your name"
        />
        {touched && nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        {errorCode === 'NAME_TAKEN' && (
          <p className="mt-1 text-sm text-red-500">That display name is already taken.</p>
        )}
      </div>

      {positions.length > 0 && (
        <div>
          <Label htmlFor="position">Position</Label>
          <PositionPicker
            aria-label="Position"
            positions={positions}
            value={positionId}
            onChange={(id) => {
              setPositionId(id)
              setTouched(true)
            }}
          />
          {touched && positionError && <p className="mt-1 text-sm text-red-500">{positionError}</p>}
        </div>
      )}

      <Button type="submit" disabled={isSaving || !!validationError}>
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
