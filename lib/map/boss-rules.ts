export const BOSS_THRESHOLDS: Record<string, number> = {
  'home-row': 18,
  'reach-keys': 24,
}

export function computeBossScore(wpm: number, accuracy: number): number {
  return Math.round(wpm * (accuracy / 100))
}

export function isBossWon(score: number, chapterId: string): boolean {
  return score >= (BOSS_THRESHOLDS[chapterId] ?? Infinity)
}
