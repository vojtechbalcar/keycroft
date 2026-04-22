export const REPLAY_MULTIPLIER = 0.25

const CHAPTER_RARE_MATERIAL: Record<string, string> = {
  'home-row': 'stone',
  'reach-keys': 'timber',
}

export function computeLessonGold(
  wpm: number,
  accuracy: number,
  isFirstClear: boolean,
): number {
  let base: number
  if (accuracy >= 95) base = 120
  else if (accuracy >= 85) base = 80
  else base = 40

  return isFirstClear ? base : Math.floor(base * REPLAY_MULTIPLIER)
}

export function computeBossGold(won: boolean): number {
  return won ? 200 : 50
}

export function computeRareDrop(won: boolean, chapterId: string): string | null {
  if (!won) return null
  return CHAPTER_RARE_MATERIAL[chapterId] ?? null
}
