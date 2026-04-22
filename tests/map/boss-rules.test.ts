import { describe, expect, it } from 'vitest'
import { computeBossScore, isBossWon, BOSS_THRESHOLDS } from '@/lib/map/boss-rules'

describe('computeBossScore', () => {
  it('multiplies wpm by accuracy fraction', () => {
    expect(computeBossScore(30, 100)).toBe(30)
  })

  it('reduces score when accuracy is below 100', () => {
    expect(computeBossScore(30, 80)).toBe(24)
  })

  it('rounds to nearest integer', () => {
    expect(computeBossScore(30, 90)).toBe(27)
  })
})

describe('isBossWon', () => {
  it('returns true when score meets threshold for home-row', () => {
    expect(isBossWon(18, 'home-row')).toBe(true)
  })

  it('returns true when score exceeds threshold', () => {
    expect(isBossWon(25, 'home-row')).toBe(true)
  })

  it('returns false when score is below threshold', () => {
    expect(isBossWon(17, 'home-row')).toBe(false)
  })

  it('applies correct threshold for reach-keys', () => {
    expect(isBossWon(24, 'reach-keys')).toBe(true)
    expect(isBossWon(23, 'reach-keys')).toBe(false)
  })
})

describe('BOSS_THRESHOLDS', () => {
  it('has threshold 18 for home-row', () => {
    expect(BOSS_THRESHOLDS['home-row']).toBe(18)
  })

  it('has threshold 24 for reach-keys', () => {
    expect(BOSS_THRESHOLDS['reach-keys']).toBe(24)
  })
})
