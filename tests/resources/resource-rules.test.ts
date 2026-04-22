import { describe, expect, it } from 'vitest'
import {
  computeLessonGold,
  computeBossGold,
  computeRareDrop,
  REPLAY_MULTIPLIER,
} from '@/lib/resources/resource-rules'

describe('computeLessonGold', () => {
  it('returns 120 for first clear with accuracy >= 95', () => {
    expect(computeLessonGold(60, 97, true)).toBe(120)
  })

  it('returns 80 for first clear with accuracy 85-94', () => {
    expect(computeLessonGold(60, 90, true)).toBe(80)
  })

  it('returns 40 for first clear with accuracy < 85', () => {
    expect(computeLessonGold(60, 70, true)).toBe(40)
  })

  it('applies replay multiplier on subsequent clears', () => {
    expect(computeLessonGold(60, 97, false)).toBe(Math.floor(120 * REPLAY_MULTIPLIER))
  })
})

describe('computeBossGold', () => {
  it('returns 200 on win', () => {
    expect(computeBossGold(true)).toBe(200)
  })

  it('returns 50 on loss', () => {
    expect(computeBossGold(false)).toBe(50)
  })
})

describe('computeRareDrop', () => {
  it('returns stone on win for home-row chapter', () => {
    expect(computeRareDrop(true, 'home-row')).toBe('stone')
  })

  it('returns timber on win for reach-keys chapter', () => {
    expect(computeRareDrop(true, 'reach-keys')).toBe('timber')
  })

  it('returns null on loss', () => {
    expect(computeRareDrop(false, 'home-row')).toBeNull()
  })
})
