import type { SkillId } from '@/lib/skills/skill-definitions'

export function applySkillsToBossScore(
  wpm: number,
  accuracy: number,
  unlockedSkills: SkillId[],
): number {
  let effectiveWpm = wpm
  let effectiveAccuracy = accuracy

  if (unlockedSkills.includes('quick-hands')) {
    effectiveWpm += 5
  }

  if (unlockedSkills.includes('sharp-eye')) {
    effectiveAccuracy = Math.min(100, effectiveAccuracy * 1.2)
  }

  let score = Math.round(effectiveWpm * (effectiveAccuracy / 100))

  if (unlockedSkills.includes('clutch')) {
    score = Math.round(score * 1.2)
  }

  return score
}

export function applySkillsToLessonGold(
  baseGold: number,
  unlockedSkills: SkillId[],
): number {
  if (unlockedSkills.includes('resource-magnet')) {
    return Math.floor(baseGold * 1.15)
  }
  return baseGold
}

export function hasSecondChance(unlockedSkills: SkillId[]): boolean {
  return unlockedSkills.includes('second-chance')
}
