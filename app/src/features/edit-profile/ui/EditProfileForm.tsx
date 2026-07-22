import { useState, type FormEvent } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { validateDisplayName } from '../lib/validate-display-name'

interface EditProfileFormProps {
  currentName: string
  isSaving: boolean
  onSubmit: (name: string) => void
  /** Backend error discriminator surfaced by the container (e.g. "NAME_TAKEN"). */
  errorCode?: string
}

/**
 * Presentational edit-profile form. Owns only the local text field + touched state; the current
 * member query and the update mutation live in the /profile route container. Because it takes props
 * and never touches the network, every state (default, editing, saving, name-taken) is a story.
 */
export function EditProfileForm({ currentName, isSaving, onSubmit, errorCode }: EditProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [touched, setTouched] = useState(false)

  const validationError = validateDisplayName(name)
  const showValidationError = touched && validationError

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validationError) {
      setTouched(true)
      return
    }
    onSubmit(name.trim())
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
          aria-invalid={showValidationError ? true : undefined}
          placeholder="Your name"
        />
        {showValidationError && <p className="mt-1 text-sm text-red-500">{validationError}</p>}
        {errorCode === 'NAME_TAKEN' && (
          <p className="mt-1 text-sm text-red-500">That display name is already taken.</p>
        )}
      </div>
      <Button type="submit" disabled={isSaving || !!validationError}>
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
