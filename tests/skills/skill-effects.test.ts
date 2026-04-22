import { describe, expect, it } from 'vitest'
import {
  applySkillsToBossScore,
  applySkillsToLessonGold,
  hasSecondChance,
} from '@/lib/skills/skill-effects'

describe('applySkillsToBossScore', () => {
  it('returns base score with no skills', () => {
    expect(applySkillsToBossScore(20, 80, [])).toBe(Math.round(20 * (80 / 100)))
  })

  it('sharp-eye boosts accuracy weight', () => {
    const withSharpEye = applySkillsToBossScore(20, 80, ['sharp-eye'])
    const withoutSharpEye = applySkillsToBossScore(20, 80, [])
    expect(withSharpEye).toBeGreaterThan(withoutSharpEye)
  })

  it('quick-hands adds 5 to wpm before scoring', () => {
    const score = applySkillsToBossScore(20, 100, ['quick-hands'])
    expect(score).toBe(25)
  })

  it('clutch adds 20% bonus to final score', () => {
    const base = Math.round(20 * (100 / 100))
    const withClutch = applySkillsToBossScore(20, 100, ['clutch'])
    expect(withClutch).toBe(Math.round(base * 1.2))
  })

  it('stacks all performance skills', () => {
    const score = applySkillsToBossScore(20, 80, ['sharp-eye', 'quick-hands', 'clutch'])
    expect(score).toBeGreaterThan(20)
  })
})

describe('applySkillsToLessonGold', () => {
  it('returns base gold with no skills', () => {
    expect(applySkillsToLessonGold(100, [])).toBe(100)
  })

  it('resource-magnet adds 15%', () => {
    expect(applySkillsToLessonGold(100, ['resource-magnet'])).toBe(115)
  })
})

describe('hasSecondChance', () => {
  it('returns true when second-chance is unlocked', () => {
    expect(hasSecondChance(['resource-magnet', 'lucky-strike', 'second-chance'])).toBe(true)
  })

  it('returns false when second-chance is not unlocked', () => {
    expect(hasSecondChance(['resource-magnet'])).toBe(false)
  })
})
