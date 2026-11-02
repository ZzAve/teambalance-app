import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhotoError, personalPhotoUrl, sendPhoto, teamPhotoUrl } from './photos'

function stubFetch(status: number, body = '') {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body || null, { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const rejection = (promise: Promise<unknown>) => promise.then(() => undefined, (e: unknown) => e as PhotoError)

describe('photo URLs', () => {
  it('carry the version, so a changed photo is a new URL', () => {
    expect(teamPhotoUrl('u 1', 'abc')).toBe('/api/members/u%201/photo?v=abc')
    expect(personalPhotoUrl('abc')).toBe('/api/account/photo?v=abc')
  })
})

describe('sendPhoto', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sends the image bytes with their own content type and the session cookie', async () => {
    const fetchMock = stubFetch(204)
    const photo = new Blob(['x'], { type: 'image/webp' })

    await sendPhoto('PUT', '/api/members/me/photo', photo)

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/members/me/photo')
    expect(init).toMatchObject({ method: 'PUT', credentials: 'include', body: photo })
    expect(init.headers).toEqual({ 'Content-Type': 'image/webp' })
  })

  it.each([
    [400, '{"code":"PHOTO_TOO_LARGE"}', '/api/account/photo', 'PHOTO_TOO_LARGE'],
    [400, '{"code":"INVALID_PHOTO"}', '/api/account/photo', 'INVALID_PHOTO'],
    [404, '', '/api/members/me/photo/from-personal', 'NO_PERSONAL_PHOTO'],
    [403, '{"code":"FORBIDDEN"}', '/api/members/u2/photo', 'FORBIDDEN'],
    [500, 'oops', '/api/account/photo', 'FAILED'],
  ])('maps a %i %s on %s to %s', async (status, body, path, code) => {
    stubFetch(status, body)
    const error = await rejection(sendPhoto('DELETE', path))
    expect(error).toBeInstanceOf(PhotoError)
    expect((error as PhotoError).code).toBe(code)
  })
})
