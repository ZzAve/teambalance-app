import { describe, expect, it } from 'vitest'
import { ACT_AS_EXPIRED_CODE, isActAsExpired } from './act-as-redirect'

describe('isActAsExpired', () => {
  it('recognises a lapsed act-as', () => {
    expect(isActAsExpired({ status: 403, code: ACT_AS_EXPIRED_CODE })).toBe(true)
  })

  // The whole reason the backend does not answer a generic 403: "your act-as ran out" sends the
  // operator back to the console, "you may not do this" is an error they read where they are.
  it('does NOT treat a genuine permission error as a lapse', () => {
    expect(isActAsExpired({ status: 403, code: 'NOT_TEAM_ADMIN' })).toBe(false)
    expect(isActAsExpired({ status: 403, code: 'NO_TEAM_MEMBERSHIP' })).toBe(false)
    expect(isActAsExpired({ status: 403, code: undefined })).toBe(false)
  })

  it('does NOT fire on other statuses carrying the same code', () => {
    expect(isActAsExpired({ status: 401, code: ACT_AS_EXPIRED_CODE })).toBe(false)
    expect(isActAsExpired({ status: 500, code: ACT_AS_EXPIRED_CODE })).toBe(false)
  })
})
