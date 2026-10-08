import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authMeQueryOptions } from './auth'
import { queryKeys } from './query-keys'

// Photos travel as image bytes, which Wirespec cannot describe, so these endpoints sit outside the
// generated client (ADR-0038). The JSON contract only carries each photo's version; the version goes
// into the image URL so a cached image is replaced the moment the photo changes.
const baseUrl = () => import.meta.env.VITE_API_URL ?? ''

export const teamPhotoUrl = (userId: string, version: string) =>
  `${baseUrl()}/api/members/${encodeURIComponent(userId)}/photo?v=${encodeURIComponent(version)}`

export const personalPhotoUrl = (version: string) => `${baseUrl()}/api/account/photo?v=${encodeURIComponent(version)}`

export class PhotoError extends Error {
  constructor(
    public readonly code: 'PHOTO_TOO_LARGE' | 'INVALID_PHOTO' | 'NO_PERSONAL_PHOTO' | 'FORBIDDEN' | 'FAILED',
    message: string,
  ) {
    super(message)
    this.name = 'PhotoError'
  }
}

export async function sendPhoto(method: 'PUT' | 'POST' | 'DELETE', path: string, body?: Blob) {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': body.type } : undefined,
    body,
  })
  if (res.ok) return
  const code = await res
    .json()
    .then((json: { code?: string }) => json.code)
    .catch(() => undefined)
  if (code === 'PHOTO_TOO_LARGE') throw new PhotoError(code, 'That photo is too large. Please pick another one.')
  if (code === 'INVALID_PHOTO') throw new PhotoError(code, "That file isn't a photo we can use.")
  if (res.status === 404 && path.endsWith('/from-personal')) {
    throw new PhotoError('NO_PERSONAL_PHOTO', "You don't have a personal photo yet.")
  }
  if (res.status === 403) throw new PhotoError('FORBIDDEN', 'You are not allowed to change this photo.')
  throw new PhotoError('FAILED', "Couldn't save the photo. Please try again.")
}

// Team Photo changes show up through the member list's `photoVersion`.
function useTeamPhotoMutation<T = void>(request: (input: T) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: request,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.members.all }),
  })
}

export const useUploadTeamPhoto = () =>
  useTeamPhotoMutation((photo: Blob) => sendPhoto('PUT', '/api/members/me/photo', photo))

export const useCopyPersonalPhotoToTeam = () =>
  useTeamPhotoMutation(() => sendPhoto('POST', '/api/members/me/photo/from-personal'))

export const useRemoveTeamPhoto = () =>
  useTeamPhotoMutation((userId: string) => sendPhoto('DELETE', `/api/members/${encodeURIComponent(userId)}/photo`))

// The Personal Photo's version rides on /me.
function usePersonalPhotoMutation<T = void>(request: (input: T) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: request,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authMeQueryOptions.queryKey }),
  })
}

export const useUploadPersonalPhoto = () =>
  usePersonalPhotoMutation((photo: Blob) => sendPhoto('PUT', '/api/account/photo', photo))

export const useRemovePersonalPhoto = () => usePersonalPhotoMutation(() => sendPhoto('DELETE', '/api/account/photo'))
