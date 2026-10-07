import { useState, type FormEvent } from 'react'
import type { Position } from '@shared/api/positions'
import { PositionPicker } from '@entities/position/ui/PositionPicker'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { parseShirtNumber } from '../lib/parse-shirt-number'
import { validateDisplayName } from '../lib/validate-display-name'
import { validatePosition } from '../lib/validate-position'

interface EditProfileFormProps {
  currentName: string
  /** The team's position vocabulary. Empty → the picker is hidden and position is left untouched. */
  positions: Position[]
  currentPositionId: string | null
  /** Shows the Shirt Number field (ADR-0038). Off where the form edits only name and position. */
  withShirtNumber?: boolean
  currentShirtNumber?: number | null
  isSaving: boolean
  onSubmit: (name: string, positionId: string | null, shirtNumber: number | null) => void
  /** Renders a Cancel button beside Save when given. */
  onCancel?: () => void
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
  withShirtNumber = false,
  currentShirtNumber = null,
  isSaving,
  onSubmit,
  onCancel,
  errorCode,
}: EditProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [positionId, setPositionId] = useState<string | null>(currentPositionId)
  const [shirtNumberText, setShirtNumberText] = useState(currentShirtNumber?.toString() ?? '')
  const [touched, setTouched] = useState(false)

  const nameError = validateDisplayName(name)
  const positionError = validatePosition(positions, positionId)
  const shirtNumber = parseShirtNumber(shirtNumberText)
  const validationError = nameError ?? positionError ?? shirtNumber.error

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validationError) {
      setTouched(true)
      return
    }
    onSubmit(name.trim(), positionId, withShirtNumber ? shirtNumber.value : currentShirtNumber)
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
        {touched && nameError && <p className="mt-1 text-small text-red">{nameError}</p>}
        {errorCode === 'NAME_TAKEN' && (
          <p className="mt-1 text-small text-red">That display name is already taken.</p>
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
          {touched && positionError && <p className="mt-1 text-small text-red">{positionError}</p>}
        </div>
      )}

      {withShirtNumber && (
        <div>
          <Label htmlFor="shirtNumber">Shirt number</Label>
          <Input
            id="shirtNumber"
            name="shirtNumber"
            inputMode="numeric"
            value={shirtNumberText}
            onChange={(e) => {
              setShirtNumberText(e.target.value)
              setTouched(true)
            }}
            aria-invalid={touched && shirtNumber.error ? true : undefined}
            placeholder="None"
            className="w-24"
          />
          {touched && shirtNumber.error && <p className="mt-1 text-small text-red">{shirtNumber.error}</p>}
          {errorCode === 'NUMBER_TAKEN' && (
            <p className="mt-1 text-small text-red">That shirt number is already taken.</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isSaving || !!validationError}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
