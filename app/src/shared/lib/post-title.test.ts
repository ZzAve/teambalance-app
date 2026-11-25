import { describe, expect, it } from 'vitest'
import { postTitle } from './post-title'

describe('postTitle', () => {
  it('takes the first non-empty line without heading marks', () => {
    expect(postTitle('\n\n### Ball bag rotation\n- Week 46 — Lisa')).toBe('Ball bag rotation')
  })

  it('drops emphasis marks', () => {
    expect(postTitle('Clubhouse closes at **22:30** _sharp_ `today`')).toBe('Clubhouse closes at 22:30 sharp today')
  })

  it('is empty for blank text', () => {
    expect(postTitle('  \n ')).toBe('')
  })
})
