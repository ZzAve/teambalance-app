import { describe, expect, it } from 'vitest'
import { isHome, opponentOf } from './match-feed'

const match = {
  code: 'EA',
  link: 'https://api.nevobo.nl/permalink/wedstrijd/1',
  startTime: '2026-11-13T18:30:00Z',
  homeTeam: 'Servylo HS 1',
  awayTeam: 'Tovo HS 4',
  venue: 'De Mammoet',
}

describe('match feed helpers', () => {
  it('reads an away match from the team name, ignoring case and spaces', () => {
    expect(isHome(match, ' tovo hs 4 ')).toBe(false)
    expect(opponentOf(match, ' tovo hs 4 ')).toBe('Servylo HS 1')
  })

  it('reads a home match', () => {
    expect(isHome(match, 'Servylo HS 1')).toBe(true)
    expect(opponentOf(match, 'Servylo HS 1')).toBe('Tovo HS 4')
  })
})
